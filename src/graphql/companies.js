import gql from "graphql-tag";

export const CREATE_COMPANY = gql`
	mutation ($data:CompanyInput!) {
		createCompany (data:$data) {
			id
			name
			displayName
			lastMonthRevenue
			createdAt
			active
		}
	}
`;

export const UPDATE_COMPANY = gql`
	mutation UpdateCompany ($id: ID!, $data:CompanyInput!) {
		updateCompany (id: $id, data:$data) {
			id
			name
			displayName
			createdAt
			active
			metas {
				id
				key
				value
			}
		}
	}
`;

export const GET_COMPANY_PAYMENT_METHODS = gql`
	query GetCompanyPaymentMethods ($id: ID!) {
		company (id: $id) {
			id
			paymentMethods {
				id
				name
				displayName
			}
		}
	}
`;

export const ENABLE_PAYMENT_METHOD = gql`
	mutation EnablePaymentMethod ($id:ID!) {
		enablePaymentMethod(id: $id) {
			id
			name
		}
	}
`;

export const LOAD_COMPANY = gql`
	query LoadCompany ($id: ID!) {
		company (id: $id) {
			id
			name
			displayName
			createdAt
			active
			metas {
				id
				key
				value
			}
		}
	}
`;

export const DISABLE_PAYMENT_METHOD = gql`
	mutation DisablePaymentMethod ($id:ID!) {
		disablePaymentMethod (id:$id) {
			id
			name
		}
	}
`;

export const SEARCH_COMPANIES = gql`
	mutation SearchCompanies ($search: String!, $exclude: [ID]) {
		searchCompanies (search: $search, exclude: $exclude) {
			id
			name
			displayName
			createdAt
		}
	}
`;

export const GET_COMPANIES = gql`
	query GetCompanies ($filter: Filter, $pagination: Pagination) {
		countCompanies(filter: $filter)
		companies (filter: $filter, pagination: $pagination) {
			id
			name
			displayName
			createdAt
			lastMonthRevenue
			active
		}
	}
`;

export const GET_USER_COMPANIES = gql`
	query GetUserCompanies ($id: ID!, $filter: Filter, $pagination: Pagination) {
		user (id: $id) {
			id
			countCompanies(filter: $filter)
			companies (filter: $filter, pagination: $pagination) {
				id
				name
				displayName
				createdAt
				lastMonthRevenue
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

export const SET_SELECTED_COMPANY = gql`
	mutation SetSelectedCompany($id:ID!) {
		setSelectCompany (id: $id) @client
	}
`;