import gql from "graphql-tag";

export const typeDefs = gql`
  type Item {
    id: ID!
    name: String!
    description: String
    imageUrl: String!
  }

  type Query {
    items: [Item!]!
    item(id: ID!): Item!
  }

  type Mutation {
    createItem(name: String!, description: String, imageUrl: String!): Item!
    deleteItem(id: ID!): Item
  }
`;
