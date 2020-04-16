import gql from "graphql-tag";

export const ADD_ORDER_ROLL = gql`
	mutation AddOrderRoll ($order: OrderInput!) {
		addOrderRoll(order: $order)
	}
`;

export const ORDER_CREATED_PRODUCT = gql`
	fragment OrderCreatedProduct on OrderProduct {
		id
		name
		image
		price
		
		productRelated {
			sku
			description
		}
		
		optionsGroups {
			id
			name
			options {
				id
				name
				description
				price
			}
		}
	}	
`;

export const ORDER_CRATED_FRAGMENT = gql`
	fragment OrderCratedFragment on Order {
		id
		type
		user {
			id
			fullName
			firstName
			lastName
		}
		products {
			...OrderCreatedProduct
		}
		paymentMethod {
			id
			displayName
		}
		deliveryPrice
		deliveryTime
		price
		discount
		status
		message
		createdAt
		address {
			id
			name
			street
			number
			complement
			zipcode
			district
			city
			state
			location
		}
	}
	${ORDER_CREATED_PRODUCT}
`;


export const SUBSCRIBE_ORDER_CREATED = gql`
	subscription ($companyId: ID!) {
		orderCreated(companyId: $companyId) {
			...OrderCratedFragment
		}
	}

	${ORDER_CRATED_FRAGMENT}
`;

export const GET_ORDERS_ROLL = gql`
	query GetOrdersRoll {
		ordersRoll {
			...OrderCratedFragment
		}
	}
	${ORDER_CRATED_FRAGMENT}
`;