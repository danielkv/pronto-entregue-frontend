import gql from "graphql-tag";

/**
 * Atualiza infomações da empresa no servidor
 * 
 */
export const UPDATE_COMPANY = gql`
	mutation UpdateCompany ($id: ID!, $data:CompanyInput!) {
		updateCompany (id: $id, data:$data) {
			id
			name
			display_name
			createdAt
			active
			metas {
				id
				meta_type
				meta_value
			}
		}
	}
`;

export const GET_USER_COMPANIES = gql`
	query GetCompanies ($id: ID!, $filter: Filter, $pagination: Pagination) {
		user (id: $id) {
			id
			companies (filter: $filter, pagination: $pagination) {
				id
				name
				display_name
				createdAt
				last_month_revenue
				active
			}
		}
	}
`;

export const GET_SELECTED_COMPANY = gql`
	query GetSelectedCompany{
		selectedCompany @client
	}
`;

/**
 * Seleciona empresa
 */

export const SELECT_COMPANY = gql`
	mutation SetSelectedCompany($id:ID!) {
		selectCompany (id:$id) @client {
			id
			name
			display_name
		}
	}
`;