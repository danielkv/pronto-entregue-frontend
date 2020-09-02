import gql from "graphql-tag";

export const GET_COMPANIES_REPORT = gql`
query GetCompaniesReport ($companiesIds: [ID], $filter: JSON) {
	companiesReport(companiesIds: $companiesIds, filter: $filter) {
		credits
		coupons
		taxableCoupon
		totalDiscount
		refund
		tax
		revenue
		taxable
		countOrders
		deliveryPaymentValue
		countPeDelivery
		payment
		companies {
			id
			image
			refund
			displayName
			credits
			coupons
			taxableCoupon
			totalDiscount
			tax
			revenue
			taxable
			plan {
				type
				value
			}
			payment
			countOrders
			deliveryPaymentValue
			countPeDelivery
			orders {
				id
				createdAt
				type
				subtotal
				deliveryPrice
				price
				refund
				discount
				deliveryPaymentValue
				tax
				taxable
				payment
				creditHistory {
					id
					value
					
				}
				coupon {
					id
					value
					taxable
					valueType
					freeDelivery
					
				}
				couponValue
				taxableCoupon
				
			}
		}
	}
}
`;