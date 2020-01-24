export function getInitialValues(overwrite={}) {
	return {
		name: '',
		preview: null, // image

		description: '',

		chargeCompany: true,
		acceptOtherCompaign: false,
		active: true,
		type: 'discount',
		valueType: 'percentage',
		value: 0,

		expiresAt: new Date(),

		products: [],
		companies: [],
		users: [],
		
		...overwrite
	}
}

export function sanitizeCampaign(result) {
	return {
		name: result.name,
		file: result.file || null,
		description: result.description,
		chargeCompany: Boolean(result.chargeCompany),
		acceptOtherCompaign: Boolean(result.acceptOtherCompaign),

		active: result.active,
		type: result.type,
		valueType: result.valueType,
		value: result.value,
		expiresAt: result.expiresAt.getTime(),

		companies: result.companies.map(row=>row.id),
		products: result.products.map(row=>row.id),
		users: result.users.map(row=>row.id),
	}
}