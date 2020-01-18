import gql from "graphql-tag";

export const AUTHENTICATE = gql`
	mutation Authenticate($token: String!) {
		authenticate (token: $token) {
			id
			fullName
			email
		}
	}
`;

/**
 * Recupera o Token do usuário salvo em cache 
 */
export const GET_USER_TOKEN = gql`
	query UserToken {
		userToken @client
	}
`;


/**
 * Recupera o Token do usuário salvo em cache 
 */
export const IS_USER_AUTHENTICATED = gql`
	query Authenticated {
		authenticated @client
	}
`;

/**
 * Recupera o Token do usuário salvo em cache 
 */
export const IS_USER_LOGGED_IN = gql`
	query IsUserLoggedIn{
		isUserLoggedIn @client
	}
`;

/**
 * GRAPHQL para fazer o login do usuário
 */

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			user {
				id
				fullName
				firstName
				lastName
				email
				role
				active
			}
			token
		}
	}
`;

export const GET_USER = gql`
	query GetUser ($id: ID!) {
		user (id: $id) {
			id
			fullName
			firstName
			lastName
			email
			role
			active
		}
	}
`;

export const LOGGED_USER_ID = gql`
	query LoggedUserId {
		loggedUserId @client
	}
`;