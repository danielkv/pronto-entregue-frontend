import { ApolloClient } from "apollo-client";
import { split, from } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities';

import resolvers from '../../resolvers';
import cache, { initialData } from './apolloCache'
import authLink from "./authLink";
import uploadLink from "./uploadLink";
import webSocketLink from "./webSocketLink";

const client = new ApolloClient({
	cache,
	link: split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return (
				definition.kind === 'OperationDefinition' &&
				definition.operation === 'subscription'
			);
		},
		webSocketLink,
		from([authLink, uploadLink])
	),
	resolvers,
	//typeDefs: types,
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'cache-and-network'
		}
	}
});

// on reset cache listener
client.onResetStore(()=>cache.writeData({ data: initialData }));

// export apollo client
export default client;