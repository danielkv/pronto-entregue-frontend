export function getInitialValues(overwrite={}) {
	return {
		name: '',
		preview: '', // image

		description: '',

		chargeCompany: true,
		acceptOtherCompaign: false,
		active: true,
		type: 'discount',
		valueType: 'percentage',
		value: 0,

		expiresAt: '',

		products: [],
		companies: [],
		users: [],
		
		...overwrite
	}
}