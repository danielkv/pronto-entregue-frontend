import gql from "graphql-tag";

export const GET_COMPANY_DELIVERY_AREAS = gql`
	query GetDeliveryAreas ($id: ID!) {
		company (id: $id) {
			id
			deliveryAreas {
				id
				type
				name
				price
				zipcodeA
				zipcodeB
			}
		}
	}
`;

export const REMOVE_DELIVERY_AREA = gql`
	mutation RemoveDeliveryArea ($id: ID!) {
		removeDeliveryArea (id: $id) {
			id
			type
			name
			price
			zipcodeA
			zipcodeB
		}
	}
`;

export const MODIFY_DELIVERY_AREA = gql`
	mutation ModifyDeliveryArea ($data:[DeliveryAreaInput]!) {
		modifyDeliveryAreas (data:$data) {
			id
			type
			name
			price
			zipcodeA
			zipcodeB
		}
	}
`;