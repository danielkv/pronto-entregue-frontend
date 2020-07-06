import { ApolloLink } from 'apollo-link';

import cache from './apolloCache';

import { GET_USER_TOKEN, IS_USER_LOGGED_IN } from '../../graphql/authentication';
import { GET_SELECTED_COMPANY } from "../../graphql/companies";

export default new ApolloLink((operation, forward)=> {
	// define admin connection
	let setHeaders = { adminconnection: true };

	const { isUserLoggedIn } = cache.readQuery({ query: IS_USER_LOGGED_IN });

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