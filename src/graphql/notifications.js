import gql from "graphql-tag";

export const COUNT_USERS_TOKENS = gql`
	query CountUsersTokens($filter: JSON) {
		countTokensUsers (filter: $filter) {
			device
			desktop
		}
	}
`;

export const SEND_NOTIFICATION = gql`
	mutation SendNotification($filter: JSON, $title: String!, $body: String!) {
		sendNotification (filter: $filter, title: $title, body: $body) {
			device
			desktop
		}
	}
`;