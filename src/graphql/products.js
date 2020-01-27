import gql from "graphql-tag";

export const OPTIONS_GROUP_FRAGMENT = gql`
	fragment OptionsGroupFields on OptionsGroup {
		id
		name
		active
		type
		order
		minSelect
		maxSelect
		groupRestrained {
			id
			name
		}
		restrainedBy {
			id
			name
		}
		options {
			id
			name
			price
			active
			maxSelectRestrainOther
			order
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
			campaigns {
				id
				name
				masterOnly
			}
			category {
				id
				name
			}
			image
			active
			optionsGroups(filter:$filter) {
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

export const SEARCH_PRODUCTS = gql`
	mutation SearchProducts ($search: String, $exclude: [ID], $companies: [ID]) {
		searchProducts(search: $search, exclude: $exclude, companies: $companies) {
			id
			name
			image
			price
			company {
				id
				name
			}
			category {
				id
				name
			}
		}
	}
`;

export const GET_COMPANY_PRODUCTS = gql`
	query GetProducts ($id:ID!, $filter:Filter, $pagination: Pagination) {
		company (id:$id) {
			id
			countProducts(filter: $filter)
			products(filter: $filter, pagination: $pagination) {
				id
				name
				image
				active
				price
				countFavoritedBy
				countCampaigns
				countOptions
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
	mutation UpdateProduct ($id:ID!, $data: ProductInput!, $filter:Filter) {
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
			optionsGroups (filter:$filter) {
				...OptionsGroupFields
			}
		}
	}
	${OPTIONS_GROUP_FRAGMENT}
`;

export const GET_COMPANY_BEST_SELLERS = gql`
	query BestSellers ($id:ID!, $filter: Filter, $pagination: Pagination) {
		company(id: $id) {
			id
			bestSellers (filter: $filter, pagination: $pagination) {
				id
				name
				image
				qty
			}
		}
	}

`;

export const SEARCH_OPTIONS_GROUPS = gql`
	query ($search:String!) {
		searchOptionsGroups(search: $search) {
			id
			name
			countOptions
			product {
				id
				name
				category {
					id
					name
				}
			}
		}
	}
`;