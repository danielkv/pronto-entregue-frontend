import { ApolloClient } from "apollo-client";
import { ApolloLink, from } from 'apollo-link'
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from 'apollo-upload-client';
import resolvers from '../resolvers';
import {GET_USER_TOKEN, IS_USER_LOGGED_IN} from '../graphql/authentication';
import { GET_SELECTED_COMPANY } from "../graphql/companies";
import { GET_SELECTED_BRANCH } from "../graphql/branches";

const host = process.env.NODE_ENV === 'development' ? 'http://localhost:4000/graphql' : 'https://flakery-backend.herokuapp.com/graphql';

const cache = new InMemoryCache({});

const uploadLink = createUploadLink({ uri: host });

const initialData = {
	loggedUserId: null,
	authenticated: false,
	initialized : false,
	isUserLoggedIn : false,
	userToken:null,
	selectedCompany: localStorage.getItem('@flakery/selectedCompany') || '',
	selectedBranch: localStorage.getItem('@flakery/selectedBranch') || '',
}

cache.writeData({data:initialData});

const authLink = new ApolloLink((operation, forward)=> {
	const {isUserLoggedIn} = cache.readQuery({query:IS_USER_LOGGED_IN});
	let set_headers = {};

	const {userToken} = cache.readQuery({query:GET_USER_TOKEN});
	if (userToken) set_headers.authorization = `Bearer ${userToken}`;

	const {selectedCompany} = cache.readQuery({query:GET_SELECTED_COMPANY});
	if (isUserLoggedIn && selectedCompany) set_headers.company_id = selectedCompany;
	
	const {selectedBranch} = cache.readQuery({query:GET_SELECTED_BRANCH});
	if (isUserLoggedIn && selectedBranch) set_headers.branch_id = selectedBranch;
		
	operation.setContext(({ headers }) => {
		return {
			headers: {...headers, ...set_headers}
		}
	});
	
	return forward(operation);
})

const client = new ApolloClient({
	cache,
	link : from([authLink, uploadLink]),
	resolvers,
});

client.onResetStore(()=>cache.writeData({data:initialData}));

export default client;