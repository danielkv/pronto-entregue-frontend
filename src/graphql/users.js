import gql from "graphql-tag";

export const CREATE_USER = gql`
	mutation ($data:UserInput!) {
		createUser (data:$data) {
			id
			full_name
			role
			createdAt
			active
		}
	}
`;

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
	query GetUsers ($id:ID!, $filter: Filter, $pagination: Pagination) {
		company (id:$id) {
			id
			countUsers (filter: $filter)
			users (filter: $filter, pagination: $pagination) {
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
	mutation UpdateUser ($id: ID!, $data: UserInput!, $company_id: ID!) {
		updateUser (id: $id, data: $data) {
			id
			first_name
			last_name
			email
			createdAt
			active
			role
			company(company_id: $company_id) {
				id
				user_relation {
					active
				}
			}
			metas {
				id
				key
				value
				action @client
			}
		}
	}
`;