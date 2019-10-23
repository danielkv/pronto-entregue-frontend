import gql from "graphql-tag";

export const LOAD_BUSINESS_HOURS = gql`
	query ($id:ID!) {
		branch (id:$id) {
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
	mutation ($data: [BusinessHourInput]!) {
		updateBusinessHours(data:$data) {
			day_of_week
			hours {
				from
				to
			}
		}
	}
`;