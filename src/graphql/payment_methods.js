import gql from "graphql-tag";

export const GET_PAYMENT_METHODS = gql`
	query GetPaymentMethods {
		paymentMethods {
			id
			name
			display_name
		}
	}
`;