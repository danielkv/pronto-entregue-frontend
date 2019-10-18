import gql from "graphql-tag";

export const GET_PAYMENT_METHODS = gql`
	query {
		paymentMethods {
			id
			name
			display_name
		}
	}
`;