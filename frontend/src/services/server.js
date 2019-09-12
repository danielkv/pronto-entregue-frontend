import { ApolloClient } from "apollo-client";
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";
import {setContext} from 'apollo-link-context';
import resolvers from '../resolvers';
import {GET_USER_TOKEN} from '../graphql/authentication';

const host = 'http://localhost:4000/graphql';

const cache = new InMemoryCache();
const httpLink = createHttpLink({ uri: host });

const initialData = {
	isUserLoggedIn : false,
	userToken:null,
	userCompanies:[],
	userBranches:[],
	selectedCompany:'',
	selectedBranch:'',
	user: '',
}

cache.writeData({data:initialData});

const authLink = setContext((_, {headers})=> {
	const {userToken} = cache.readQuery({query:GET_USER_TOKEN});
	
	if (userToken) headers = {...headers, authorization: `Bearer ${userToken}`};

	return {headers};
})

const client = new ApolloClient({
	cache,
	link : authLink.concat(httpLink),
	resolvers,
});

client.onResetStore(()=>cache.writeData({data:initialData}));

export default client;