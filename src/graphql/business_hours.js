import gql from "graphql-tag";

export const LOAD_BUSINESS_HOURS = gql`
	query LoadBusinessHours ($id:ID!) {
		company (id:$id) {
			id
			business_hours {
				day_of_week
				hours {
					from
					to
				}
			}
		}
	}
`;

export const UPDATE_BUSINESS_HOURS = gql`
	mutation UpdateBusinessHours ($data: [BusinessHourInput]!) {
		updateBusinessHours(data:$data) {
			dayOfWeek
			hours {
				from
				to
			}
		}
	}
`;