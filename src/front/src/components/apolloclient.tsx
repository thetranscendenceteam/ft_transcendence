import { ApolloClient, DefaultOptions, InMemoryCache } from "@apollo/client";

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

const apolloClient = new ApolloClient({
    uri: "https://localhost:8443/graphql",
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
  });

export default apolloClient;
