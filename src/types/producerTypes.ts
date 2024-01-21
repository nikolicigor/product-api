import { GraphQLObjectType, GraphQLID, GraphQLString } from "graphql";

const ProducerType = new GraphQLObjectType({
  name: "Producer",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    country: { type: GraphQLString },
    region: { type: GraphQLString },
  }),
});

export default ProducerType;
