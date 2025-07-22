import { gql } from "@apollo/client";

export const GET_ITEMS = gql`
  query GetItems {
    items {
      id
      name
      description
      imageUrl
    }
  }
`;

export const CREATE_ITEM = gql`
  mutation CreateItem(
    $name: String!
    $description: String
    $imageUrl: String!
  ) {
    createItem(name: $name, description: $description, imageUrl: $imageUrl) {
      id
      name
      description
      imageUrl
    }
  }
`;

export const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id) {
      name
    }
  }
`;
