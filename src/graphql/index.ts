import { GraphQLSchema } from "graphql";
import { RootQuery } from "./RootQuery";
import { Mutation } from "./Mutations";

export const graphQLSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
