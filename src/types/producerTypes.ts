import { GraphQLObjectType, GraphQLID, GraphQLString } from "graphql";

export const producerType = new GraphQLObjectType({
  name: "Producer",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    country: { type: GraphQLString },
    region: { type: GraphQLString },
  }),
});
