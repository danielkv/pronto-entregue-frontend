import gql from "graphql-tag";

/**
 * Carrega infomações da empresa selecionada
 * 
 */
export const LOAD_SELECTED_COMPANY = gql`
	query ($id: ID!) {
		company (id: $id) {
			id
			name
			display_name
			metas {
				meta_type
				meta_value
			}
		}
	}
`;

/**
 * Retorna empresas selecionaveis
 */

export const GET_USER_COMPANIES = gql`
	query {
		userCompanies @client {
			id
			name
			display_name
			branches {
				id
				name
			}
		}
	}
`;

/**
 * Retorna empresa a partir do ID
 */

export const GET_USER_COMPANY = gql`
	query ($id:ID!) {
		userCompany (id:$id) @client {
			id
			name
			display_name
			branches {
				id
				name
			}
		}
	}
`;



/**
 * Retorna empresa selecionada
 */

export const GET_SELECTED_COMPANY = gql`
	query {
		selectedCompany @client {
			id
			name
			display_name
			branches {
				id
				name
			}
		}
	}
`;

/**
 * Seleciona empresa
 */

export const SELECT_COMPANY = gql`
	mutation ($id:ID!) {
		selectCompany (id:$id) @client {
			id
			name
			display_name
		}
	}
`;


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