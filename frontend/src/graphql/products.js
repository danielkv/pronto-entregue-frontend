import gql from "graphql-tag";

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
	mutation ($id:ID!) {
		updateProduct (id:$id) {
			id
			name
			image
			active
			order
		}
	}
`;