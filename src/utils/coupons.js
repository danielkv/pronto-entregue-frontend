import { toNumber } from 'lodash'
import moment from 'moment';

export function createEmptyCoupon(overwrite={}) {
	const startsAt = moment();
	const expiresAt = moment().add(2, 'days');

	return {
		name: '',
		preview: null, // image

		description: '',

		taxable: 100,
		active: true,
		valueType: 'percentage',
		value: 0,
		freeDelivery: false,
		
		minValue: 0,
		maxValue: 0,
		maxPerUser: 1,
		maxPurchases: 0, // 0 unlimited
		onlyFirstPurchases: false,

		expiresAt,
		startsAt,

		products: [],
		companies: [],
		users: [],
		
		...overwrite
	}
}

export function extractCoupon(coupon) {
	return {
		...coupon,
		startsAt: moment(coupon.startsAt),
		expiresAt: moment(coupon.expiresAt),
		preview: coupon.image,
		taxable: toNumber(coupon.taxable),
	};
}

export function sanitizeCoupon(result) {
	return {
		name: result.name,
		file: result.file || null,
		description: result.description,
		featured: Boolean(result.featured),
		
		minValue: parseInt(result.minValue),
		maxValue: parseInt(result.maxValue),
		maxPerUser: parseInt(result.maxPerUser),
		maxPurchases: parseInt(result.maxPurchases),
		onlyFirstPurchases: Boolean(result.onlyFirstPurchases),
		
		active: result.active,
		valueType: result.valueType,
		taxable: result.taxable,
		freeDelivery: Boolean(result.freeDelivery),
		value: result.value,
		startsAt: result.startsAt.valueOf(),
		expiresAt: result.expiresAt.valueOf(),

		companies: result.companies.map(row=>row.id),
		products: result.products.map(row=>row.id),
		users: result.users.map(row=>row.id),
	}
}