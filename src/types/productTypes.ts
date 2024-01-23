import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";
import Producer from "../models/Producer";
import { producerType } from "./producerTypes";

export const productType = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    _id: { type: GraphQLID },
    vintage: { type: GraphQLString },
    name: { type: GraphQLString },
    producerId: { type: GraphQLID },
    producer: {
      type: producerType,
      resolve(parent) {
        return Producer.findById(parent.producerId);
      },
    },
  }),
});
