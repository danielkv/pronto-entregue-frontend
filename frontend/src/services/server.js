import { ApolloClient } from "apollo-client";
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";

const host = 'http://localhost:4000/graphql';

const cache = new InMemoryCache();

const client = new ApolloClient({
	cache,
	link : createHttpLink({ uri: host }),
});

export default client;