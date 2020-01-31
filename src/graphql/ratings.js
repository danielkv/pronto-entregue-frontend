import gql from "graphql-tag";

export const GET_COMPANY_RATINGS = gql`
	query GetCompanyRatings($id: ID!, $filter: Filter, $pagination: Pagination, $radius: Int!) {
		company (id: $id) {
			id
			rankPosition(radius: $radius)
			countRatings
			ratings (filter: $filter, pagination: $pagination) {
				id
				rate
				comment
				createdAt
				user {
					id
					fullName
				}
				order {
					id
					createdAt
				}
			}
		}
	}
`;