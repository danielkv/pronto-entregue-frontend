import gql from "graphql-tag";
import client from './server';

const LOAD_INITIAL_DATA = gql`
	query init ($user_id:ID!) {
		user(id:$user_id) {
			companies
			branches
		}
	}
`;

const GET_USER_TOKEN = gql`
	{
		userToken @client 
	}
`;

export function canLogin () {
	const {userToken} = client.readQuery({query:GET_USER_TOKEN});
	if (userToken) return true;
	return false;
}

function init() {
	if (!canLogin()) {
		if (window.location.pathname !== '/login') return window.location.href = '/login';
	} else {
		if (window.location.pathname === '/login') return window.location.href = '/';
	}

	//Load inital data


}

init();



