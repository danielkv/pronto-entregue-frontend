import gql from "graphql-tag";

export const GET_BRANCH_LAST_ORDERS = gql`
	query GetLastOrders ($id:ID!, $filter:Filter, $pagination: Pagination) {
		branch(id: $id) {
			id
			orders (filter: $filter, pagination: $pagination) {
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

export const GET_BRANCH_BEST_SELLERS = gql`
	query BestSellers ($id:ID!, $filter:Filter, $pagination: Pagination) {
		branch(id: $id) {
			id
			best_sellers (filter: $filter, pagination: $pagination) {
				id
				name
				image
				qty
			}
		}
	}

`;

export const GET_BRANCH_ORDERS_QTY = gql`
	query OrdersQty($id: ID!, $filter:Filter) {
		branch (id: $id) {
			id
			countOrders (filter:$filter)
		}
	}
`;

export const UPDATE_BRANCH = gql`
	mutation UpdateBranch ($id: ID!, $data:BranchInput!) {
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

export const SELECT_BRANCH = gql`
	mutation SetSelectedBranch ($id:ID!) {
		selectBranch (id:$id) @client {
			id
			name
		}
	}
`;

export const GET_COMPANY_BRANCHES = gql`
	query Branches ($id:ID!, $filter: Filter, $pagination: Pagination) {
		company (id:$id) {
			id
			countBranches(filter: $filter)
			branches (filter: $filter, pagination: $pagination) {
				id
				name
				active
				last_month_revenue
				createdAt
			}
		}
	}
`;
 
 export const GET_SELECTED_BRANCH = gql`
	query GetSelectedBranch {
		selectedBranch @client
	}
 `;
 
 export const LOAD_BRANCH_PAYMENT_METHODS = gql`
	query LoadPaymentMethods ($id:ID!) {
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
	mutation EnablePaymentMethod ($id:ID!) {
		enablePaymentMethod (id:$id) {
			id
			name
		}
	}
`;

export const DISABLE_PAYMENT_METHOD = gql`
	mutation DisablePaymentMethod ($id:ID!) {
		disablePaymentMethod (id:$id) {
			id
			name
		}
	}
`;