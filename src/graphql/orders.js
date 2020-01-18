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
				street
				number
				countProducts
				type
				createdDate
				createdTime
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
		options_groups(filter:$filter) {
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

		street
		number
		city
		state
		district
		zipcode

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
			}
		}
		products {
			id
			name
			price
			quantity
			product_related {
				...ProductRelatedFields
			}
			options_groups {
				id
				name
				options_group_related {
					id
				}
				#message
				options {
					id
					name
					price
					option_related {
						id
					}
				}
			}
		}
		status
		createdDate
		createdTime
	}
	${ORDER_PRODUCT_RELATED_FRAGMENT}
`;

export const CALCULATE_DELIVERY_PRICE = gql`
	query CalculatedeliveryPrice ($zipcode:Int!) {
		calculatedeliveryPrice(zipcode: $zipcode) {
			id
			name
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
				street
				number
				price
				countProducts
				status
				createdDate
				createdTime
			}
		}
	}
`;

export const SUBSCRIBE_ORDER_CREATED = gql`
	subscription ($company_id: ID!) {
		orderCreated(company_id: $company_id) {
			id
			user {
				id
				firstName
				lastName
			}
		}
	}
`;