import gql from "graphql-tag";

export const SEARCH_USERS = gql`
	query SearchUsers ($search:String!) {
		searchCompanyUsers(search:$search) {
			id
			full_name
			email
			addresses {
				id
				street
				number
				zipcode
				district
				city
				state
			}
		}
	}
`;

export const GET_COMPANY_USERS = gql`
	query GetUsers ($id:ID!) {
		company (id:$id) {
			id
			users {
				id
				full_name
				role
				createdAt
				active
			}
		}
	}
`;

export const UPDATE_USER = gql`
	mutation UpdateUser ($id:ID!, $data:UserInput!) {
		updateUser (id: $id, data:$data) {
			id
			first_name
			last_name
			email
			createdAt
			active
			role
			company(company_id:$company_id) {
				id
				user_relation {
					active
				}
				assigned_branches {
					id
					name
					user_relation {
						active
						role_id
					}
				}
			}
			metas {
				id
				meta_type
				meta_value
				action @client
			}
		}
	}
`;