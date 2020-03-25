import gql from "graphql-tag";

export const GET_PAYMENT_METHODS = gql`
	query GetPaymentMethods {
		moneyMethods: paymentMethods(filter: { showInactive: true, type: "money" }) {
			id
			active
			image
			fee
			feeType
			displayName
		}
		deliveryMethods: paymentMethods(filter: { showInactive: true, type: "delivery" }) {
			id
			image
			active
			fee
			feeType
			displayName
		}
		appMethods: paymentMethods(filter: { showInactive: true, type: "app" }) {
			id
			image
			active
			fee
			feeType
			displayName
		}
	}
`;