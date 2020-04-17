import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink, split, from } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws';
import { createUploadLink } from 'apollo-upload-client';
import { getMainDefinition } from 'apollo-utilities';

import resolvers from '../resolvers';

import { GET_USER_TOKEN, IS_USER_LOGGED_IN } from '../graphql/authentication';
import { GET_SELECTED_COMPANY } from "../graphql/companies";

const host = process.env.NODE_ENV === 'production' ? 'https://pronto-entregue-backend.herokuapp.com/graphql' : 'http://localhost:4000/graphql';

const cache = new InMemoryCache({});

const uploadLink = createUploadLink({ uri: host });

const wsLink = new WebSocketLink({
	uri: process.env.NODE_ENV === 'production' ? 'wss://pronto-entregue-backend.herokuapp.com/graphql' : `ws://localhost:4000/graphql`,
	options: {
		reconnect: true
	}
});

const initialData = {
	loggedUserId: null,
	loadingInit: true,
	initialized: false,
	isUserLoggedIn: false,
	userToken: null,
	ordersRoll: [],
	selectedCompany: localStorage.getItem('@prontoentregue/selectedCompany') || '',
}

cache.writeData({ data: initialData });

const authLink = new ApolloLink((operation, forward)=> {
	const { isUserLoggedIn } = cache.readQuery({ query: IS_USER_LOGGED_IN });
	let setHeaders = {};

	const { userToken } = cache.readQuery({ query: GET_USER_TOKEN });
	if (userToken) setHeaders.authorization = `Bearer ${userToken}`;

	const { selectedCompany } = cache.readQuery({ query: GET_SELECTED_COMPANY });
	if (isUserLoggedIn && selectedCompany) setHeaders.companyId = selectedCompany;
		
	operation.setContext(({ headers }) => {
		return {
			headers: { ...headers, ...setHeaders }
		}
	});
	
	return forward(operation);
})

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
		wsLink,
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

client.onResetStore(()=>cache.writeData({ data: initialData }));

export default client;