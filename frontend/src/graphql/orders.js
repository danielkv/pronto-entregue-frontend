import gql from "graphql-tag";

export const CREATE_ORDER = gql`
	mutation ($data:OrderInput!) {
		createOrder(data:$data) {
			id
			price
		}
	}
`;