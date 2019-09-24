import gql from "graphql-tag";

export const GET_CATEGORY = gql`
	query ($id:ID!) {
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


export const GET_BRANCH_CATEGORIES = gql`
	query ($id:ID!) {
		branch (id:$id) {
			id
			categories {
				id
				name
				image
				order
				products_qty
				createdAt
				active
			}
		}
	}
`;

export const UPDATE_CATEGORY = gql`
	mutation ($id:ID!, $data:CategoryInput!) {
		updateCategory (id:$id, data:$data) {
			id
			name
			image
			description
			active
		}
	}
`;

export const CREATE_CATEGORY = gql`
	mutation ($data:CategoryInput!) {
		createCategory (data:$data) {
			id
			name
			image
			description
			order
			products_qty
			createdAt
			active
		}
	}
`;

export const UPDATE_CATEGORIES_ORDER = gql`
	mutation ($data:[CategoryInput!]!) {
		updateCategoriesOrder (data:$data) {
			id
			name
			order
			active
		}
	}
`;