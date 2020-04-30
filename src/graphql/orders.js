import gql from "graphql-tag";

import { OPTIONS_GROUP_FRAGMENT } from "./products";

export const GET_ORDERS_STATUS_QTY = gql`
	query GetOrderStatusQty($companyId: ID!) {
		ordersStatusQty(companyId: $companyId)
	}
`;

export const SUBSCRIBE_ORDER_STATUS_QTY = gql`
	subscription UpdateOrderStatusQty($companyId: ID!) {
		updateOrderStatusQty(companyId: $companyId)
	}
`;

export const GET_COMPANY_LAST_ORDERS = gql`
	query GetLastOrders ($id:ID!, $filter: JSON, $pagination: Pagination) {
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
			waitingOrders: countOrders(filter: { status: "waiting"})
			preparingOrders: countOrders(filter: { status: "preparing" })
			deliveryOrders: countOrders(filter: { status: "delivering" })
			deliveredOrders: countOrders(filter: { status: "delivered" })
			canceledOrders: countOrders(filter: { status: "canceled" })
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
			image
			fullName
			firstName
			lastName
			email
			phones: metas(type:"phone") {
				value
			}
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
				priceType
				optionsGroupRelated {
					id
					priceType
				}
				options {
					id
					name
					description
					price
					optionRelated {
						id
						description
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
	mutation CheckDeliveryLocation ($companyId: ID!, $location: GeoPoint!) {
		checkDeliveryLocation(companyId: $companyId, location: $location) {
			id
			distance
			name
			center
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
	query GetOrders ($id:ID!, $filter: JSON, $pagination: Pagination) {
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