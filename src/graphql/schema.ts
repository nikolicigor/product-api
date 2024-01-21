import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean,
  GraphQLSchema,
} from "graphql";
import ProductType from "../types/productTypes";
import Product from "../models/Product";

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

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createProduct: {
      type: ProductType,
      args: {
        vintage: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        producerId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(_, args) {
        const product1 = new Product({
          vintage: args.vintage,
          name: args.name,
          producerId: args.producerId,
        });
        return product1.save();
      },
    },
    updateProduct: {
      type: ProductType,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
        vintage: { type: GraphQLString },
        name: { type: GraphQLString },
        producerId: { type: GraphQLID },
      },
      resolve(_, args) {
        return Product.findByIdAndUpdate(args._id, args, { new: true });
      },
    },
    deleteProducts: {
      type: GraphQLBoolean,
      args: {
        ids: { type: new GraphQLList(GraphQLID) },
      },
      resolve(_, args) {
        return Product.deleteMany({ _id: { $in: args.ids } }).then(() => true);
      },
    },
    syncProducts: {
      type: GraphQLBoolean,
      resolve() {
        // TODO
        return true;
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
