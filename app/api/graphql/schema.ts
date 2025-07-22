import gql from "graphql-tag";

export const typeDefs = gql`
  type Item {
    id: ID!
    name: String!
    description: String
    imageUrl: String!
    userId: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    image: String!
    role: Role!
    items: [Item!]!
  }

  enum Role {
    ADMIN
    REG
  }

  type Query {
    items: [Item!]!
    item(id: ID!): Item!
    users: [User!]!
  }

  type Mutation {
    createItem(
      name: String!
      description: String
      imageUrl: String!
      userId: String!
    ): Item!
    deleteItem(id: ID!): Item
  }
`;
