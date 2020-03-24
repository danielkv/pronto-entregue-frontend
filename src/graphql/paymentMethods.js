import gql from "graphql-tag";

export const GET_PAYMENT_METHODS = gql`
	query GetPaymentMethods {
		moneyMethods: paymentMethods(type: "money") {
			id
			image
			displayName
		}
		deliveryMethods: paymentMethods(type: "delivery") {
			id
			image
			displayName
		}
		appMethods: paymentMethods(type: "app") {
			id
			image
			displayName
		}
	}
`;