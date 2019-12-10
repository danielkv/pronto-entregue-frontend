import gql from "graphql-tag";
import { OPTIONS_GROUP_FRAGMENT } from "./products";


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
		delivery_price
		discount
		payment_fee
		payment_method {
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
			full_name
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
	query CalculateDeliveryPrice ($zipcode:Int!) {
		calculateDeliveryPrice(zipcode: $zipcode) {
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

export  const GET_BANCH_ORDERS = gql`
	query GetOrders ($id:ID!, $filter: Filter, $pagination: Pagination) {
		branch (id:$id) {
			id
			countOrders(filter: $filter)
			orders(filter: $filter, pagination: $pagination) {
				id
				type
				user {
					id
					full_name
				}
				street
				number
				price
				products_qty
				status
				createdDate
				createdTime
			}
		}
	}
`;

export const SUBSCRIBE_ORDER_CREATED = gql`
	subscription ($branch_id: ID!) {
		orderCreated(branch_id: $branch_id) {
			id
			user {
				id
				first_name
				last_name
			}
		}
	}
`;