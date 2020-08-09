import gql from 'graphql-tag';

export const DELIVERY_MAN_FRAGMENT = gql`
	fragment DeliveryMenFields on DeliveryMan {
		id
		user {
			id
			fullName
			image
			phones: metas(type: "phone") {
				value
			}
		}
		isEnabled
		openDeliveries {
			id
			description
		}
	}
`;

export const GET_DELIVERY_MEN = gql`
	query GetDeliveryMen ($pagination: Pagination) {
		countDeliveryMen
		deliveryMen(pagination: $pagination) {
			...DeliveryMenFields
		}
	}
	${DELIVERY_MAN_FRAGMENT}
`;

export const UPDATE_DELIVERY_MEN_STATUS = gql`
	mutation GetDeliveryMen ($userId: ID!, $newStatus: Boolean!) {
		updateDeliveryManStatus(userId: $userId, newStatus: $newStatus) {
			...DeliveryMenFields
		}
	}
	${DELIVERY_MAN_FRAGMENT}
`;
