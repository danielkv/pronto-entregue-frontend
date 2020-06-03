import gql from "graphql-tag";

export const GET_COMPANIES_REPORT = gql`
query GetCompaniesReport ($companiesIds: [ID], $filter: JSON) {
	companiesReport(companiesIds: $companiesIds, filter: $filter) {
		credits
		companyDiscount
		totalDiscount
		tax
		revenue
		taxable
		countOrders
		companies {
			id
			
			displayName
			credits
			companyDiscount
			totalDiscount
			tax
			revenue
			taxable
			plan {
				type
				value
			}
			countOrders
			orders {
				id
				datetime
				createdAt
				subtotal
				price
				discount
				
				tax
				taxable
				creditHistory {
					id
					value
				}
			}
		}
	}
}
`;