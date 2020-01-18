import gql from "graphql-tag";

export const GET_CATEGORY = gql`
	query LoadCategory ($id:ID!) {
		category (id:$id) {
			id
			name
			description
			order
			active
			image
		}
	}
`;


export const GET_CATEGORIES = gql`
	query GetCategories ($filter: Filter!, $pagination: Pagination) {
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