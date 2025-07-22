import { createSchema, createYoga } from "graphql-yoga";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

export const config = {
  api: {
    bodyParser: false,
  },
};

const yoga = createYoga<{ request: Request }>({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response, Request, Headers },
});

export async function GET(request: Request) {
  return yoga.fetch(request);
}

export async function POST(request: Request) {
  return yoga.fetch(request);
}
