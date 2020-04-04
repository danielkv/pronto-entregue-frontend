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
			addresses {
				id
				name
				street
				number
				zipcode
				district
				city
				state
				location
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

export const GET_COMPANY_USERS = gql`
	query GetCompanyUsers ($id:ID!, $filter: Filter, $pagination: Pagination) {
		company (id:$id) {
			id
			countUsers (filter: $filter)
			users (filter: $filter, pagination: $pagination) {
				id
				fullName
				email
				role
				createdAt
				active
			}
		}
	}
`;

export const SEARCH_USERS = gql`
	mutation SearchtUsers ($search: String!, $exclude: [ID], $companies: [ID]) {
		searchUsers (search: $search, exclude: $exclude, companies: $companies) {
			id
			fullName
			email
			addresses {
				id
				name
				street
				number
				zipcode
				complement
				district
				city
				state
				location
			}
		}
	}
`;

export const GET_USERS = gql`
	query GetUsers ($filter: Filter, $pagination: Pagination) {
		countUsers (filter: $filter)
		users (filter: $filter, pagination: $pagination) {
			id
			fullName
			email
			role
			createdAt
			active
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