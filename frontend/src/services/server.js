import { ApolloClient } from "apollo-client";
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";
import {setContext} from 'apollo-link-context';
import resolvers from '../resolvers';
import {GET_USER_TOKEN, IS_USER_LOGGED_IN} from '../graphql/authentication';
import { GET_SELECTED_COMPANY } from "../graphql/companies";
import { GET_SELECTED_BRANCH } from "../graphql/branches";

const host = 'http://localhost:4000/graphql';

const cache = new InMemoryCache({});

const httpLink = createHttpLink({ uri: host });

const initialData = {
	isUserLoggedIn : false,
	userToken:null,
	selectedCompany: localStorage.getItem('@flakery/selectedCompany') || '',
	selectedBranch: localStorage.getItem('@flakery/selectedBranch') || '',
	user: '',
}

cache.writeData({data:initialData});

const authLink = setContext((_, {headers})=> {
	const {isUserLoggedIn} = cache.readQuery({query:IS_USER_LOGGED_IN});

	const {userToken} = cache.readQuery({query:GET_USER_TOKEN});
	if (userToken) headers = {...headers, authorization: `Bearer ${userToken}`};

	const {selectedCompany} = cache.readQuery({query:GET_SELECTED_COMPANY});
	if (isUserLoggedIn && selectedCompany) headers = {...headers, company_id: selectedCompany};
	
	const {selectedBranch} = cache.readQuery({query:GET_SELECTED_BRANCH});
	if (isUserLoggedIn && selectedBranch) headers = {...headers, branch_id: selectedBranch};
	
	return {headers};
})

const client = new ApolloClient({
	cache,
	link : authLink.concat(httpLink),
	resolvers,
});

client.onResetStore(()=>cache.writeData({data:initialData}));

export default client;