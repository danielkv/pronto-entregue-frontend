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
		name: area.name,
		type: area.type,
		price: area.price,
		zipcodeA: area.zipcodeA,
		zipcodeB: area.zipcodeB || null,
	}))
}

export function extractPaymentMethods(companyPaymentMethods, allPaymentMethods) {
	return allPaymentMethods.map(method => {
		return {
			...method,
			active: !!companyPaymentMethods.length && !!companyPaymentMethods.find(row=>row.id===method.id)
		}
	});
}