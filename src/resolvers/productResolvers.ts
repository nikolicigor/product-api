import { GraphQLResolveInfo } from "graphql";
import Product from "../models/Product";
import Producer from "../models/Producer";
import { Transform } from "stream";
import axios from "axios";
import csv from "csvtojson";
import { pipeline } from "stream/promises";

type ProductArgs = {
  _id?: string;
  vintage?: string | string[];
  name?: string | string[];
  producerId?: string | string[];
  ids?: string[];
};

type RootQueryArgs = {
  _id?: string;
  producerId?: string;
};

const LINK_TO_CSV = process.env.LINK_TO_CSV
  ? process.env.LINK_TO_CSV
  : "https://api.frw.co.uk/feeds/all_listings.csv";

export default class ProductResolvers {
  static async product(_: any, args: RootQueryArgs): Promise<any> {
    return Product.findById(args._id);
  }

  static async productsByProducer(_: any, args: RootQueryArgs): Promise<any[]> {
    return Product.find({ producerId: args._id });
  }

  static async createProduct(_: any, args: ProductArgs): Promise<any> {
    const product = new Product({
      vintage: args.vintage,
      name: args.name,
      producerId: args.producerId,
    });
    return product.save();
  }

  static async createProducts(_: any, args: any): Promise<any[]> {
    const products = args.products.map((product) => {
      return {
        vintage: product.vintage,
        name: product.name,
        producerId: product.producerId,
      };
    });
    return Product.insertMany(products);
  }

  static async updateProduct(_: any, args: ProductArgs): Promise<any | null> {
    return Product.findByIdAndUpdate(args._id, args, { new: true });
  }

  static async deleteProducts(_: any, args: ProductArgs): Promise<boolean> {
    await Product.deleteMany({ _id: { $in: args.ids } });
    return true;
  }

  static async syncProducts(
    _: any,
    _args: ProductArgs,
    _context: any,
    _info: GraphQLResolveInfo
  ): Promise<boolean> {
    try {
      console.log("Mutation: synchronizeProducts");
      process.nextTick(async () => {
        const stream = await axios.get(LINK_TO_CSV, {
          responseType: "stream",
        });

        const filterStream = new Transform({
          objectMode: true,
          async transform(product, _encoding, callback) {
            if (
              !product["Product Name"] ||
              !product["Vintage"] ||
              !product["Producer"]
            ) {
              callback(null);
              return;
            }

            callback(null, product);
          },
        });

        let productMap = new Map<string, any>();
        const transformStream = new Transform({
          objectMode: true,
          async transform(product, _encoding, callback) {
            const key = `${product.Vintage}-${product["Product Name"]}-${product["Producer"]}`;

            if (!productMap.has(key)) {
              productMap.set(key, product);
            }

            const batch: any = [];
            if (productMap.size >= 100) {
              for (const [key, value] of productMap) {
                const producer = await ProductResolvers.findOrCreateProducer(
                  value
                );

                const product = {
                  vintage: value.Vintage,
                  name: value["Product Name"],
                  producerId: producer.id,
                };

                batch.push({
                  updateOne: {
                    filter: product,
                    update: product,
                    upsert: true,
                  },
                });
              }
              await ProductResolvers.bulkWriteProducts(batch);
              productMap = new Map<string, any>();
            }

            callback(null);
          },
        });

        await pipeline(
          stream.data,
          csv({ delimiter: "," }, { objectMode: true }),
          filterStream,
          transformStream
        );

        console.log("Product synchronization completed.");
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  static async bulkWriteProducts(batch: any) {
    if (batch.length > 0) {
      await Product.bulkWrite(batch);
    }
  }

  static async findOrCreateProducer(value: any): Promise<any> {
    const producer = await Producer.findOne({
      name: value["Producer"],
      country: value["Country"],
      region: value["Region"],
    });

    if (producer) {
      return producer;
    } else {
      const newProducer = new Producer({
        name: value["Producer"],
        country: value["Country"],
        region: value["Region"],
      });

      return await newProducer.save();
    }
  }
}
