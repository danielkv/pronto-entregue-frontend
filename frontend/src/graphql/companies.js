import gql from "graphql-tag";

/**
 * Atualiza infomações da empresa no servidor
 * 
 */
export const LOAD_COMPANY = gql`
	mutation ($id: ID!) {
		company (id: $id, data:$data) {
			id
			name
			display_name
			createdAt
			active
			branches {
				id
				name
			}
			metas {
				id
				meta_type
				meta_value
			}
		}
	}
`;
/**
 * Atualiza infomações da empresa no servidor
 * 
 */
export const UPDATE_COMPANY = gql`
	mutation ($id: ID!, $data:CompanyInput!) {
		updateCompany (id: $id, data:$data) {
			id
			name
			display_name
			createdAt
			active
			branches {
				id
				name
			}
			metas {
				id
				meta_type
				meta_value
				action
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
			createdAt
			last_month_revenue
			active
			branches {
				id
				name
				active
				last_month_revenue
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