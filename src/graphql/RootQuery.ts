import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
} from "graphql";
import ProductResolvers from "../resolvers/productResolvers";
import { productType } from "../types/productTypes";

export const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    product: {
      type: productType,
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: ProductResolvers.product,
    },
    productsByProducer: {
      type: new GraphQLList(productType),
      args: { producerId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: ProductResolvers.productsByProducer,
    },
  },
});
