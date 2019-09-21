import gql from "graphql-tag";


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
			order
			products_qty
			createdAt
			active
		}
	}
`;