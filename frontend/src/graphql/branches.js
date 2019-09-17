import gql from "graphql-tag";

/**
 * Atualiza infomações da empresa no servidor
 * 
 */
export const UPDATE_BRANCH = gql`
	mutation ($id: ID!, $data:BranchInput!) {
		updateBranch (id: $id, data:$data) {
			id
			name
			createdAt
			active
			metas {
				id
				meta_type
				meta_value
			}
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

/* export const GET_USER_BRANCHES = gql`
	query {
		userBranches @client {
			id
			name
			active
			last_month_revenue
			createdAt
		}
	}
`; */

/**
 * Retorna filiais selecionaveis
 */

export const GET_COMPANY_BRANCHES = gql`
	query ($id:ID!) {
		company (id:$id) {
			id
			branches {
				id
				name
				active
				last_month_revenue
				createdAt
			}
		}
	}
`;

/**
  * Retorna filial selecionada
  */
 
 export const GET_SELECTED_BRANCH = gql`
	query {
		selectedBranch @client
	}
 `;