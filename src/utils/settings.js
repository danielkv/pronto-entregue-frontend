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
		active: area.active,
		radius: parseFloat(area.radius),
		center: area.center,
		price: area.price,
	}))
}

export function sanitizeViewAreas(viewAreas) {
	return viewAreas.map(area=>({
		id: area.id || null,
		active: area.active,
		name: area.name,
		radius: parseFloat(area.radius),
		center: area.center,
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