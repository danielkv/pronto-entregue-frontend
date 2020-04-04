import gql from "graphql-tag";

export const LOAD_COMPANY_TYPE = gql`
	query LoadCompanyType ($id: ID!) {
		companyType (id: $id) {
			id
			name
			image
			description
			active
		}
	}
`;

export const GET_COMPANY_TYPES = gql`
	query GetCompanyTypes ($filter: Filter, $pagination: Pagination) {
		countCompanyTypes
		companyTypes (filter: $filter, pagination: $pagination) {
			id
			name
			image
			countCompanies(onlyPublished: false)
			active
		}
	}
`;

export const CREATE_COMPANY_TYPE = gql`
	mutation CreateCompanyType ($data: CompanyTypeInput!) {
		createCompanyType (data: $data) {
			id
			name
			image
			countCompanies(onlyPublished: false)
			active
		}
	}
`;

export const UPDATE_COMPANY_TYPE = gql`
	mutation UpdateCompanyType ($id: ID!, $data: CompanyTypeInput!) {
		updateCompanyType (id: $id, data: $data) {
			id
			name
			image
			countCompanies(onlyPublished: false)
			active
		}
	}
`;

export const SEARCH_COMPANY_TYPES = gql`
	mutation SearchCompanyTypes ($search: String!) {
		searchCompanyTypes (search: $search) {
			id
			name
			active
		}
	}
`;