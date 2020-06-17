import gql from "graphql-tag";

export const GET_COMPANY_PE_DELIVERY_AREAS = gql`
	query GetPeDeliveryAreas ($id: ID!) {
		company (id: $id) {
			id
			peDeliveryAreas {
				id
				name
				price
				active
				radius
				center
			}
			address {
				location
			}
		}
	}
`;

export const REMOVE_PE_DELIVERY_AREA = gql`
	mutation RemovePeDeliveryAreas ($id: ID!) {
		removePeDeliveryAreas (id: $id) {
			id
			name
			active
		}
	}
`;

export const MODIFY_PE_DELIVERY_AREA = gql`
	mutation ModifyDeliveryAreas ($data:[PeDeliveryAreaInput]!) {
		modifyPeDeliveryAreas (data: $data) {
			id
			name
			active
		}
	}
`;