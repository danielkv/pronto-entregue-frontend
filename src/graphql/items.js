import gql from "graphql-tag";

export const GET_COMPANY_ITEMS = gql`
	query ($id:ID!, $filter: Filter) {
		company (id:$id) {
			id
			items (filter: $filter) {
				id
				name
				active
				description
				createdAt
			}
		}
	}
`;

export const UPDATE_ITEM = gql`
	mutation ($id:ID!, $data:ItemInput!) {
		updateItem(id:$id, data:$data) {
			id
			name
			active
			description
		}
	}
`;