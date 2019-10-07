import gql from "graphql-tag";

export const SEARCH_BRANCH_PRODUCTS = gql`
	query ($search:String!) {
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
		options {
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
	query ($id: ID!) {
		optionsGroup (id:$id) {
			...OptionsGroupFields
		}
	}
	${OPTIONS_GROUP_FRAGMENT}
`;

export const LOAD_PRODUCT = gql`
	query ($id: ID!) {
		product (id: $id) {
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
			options_groups {
				...OptionsGroupFields
			}
		}
	}
	${OPTIONS_GROUP_FRAGMENT}
`;

export const CREATE_PRODUCT = gql`
	mutation ($data:ProductInput!) {
		createProduct (data:$data) {
			id
			name
			createdAt
			active
		}
	}
`;

export const GET_BRANCHES_PRODUCTS = gql`
	query ($id:ID!) {
		branch (id:$id) {
			id
			products {
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
	mutation ($id:ID!, $data:ProductInput!) {
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
			options_groups {
				...OptionsGroupFields
			}
		}
	}
	${OPTIONS_GROUP_FRAGMENT}
`;