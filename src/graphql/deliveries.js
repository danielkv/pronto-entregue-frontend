import gql from 'graphql-tag';

export const ADDRESS_FRAGMENT = gql`
	fragment AddressFields on Address {
		id
		name
		street
		number
		district
		city
		state
		zipcode
		location
	}
`;

export const FRAGMENT_DELIVERY = gql`
	fragment DeliveryFields on Delivery {
		id
		description
		value
		status
		receiverName
		receiverContact
		senderContact
		#createdAt
		deliveryMan {
			id
			user {
				id
				fullName
				phones: metas(type:"phone") {
					value
				}
			}
		}
		from {
			...AddressFields
		}
		to {
			...AddressFields
		}
	}

	${ADDRESS_FRAGMENT}
`

export const UPDATE_DELIVERY_SUBSCRIPTION = gql`
	subscription {
		delivery {
			...DeliveryFields
		}
	}
	${FRAGMENT_DELIVERY}
`;

export const GET_DELIVERY_MEN = gql`
	query GetDeliveryMen ($userFilter: JSON, $deliveryFilter: JSON) {
		users(filter: $userFilter) {
			id
			fullName
			image
			deliveries(filter: $deliveryFilter) {
				id
				value
				status
			}
		}
	}
`;

export const GET_DELIVERIES = gql`
	query GetDeliveries ($filter: JSON, $pagination: Pagination) {
		countDeliveries(filter: $filter)
		deliveries(filter: $filter, pagination: $pagination) {
			...DeliveryFields
		}
	}

	${FRAGMENT_DELIVERY}
`;

export const GET_DELIVERY_MAN = gql`
	query GetDeliveryMan ($userId: ID!) {
		deliveryMan(userId: $userId) {
			id
			canAcceptDelivery
			isEnabled
		}
	}
`;

export const ENABLE_DELIVERY_MAN = gql`
	mutation EnableDeliveryMan ($userId: ID!) {
		enableDeliveryMan(userId: $userId) {
			id
			canAcceptDelivery
			isEnabled
		}
	}
`;

export const DISABLE_DELIVERY_MAN = gql`
	mutation EnableDeliveryMan ($userId: ID!) {
		disableDeliveryMan(userId: $userId) {
			id
			canAcceptDelivery
			isEnabled
		}
	}
`;

export const SET_DELIVERY_MAN = gql`
	mutation SetDeliveryMan ($deliveryId: ID!, $userId: ID!) {
		setDeliveryMan(deliveryId: $deliveryId, userId: $userId) {
			...DeliveryFields
		}
	}

	${FRAGMENT_DELIVERY}
`;

export const CHANGE_DELIVERY_STATUS = gql`
	mutation ChangeDeliveryStatus ($deliveryId: ID!, $newStatus: String!) {
		changeDeliveryStatus(deliveryId: $deliveryId, newStatus: $newStatus) {
			id
			status
		}
	}
`;