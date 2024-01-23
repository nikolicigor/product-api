import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLList,
} from "graphql";
import ProductResolvers from "../resolvers/productResolvers";
import { productType } from "../types/productTypes";

export const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createProduct: {
      type: productType,
      args: {
        vintage: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        producerId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: ProductResolvers.createProduct,
    },
    updateProduct: {
      type: productType,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
        vintage: { type: GraphQLString },
        name: { type: GraphQLString },
        producerId: { type: GraphQLID },
      },
      resolve: ProductResolvers.updateProduct,
    },
    deleteProducts: {
      type: GraphQLBoolean,
      args: {
        ids: { type: new GraphQLList(GraphQLID) },
      },
      resolve: ProductResolvers.deleteProducts,
    },
    syncProducts: {
      type: GraphQLBoolean,
      resolve: ProductResolvers.syncProducts,
    },
  },
});
