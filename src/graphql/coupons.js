import gql from "graphql-tag";

export const CREATE_COUPON = gql`
	mutation CreateCoupon ($data: CouponInput!) {
		createCoupon (data: $data) {
			id
			name
			image
		}
	}
`;

export const LOAD_COUPON = gql`
	query LoadCoupon ($id: ID!) {
		coupon (id: $id) {
			id
			name
			image
			description
			taxable
			featured
			freeDelivery

			minValue
			maxValue
			onlyFirstPurchases
			maxPerUser
			maxPurchases

			startsAt
			expiresAt
			
			masterOnly
			valueType
			value
			createdAt
			active

			companies {
				id
				name
				displayName
			}
			products {
				id
				name
				image
				countCoupons (notIn: [$id])
			}
			users {
				id
				fullName
				email
			}
		}
	}
`;

export const UPDATE_COUPON = gql`
	mutation UpdateCoupon ($id: ID!, $data: CouponInput!) {
		updateCoupon (id: $id, data: $data) {
			id
			name
			image
			
			startsAt
			expiresAt
			masterOnly
			valueType
			value
			createdAt
			active
		}
	}
`;

export const GET_COUPONS = gql`
	query GetCoupons ($filter: Filter, $pagination: Pagination) {
		countCoupons(filter: $filter)
		coupons (filter: $filter, pagination: $pagination) {
			id
			name
			image
			startsAt
			expiresAt
			masterOnly
			valueType
			value
			createdAt
			active
		}
	}
`;