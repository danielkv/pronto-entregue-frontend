import gql from "graphql-tag";

import { OPTIONS_GROUP_FRAGMENT } from "./products";


export const GET_COMPANY_LAST_ORDERS = gql`
	query GetLastOrders ($id:ID!, $filter:Filter, $pagination: Pagination) {
		company(id: $id) {
			id
			orders (filter: $filter, pagination: $pagination) {
				id
				user {
					id
					fullName
				}
				address {
					street
					number
				}
				countProducts
				type
				createdAt
				status
			}
		}
	}

`;

export const GET_COMPANY_ORDERS_QTY = gql`
	query OrdersQty($id: ID!) {
		company(id: $id) {
			id
			waitingOrders: countOrders(filter: { status: "waiting", createdAt: "CURDATE"})
			preparingOrders: countOrders(filter: { status: "preparing", createdAt: "CURDATE"})
			deliveryOrders: countOrders(filter: { status: "delivery", createdAt: "CURDATE"})
			deliveredOrders: countOrders(filter: { status: "delivered", createdAt: "CURDATE"})
			canceledOrders: countOrders(filter: { status: "canceled", createdAt: "CURDATE"})
		}
	}
`;

export const ORDER_PRODUCT_RELATED_FRAGMENT = gql`
	fragment ProductRelatedFields on Product {
		id
		name
		price
		description
		image
		optionsGroups(filter:$filter) {
			...OptionsGroupFields
		}
	}
	${OPTIONS_GROUP_FRAGMENT}
`;

export const ORDER_FRAGMENT = gql`
	fragment OrderFields on Order {
		id
		price
		type
		message
		deliveryPrice
		discount
		paymentFee
		paymentMethod {
			id
		}

		address {
			id
			street
			number
			city
			state
			district
			zipcode
			location
		}

		user {
			id
			fullName
			addresses {
				id
				name
				street
				number
				zipcode
				district
				city
				state
				location
			}
		}
		products {
			id
			name
			price
			quantity
			productRelated {
				...ProductRelatedFields
			}
			optionsGroups {
				id
				name
				optionsGroupRelated {
					id
				}
				#message
				options {
					id
					name
					description
					price
					optionRelated {
						id
					}
				}
			}
		}
		status
		createdAt
	}
	${ORDER_PRODUCT_RELATED_FRAGMENT}
`;

export const CHECK_DELIVERY_LOCATION = gql`
	mutation CheckDeliveryLocation ($companyId: ID!, $address: AddressInput!) {
		checkDeliveryLocation(companyId: $companyId, address: $address) {
			id
			distance
			price
		}
	}
`;

export const CREATE_ORDER = gql`
	mutation CreateOrder ($data:OrderInput!) {
		createOrder(data:$data) {
			id
			price
		}
	}
`;

export const UPDATE_ORDER = gql`
	mutation UpdateOrder ($id:ID!, $data:OrderInput!, $filter:Filter) {
		updateOrder(id:$id, data:$data) {
			...OrderFields
		}
	}
	${ORDER_FRAGMENT}
`;

export const LOAD_ORDER = gql`
	query LoadOrder ($id:ID!, $filter:Filter) {
		order (id:$id) {
			...OrderFields
		}
	}
	${ORDER_FRAGMENT}
`;

export const GET_COMPANY_ORDERS = gql`
	query GetOrders ($id:ID!, $filter: Filter, $pagination: Pagination) {
		company(id: $id) {
			id
			countOrders(filter: $filter)
			orders(filter: $filter, pagination: $pagination) {
				id
				type
				user {
					id
					fullName
				}
				address {
					id
					street
					number
				}
				price
				countProducts
				status
				createdAt
			}
		}
	}
`;

export const SUBSCRIBE_ORDER_CREATED = gql`
	subscription ($companyId: ID!) {
		orderCreated(companyId: $companyId) {
			id
			user {
				id
				fullName
				firstName
				lastName
			}
		}
	}
`;