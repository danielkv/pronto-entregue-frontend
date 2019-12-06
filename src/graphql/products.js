import gql from "graphql-tag";

export const SEARCH_BRANCH_PRODUCTS = gql`
	query SearchProducts ($search:String!) {
		searchBranchProducts(search:$search) {
			id
			name
			category {
				id
				name
			}
		}
	}
`;

export const OPTIONS_GROUP_FRAGMENT = gql`
	fragment OptionsGroupFields on OptionsGroup {
		id
		name
		active
		type
		order
		min_select
		max_select
		groupRestrained {
			id
			name
		}
		restrainedBy {
			id
			name
		}
		action @client
		options (filter:$filter) {
			id
			name
			price
			item {
				id
				name
			}
			active
			max_select_restrain_other
			order
			action @client
		}
	}
`;

export const LOAD_OPTION_GROUP = gql`
	query ($id: ID!, $filter:Filter) {
		optionsGroup (id:$id) {
			...OptionsGroupFields
		}
	}
	${OPTIONS_GROUP_FRAGMENT}
`;

export const LOAD_PRODUCT = gql`
	query LoadProduct ($id: ID!, $filter:Filter) {
		product (id: $id) {
			id
			name
			type
			price
			featured
			description
			category {
				id
				name
			}
			image
			active
			options_groups(filter:$filter) {
				...OptionsGroupFields
			}
		}
	}
	${OPTIONS_GROUP_FRAGMENT}
`;

export const CREATE_PRODUCT = gql`
	mutation CreateProduct ($data:ProductInput!) {
		createProduct (data:$data) {
			id
			name
			createdAt
			active
		}
	}
`;

export const GET_BRANCHES_PRODUCTS = gql`
	query GetProducts ($id:ID!, $filter:Filter, $pagination: Pagination) {
		branch (id:$id) {
			id
			countProducts(filter: $filter)
			products(filter: $filter, pagination: $pagination) {
				id
				name
				image
				active
				price
				options_qty
				createdAt
				category {
					id
					name
				}
			}
		}
	}
`;

export const UPDATE_PRODUCT = gql`
	mutation UpdateProduct ($id:ID!, $data:ProductInput!, $filter:Filter) {
		updateProduct (id:$id, data:$data) {
			id
			name
			type
			price
			description
			category {
				id
				name
			}
			image
			active
			options_groups (filter:$filter) {
				...OptionsGroupFields
			}
		}
	}
	${OPTIONS_GROUP_FRAGMENT}
`;