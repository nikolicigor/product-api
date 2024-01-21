import { GraphQLResolveInfo } from "graphql";
import Product from "../models/Product";

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

  static syncProducts(
    _: any,
    args: ProductArgs,
    context: any,
    info: GraphQLResolveInfo
  ): Promise<any> {
    // TODO
    return Promise.resolve(true);
  }
}

export default ProductResolvers;
