import gql from "graphql-tag";

/**
 * Atualiza infomações da empresa no servidor
 * 
 */
export const GET_BRANCH_LAST_ORDERS = gql`
	query ($id:ID!, $limit:Int!, $filter:Filter) {
		branch(id: $id) {
			id
			orders (limit: $limit, filter:$filter) {
				id
				user {
					id
					full_name
				}
				street
				number
				products_qty
				type
				createdDate
				createdTime
				status
			}
		}
	}

`;

/**
 * Atualiza infomações da empresa no servidor
 * 
 */
export const GET_BRANCH_BEST_SELLERS = gql`
	query ($id:ID!, $limit:Int!, $createdAt:String) {
		branch(id: $id) {
			id
			best_sellers(limit: $limit, createdAt:$createdAt) {
				id
				name
				image
				qty
			}
		}
	}

`;

/**
 * Atualiza infomações da empresa no servidor
 * 
 */
export const GET_BRANCH_ORDERS_QTY = gql`
	query ($id: ID!, $filter:Filter) {
		branch (id: $id) {
			id
			orders_qty (filter:$filter)
		}
	}
`;

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

export const GET_COMPANY_BRANCHES = gql`
	query ($id:ID!, $filter: Filter) {
		company (id:$id) {
			id
			branches (filter: $filter) {
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

/**
  * Retorna métodos de pagamento da filial selecionada
  */
 
 export const LOAD_BRANCH_PAYMENT_METHODS = gql`
	query ($id:ID!) {
		branch (id:$id) {
			id
			paymentMethods {
				id
				name
				display_name
			}
		}
	}
 `;

export const ENABLE_PAYMENT_METHOD = gql`
	mutation ($id:ID!) {
		enablePaymentMethod (id:$id) {
			id
			name
		}
	}
`;

export const DISABLE_PAYMENT_METHOD = gql`
	mutation ($id:ID!) {
		disablePaymentMethod (id:$id) {
			id
			name
		}
	}
`;