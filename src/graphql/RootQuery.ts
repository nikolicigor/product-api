import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
} from "graphql";
import ProductType from "../types/productTypes";
import ProductResolvers from "../resolvers/productResolvers";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    product: {
      type: ProductType,
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: ProductResolvers.product,
    },
    productsByProducer: {
      type: new GraphQLList(ProductType),
      args: { producerId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: ProductResolvers.productsByProducer,
    },
  },
});

export default RootQuery;
