import { useQuery } from "@apollo/react-hooks";

import { LOGGED_USER_ID, GET_USER } from "../graphql/authentication";
import { GET_SELECTED_COMPANY } from "../graphql/companies";

export function useLoggedUserId() {
	const { data: { loggedUserId = '' } = {} } = useQuery(LOGGED_USER_ID);

	return loggedUserId;
}

export function useSelectedCompany() {
	const { data: { selectedCompany = null } = {} } = useQuery(GET_SELECTED_COMPANY);

	return selectedCompany;
}

export function useLoggedUserRole() {
	const { data: { loggedUserId } } = useQuery(LOGGED_USER_ID);
	const { data: { user: { role = null } = {} } = {} } = useQuery(GET_USER, { fetchPolicy: 'cache-first', variables: { id: loggedUserId } });

	return role;
}