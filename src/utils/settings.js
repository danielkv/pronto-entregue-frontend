import { isString } from 'lodash';

export function sanitizeBusinessHours(businessHours) {
	return businessHours.map(day=>{
		delete day.__typename;
		day.hours = day.hours.map(hour=>{
			delete hour.__typename;
			return hour;
		})
		return day;
	})
}

export function sanitizeDeliveryAreas(deliveryAreas) {
	return deliveryAreas.map(area=>({
		id: area.id || null,
		distance: isString(area.distance) ? parseInt(area.distance) : area.distance,
		price: area.price,
	}))
}

export function extractPaymentMethods(companyPaymentMethods, allPaymentMethods) {
	return allPaymentMethods.map(method => {
		return {
			...method,
			enabled: !!companyPaymentMethods.length && !!companyPaymentMethods.find(row=>row.id===method.id)
		}
	});
}