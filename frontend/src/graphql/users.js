import gql from "graphql-tag";

export const SEARCH_USERS = gql`
	query ($search:String!) {
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




