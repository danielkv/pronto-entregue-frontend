import gql from "graphql-tag";

/**
 * Seleciona filial
 */

export const SELECT_BRANCH = gql`
	mutation ($id:ID!) {
		selectBranch (id:$id) @client {
			id
			name
		}
	}
`;

/**
 * Retorna filiais selecionaveis
 */

export const GET_USER_BRANCHES = gql`
	query {
		userBranches @client {
			id
			name
		}
	}
`;

/**
 * Retorna filial a partir do ID
 */

export const GET_USER_BRANCH = gql`
	query ($id:ID!) {
		userBranch (id:$id) @client {
			id
			name
		}
	}
`;

/**
  * Retorna filial selecionada
  */
 
 export const GET_SELECTED_BRANCH = gql`
	 query {
		 selectedBranch @client {
			 id
			 name
		 }
	 }
 `;