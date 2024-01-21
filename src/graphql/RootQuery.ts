import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
} from "graphql";
import Product from "../models/Product";
import ProductType from "../types/productTypes";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    product: {
      type: ProductType,
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return Product.findById(args._id);
      },
    },
    productsByProducer: {
      type: new GraphQLList(ProductType),
      args: { producerId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return Product.find({ producerId: args.producerId });
      },
    },
  },
});

export default RootQuery;
