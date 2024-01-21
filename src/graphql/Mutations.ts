import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLList,
} from "graphql";
import Product from "../models/Product";
import ProductType from "../types/productTypes";

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
        const product = new Product({
          vintage: args.vintage,
          name: args.name,
          producerId: args.producerId,
        });
        return product.save();
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

export default Mutation;
