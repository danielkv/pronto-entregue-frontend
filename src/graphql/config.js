import gql from "graphql-tag";

export const DELIVERY_GLOBAL_ACTIVE = gql`
	query DeliveryGlobalActive {
		deliveryGlobalActive
	}
`;

export const AVAILABLE_SOUNDS = gql`
	query AvailableSounds {
		availableSounds
	}
`;