import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean,
  GraphQLSchema,
} from "graphql";
import producer from "../models/Producer";
import product from "../models/Product";

const ProducerType = new GraphQLObjectType({
  name: "Producer",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    country: { type: GraphQLString },
    region: { type: GraphQLString },
  }),
});

const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    _id: { type: GraphQLID },
    vintage: { type: GraphQLString },
    name: { type: GraphQLString },
    producerId: { type: GraphQLID },
    producer: {
      type: ProducerType,
      resolve(parent) {
        return producer.findById(parent.producerId);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    product: {
      type: ProductType,
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return product.findById(args._id);
      },
    },
    productsByProducer: {
      type: new GraphQLList(ProductType),
      args: { producerId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return product.find({ producerId: args.producerId });
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
        const product1 = new product({
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
        return product.findByIdAndUpdate(args._id, args, { new: true });
      },
    },
    deleteProducts: {
      type: GraphQLBoolean,
      args: {
        ids: { type: new GraphQLList(GraphQLID) },
      },
      resolve(_, args) {
        return product.deleteMany({ _id: { $in: args.ids } }).then(() => true);
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
