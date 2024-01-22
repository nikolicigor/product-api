import { GraphQLResolveInfo } from "graphql";
import Product from "../models/Product";
import * as fs from "fs";
import { parse } from "csv-parse";
import { Transform } from "stream";
import axios from "axios";

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

      // Make an HTTP request to get the CSV data
      const response = await axios.get(
        "https://api.frw.co.uk/feeds/all_listings.csv",
        { responseType: "stream" }
      );

      const stream = response.data
        .pipe(parse({ columns: true }))
        .on("error", (error: any) => {
          console.error("Stream error:", error);
        });

      let batch: any = [];

      const transformStream = new Transform({
        objectMode: true,
        transform: async (product, encoding, callback) => {
          const filter = {
            vintage: product.Vintage,
            name: product["Product Name"],
            producerId: product.Producer,
          };

          batch.push({
            updateOne: {
              filter: filter,
              update: { $set: filter },
              upsert: true,
            },
          });

          if (batch.length >= 100) {
            await Product.bulkWrite(batch);
            batch = [];
          }

          callback();
        },
      });

      stream.pipe(transformStream);

      transformStream.on("end", async () => {
        if (batch.length > 0) {
          await Product.bulkWrite(batch);
        }

        console.log("Product synchronization completed.");
      });

      transformStream.on("error", (error) => {
        console.error("Stream error:", error);
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default ProductResolvers;
