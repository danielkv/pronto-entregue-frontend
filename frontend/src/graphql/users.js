import gql from "graphql-tag";

/**
 * Carrega todas infomações ao acessar
 * 
 * companies, branches, 
 */
export const LOAD_INITIAL_DATA = gql`
	query init {
		me {
			id
			companies {
				id
				name
				display_name
				last_month_revenue
				createdAt
				active
			}
		}
	}
`;

export const GET_COMPANY_USERS = gql`
	query ($id:ID!) {
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
	mutation ($id:ID!, $data:UserInput!) {
		updateUser (id: $id, data:$data) {
			id
			full_name
			role
			createdAt
			active
		}
	}
`;




