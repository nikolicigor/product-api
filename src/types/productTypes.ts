// src/types/productTypes.ts
import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";
import { ProducerType } from "./producerTypes";

export const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: {
    _id: { type: GraphQLID },
    vintage: { type: GraphQLString },
    name: { type: GraphQLString },
    producerId: { type: GraphQLID },
    producer: { type: ProducerType },
  },
});
