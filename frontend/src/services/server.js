import { ApolloClient } from "apollo-client";
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";
import {setContext} from 'apollo-link-context';
import resolvers from '../resolvers';
//import typeDefs from '../resolvers/types';

const host = 'http://localhost:4000/graphql';

const cache = new InMemoryCache();
const httpLink = createHttpLink({ uri: host });

const initialData = {
	isUserLoggedIn : false,
	userToken:null,
	/* user: {
		__typename:'User',
		id:0,
		full_name:'',
		first_name:'',
		last_name:'',
		email:'',
		role:'',
		active:false,
	} */
}

cache.writeData({data:initialData});

const authLink = setContext((_, {headers})=> {
	const token = localStorage.getItem('@flakery/userToken');
	
	if (token) {
		cache.writeData({data:{userToken:token}});
		headers = {...headers, authorization: `Bearer ${token}`};
	}

	return {headers};
})

const client = new ApolloClient({
	cache,
	link : authLink.concat(httpLink),
	//resolvers,
	//typeDefs
});

client.onResetStore(()=>cache.writeData({data:initialData}));

export default client;