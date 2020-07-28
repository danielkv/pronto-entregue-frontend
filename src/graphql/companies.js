import gql from "graphql-tag";

export const COMPANY_MIN_FRAGMENT = gql`
	fragment CompanyMinFields on Company {
		id
		name
		displayName
		published
		image
		createdAt
		type {
			id
			name
		}
		lastMonthRevenue
		active
	}
`;

export const CREATE_COMPANY = gql`
	mutation ($data:CompanyInput!) {
		createCompany (data:$data) {
			...CompanyMinFields
		}
	}

	${COMPANY_MIN_FRAGMENT}
`;

export const UPDATE_COMPANY = gql`
	mutation UpdateCompany ($id: ID!, $data:CompanyInput!) {
		updateCompany (id: $id, data:$data) {
			...CompanyMinFields
			metas {
				id
				key
				value
			}
		}
	}

	${COMPANY_MIN_FRAGMENT}
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

export const GET_COMPANY = gql`
	query GetCompany ($id: ID!) {
		company (id: $id) {
			...CompanyMinFields
		}
	}
	${COMPANY_MIN_FRAGMENT}
`;

export const GET_COMPANIES = gql`
	query GetCompanies ($filter: JSON, $pagination: Pagination) {
		countCompanies(filter: $filter)
		companies (filter: $filter, pagination: $pagination) {
			...CompanyMinFields
		}
	}

	${COMPANY_MIN_FRAGMENT}
`;

export const GET_COMPANY_CONFIG = gql`
	query companyConfig ($companyId: ID!, $keys: [String!]!) {
		companyConfig(companyId: $companyId, keys: $keys)
	}
`;

export const SET_COMPANY_CONFIG = gql`
	mutation setCompanyConfig ($companyId: ID!, $key: String!, $value: JSON!, $type: String) {
		setCompanyConfig(companyId: $companyId, key: $key, value: $value, type: $type)
	}
`;

export const SET_COMPANY_CONFIGS = gql`
	mutation setCompanyConfigs ($companyId: ID!, $data: [JSON!]!) {
		setCompanyConfigs(companyId: $companyId, data: $data)
	}
`;

export const GET_USER_COMPANIES = gql`
	query GetUserCompanies ($id: ID!, $filter: JSON, $pagination: Pagination) {
		user (id: $id) {
			id
			countCompanies(filter: $filter)
			companies (filter: $filter, pagination: $pagination) {
				...CompanyMinFields
			}
		}
	}

	${COMPANY_MIN_FRAGMENT}
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