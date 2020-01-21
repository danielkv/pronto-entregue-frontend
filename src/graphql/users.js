import gql from "graphql-tag";

export const LOAD_USER = gql`
	query LoadUser($id: ID!, $companyId:ID!) {
		user (id: $id) {
			id
			firstName
			lastName
			email
			createdAt
			active
			role
			company(companyId: $companyId) {
				id
				userRelation {
					active
				}
			}
			metas {
				id
				key
				value
			}
		}
	}
`;

export const CREATE_USER = gql`
	mutation ($data:UserInput!) {
		createUser (data:$data) {
			id
			fullName
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
			fullName
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
				fullName
				role
				createdAt
				active
			}
		}
	}
`;

export const UPDATE_USER = gql`
	mutation UpdateUser ($id: ID!, $data: UserInput!, $companyId: ID!) {
		updateUser (id: $id, data: $data) {
			id
			firstName
			lastName
			email
			createdAt
			active
			role
			company(companyId: $companyId) {
				id
				userRelation {
					active
				}
			}
			metas {
				id
				key
				value
			}
		}
	}
`;