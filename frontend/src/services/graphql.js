import gql from "graphql-tag";

/**
 * Carrega todas infomações ao acessar
 * 
 * companies, branches, 
 */
export const LOAD_INITIAL_DATA = gql`
	query init {
		me {
			companies
			branches
		}
	}
`;

/**
 * Pega o Token do usuário salvo em cache 
 */
export const GET_USER_TOKEN = gql`{userToken @client}`;

/**
 * GRAPHQL para fazer o login do usuário
 */

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			user {
				id
				full_name
				first_name
				last_name
				email
				role
				active
			}
			token
		}
	}
`;

/**
 * GRAPHQL para autenticação do usuário
 */

export const AUTHENTICATION = gql`
	query {
		me {
			id
			full_name
			first_name
			last_name
			email
			role
			active
		}
	}
`;
