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
			paymentMethods(filter: { showInactive: true }) {
				id
				displayName
			}
		}
	}
`;

export const GET_NOTIFICATION_SOUND = gql`
	query GetNotificationSound ($companyId: ID!) {
		companySound(companyId: $companyId)
	}
`;

export const GET_COMPANY_GENERAL_SETTINGS = gql`
	query GetCompanyGeneralSettings ($id: ID!, $keys: [String]) {
		company(id: $id) {
			id
			published
			metas(keys: $keys) {
				id
				key
				value
			}
		}
	}
`;

export const COMPANY_IS_OPEN = gql`
	query CompanyIsOpen ($id: ID!) {
		company (id: $id) {
			id
			isOpen
		}
	}
`
export const LOAD_COMPANY = gql`
	query LoadCompany ($id: ID!) {
		company (id: $id) {
			id
			name
			acceptTakeout
			displayName
			image
			isOpen
			backgroundColor
			createdAt
			address {
				name
				street
				number
				complement
				zipcode
				district
				city
				state
				location
			}
			type {
				id
				name
			}
			active
			metas {
				id
				key
				value
			}
		}
	}
`;

export const ENABLE_PAYMENT_METHOD = gql`
	mutation EnablePaymentMethod ($id:ID!) {
		enablePaymentMethod(id: $id) {
			id
		}
	}
`;

export const DISABLE_PAYMENT_METHOD = gql`
	mutation DisablePaymentMethod ($id:ID!) {
		disablePaymentMethod (id:$id) {
			id
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
	query GetCompanies ($filter: JSON, $pagination: Pagination) {
		countCompanies(filter: $filter)
		companies (filter: $filter, pagination: $pagination) {
			id
			name
			displayName
			image
			createdAt
			type {
				id
				name
			}
			lastMonthRevenue
			active
		}
	}
`;

export const GET_COMPANY_CONFIG = gql`
	query getCompanyConfig ($companyId: ID!, $keys: [String!]!) {
		getCompanyConfig(companyId: $companyId, keys: $keys)
	}
`;

export const SET_COMPANY_CONFIG = gql`
	mutation setCompanyConfig ($companyId: ID!, $key: String!, $value: JSON!, $type: String) {
		setCompanyConfig(companyId: $companyId, key: $key, value: $value, type: $type)
	}
`;

export const GET_USER_COMPANIES = gql`
	query GetUserCompanies ($id: ID!, $filter: JSON, $pagination: Pagination) {
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

export const SEND_NEW_COMPANY_NOTIFICATION = gql`
	mutation SendNewCompanyNoticiation ($companyId: ID!){
		sendNewCompanyNoticiation(companyId: $companyId)
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