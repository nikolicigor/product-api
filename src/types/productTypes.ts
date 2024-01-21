import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";
import ProducerType from "./producerTypes";
import Producer from "../models/Producer";

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
        return Producer.findById(parent.producerId);
      },
    },
  }),
});

export default ProductType;
