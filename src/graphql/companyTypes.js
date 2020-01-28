import gql from "graphql-tag";

export const GET_COMPANY_TYPES = gql`
	query ($filter: Filter, $pagination: Pagination) {
		companyTypes (filter: $filter, pagination: $pagination) {
			id
			name
			image
			countCompanies
			active
		}
	}
`;

export const UPDATE_COMPANY_TYPES = gql`
	mutation ($id: ID!, $data: CompanyTypeInput!) {
		updateCompanyType (id: $id, data: $data) {
			id
			name
			image
			countCompanies
			active
		}
	}
`;

export const SEARCH_COMPANY_TYPES = gql`
	mutation ($search: String!) {
		searchCompanyTypes (search: $search) {
			id
			name
			active
		}
	}
`;