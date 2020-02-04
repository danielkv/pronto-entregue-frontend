import gql from "graphql-tag";

export const LOAD_CATEGORY = gql`
	query ($id: ID!) {
		category (id: $id) {
			id
			name
			image
			description
			createdAt
			active
		}
	}
`;


export const GET_COMPANY_CATEGORIES = gql`
	query GetCompanyCategories ($id: ID!, $filter: Filter, $pagination: Pagination) {
		company (id: $id) {
			id
			countCategories(filter: $filter)
			categories(filter: $filter, pagination: $pagination) {
				id
				name
				image
				order
				countProducts
				createdAt
				active
			}
		}
	}
`;

export const UPDATE_CATEGORY = gql`
	mutation UpdateCategory ($id: ID!, $data: CategoryInput!) {
		updateCategory (id: $id, data:$data) {
			id
			name
			image
			description
			active
		}
	}
`;

export const CREATE_CATEGORY = gql`
	mutation CreateCategory ($data:CategoryInput!) {
		createCategory (data:$data) {
			id
			name
			image
			description
			order
			countProducts
			createdAt
			active
		}
	}
`;

export const UPDATE_CATEGORIES_ORDER = gql`
	mutation UpdateCategoriesOrder ($data:[CategoryInput!]!) {
		updateCategoriesOrder (data:$data) {
			id
			name
			order
			active
		}
	}
`;