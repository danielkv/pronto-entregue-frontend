import gql from "graphql-tag";

export const GET_COMPANY_TYPES = gql`
	query ($filter: Filter, $pagination: Pagination) {
		companyTypes (filter: $filter, pagination: $pagination) {
			id
			name
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