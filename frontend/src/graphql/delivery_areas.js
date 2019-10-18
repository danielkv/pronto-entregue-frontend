import gql from "graphql-tag";

export const GET_BRANCH_DELIVERY_AREAS = gql`
	query ($id:ID!) {
		branch (id:$id) {
			id
			deliveryAreas {
				id
				type
				name
				price
				zipcode_a
				zipcode_b
			}
		}
	}
`;

export const REMOVE_DELIVERY_AREA = gql`
	mutation ($id:ID!) {
		removeDeliveryArea (id:$id) {
			id
			type
			name
			price
			zipcode_a
			zipcode_b
		}
	}
`;

export const MODIFY_DELIVERY_AREA = gql`
	mutation ($data:[DeliveryAreaInput]!) {
		modifyDeliveryAreas (data:$data) {
			id
			type
			name
			price
			zipcode_a
			zipcode_b
		}
	}
`;