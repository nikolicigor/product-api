import { GraphQLResolveInfo } from "graphql";
import Product from "../models/Product";
import Producer from "../models/Producer";
import { Transform } from "stream";
import axios from "axios";
const csv = require("csvtojson");
var pipeline = require("stream/promises").pipeline;

interface ProductArgs {
  _id?: string;
  vintage?: string;
  name?: string;
  producerId?: string;
  ids?: string[];
}

interface RootQueryArgs {
  _id?: string;
  producerId?: string;
}

class ProductResolvers {
  static product(_: any, args: RootQueryArgs): Promise<any> {
    return Product.findById(args._id);
  }

  static productsByProducer(_: any, args: RootQueryArgs): Promise<any[]> {
    return Product.find({ producerId: args.producerId });
  }

  static createProduct(_: any, args: ProductArgs): Promise<any> {
    const product = new Product({
      vintage: args.vintage,
      name: args.name,
      producerId: args.producerId,
    });
    return product.save();
  }

  static updateProduct(_: any, args: ProductArgs): Promise<any | null> {
    return Product.findByIdAndUpdate(args._id, args, { new: true });
  }

  static deleteProducts(_: any, args: ProductArgs): Promise<boolean> {
    return Product.deleteMany({ _id: { $in: args.ids } }).then(() => true);
  }

  static async syncProducts(
    _: any,
    _args: ProductArgs,
    _context: any,
    _info: GraphQLResolveInfo
  ): Promise<boolean> {
    try {
      console.log("Mutation: synchronizeProducts");
      process.nextTick(() => true);

      const stream = await axios
        .get("https://api.frw.co.uk/feeds/all_listings.csv", {
          responseType: "stream",
        })
        .then((response) => response.data)
        .catch((error) => {
          console.error("HTTP request error:", error);
          throw error;
        });

      let batch: any = [];
      let tmp = new Map<string, any>();
      let counter = 0;

      const filterStream = new Transform({
        objectMode: true,
        async transform(product, encoding, callback) {
          if (
            !product["Product Name"] ||
            !product["Vintage"] ||
            !product["Producer"]
          ) {
            callback(null);
            return;
          } else {
            callback(null, product);
          }
        },
      });

      const transformStream = new Transform({
        objectMode: true,
        async transform(product, encoding, callback) {
          if (counter % 1000 === 0) {
            console.log(counter);
          }
          counter++;

          const filter = {
            vintage: product.Vintage,
            name: product["Product Name"],
          };

          const key = `${product.Vintage}-${product["Product Name"]}-${product["Producer"]}`;

          if (!tmp.has(key)) {
            tmp.set(key, product);
          }

          if (tmp.size >= 100) {
            for (const [key, value] of tmp) {
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
                  filter: filter,
                  update: product,
                  upsert: true,
                },
              });
            }
            await ProductResolvers.bulkWriteProducts(batch);
            batch = [];
            tmp = new Map<string, any>();
          }

          callback(null);
        },
      });

      await pipeline(
        stream,
        csv({ delimiter: "," }, { objectMode: true }),
        filterStream,
        transformStream
      );

      console.log("Product synchronization completed.");

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

export default ProductResolvers;
