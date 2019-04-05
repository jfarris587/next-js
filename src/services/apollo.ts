import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import fetch from "isomorphic-unfetch";
const isBrowser = typeof window !== "undefined";

declare global {
  namespace NodeJS {
    interface Global {
      fetch?: any;
    }
  }
}

let apolloClient = null;

if (!isBrowser) {
  global.fetch = fetch;
}

function create(initialState) {
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link: new HttpLink({
      uri: `https://graphql.contentful.com/content/v1/spaces/${
        process.env.CONTENTFUL_SPACE
      }`,
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_CDA_TOKEN}`
      },
      credentials: "same-origin"
    }),
    cache: new InMemoryCache().restore(initialState || {})
  });
}

export default function initApollo(initialState?: any) {
  if (!isBrowser) {
    return create(initialState);
  }

  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
