// src/types/producerTypes.ts
import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";

export const ProducerType = new GraphQLObjectType({
  name: "Producer",
  fields: {
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    country: { type: GraphQLString },
    region: { type: GraphQLString },
  },
});
