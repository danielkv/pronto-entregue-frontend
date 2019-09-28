import gql from "graphql-tag";

export const OPTIONS_GROUP_FRAGMENT = gql`
	fragment OptionsGroupFields on OptionsGroup {
		id
		name
		active
		type
		order
		min_select
		max_select
		max_select_restrained_by {
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
			image
			active
			price
			options_qty
			createdAt
			category {
				name
			}
		}
	}
`;