import moment from 'moment';

export function getTypeLabel(type) {
	switch(type) {
		case 'cashback':
			return 'Desconto';
		case 'discount':
		default:
			return 'Cashback';
	}
}

export function createEmptyCampaign(overwrite={}) {
	const startsAt = moment();
	const expiresAt = moment().add(2, 'days');

	return {
		name: '',
		preview: null, // image

		description: '',

		chargeCompany: true,
		acceptOtherCampaign: false,
		active: true,
		type: 'discount',
		valueType: 'percentage',
		value: 0,

		expiresAt,
		startsAt,

		products: [],
		companies: [],
		users: [],
		
		...overwrite
	}
}

export function extractCampaign(campaign) {
	console.log(campaign.startsAt, campaign.expiresAt);
	return {
		...campaign,
		startsAt: new Date(campaign.startsAt),
		expiresAt: new Date(campaign.expiresAt),
		preview: campaign.image,
	};
}

export function sanitizeCampaign(result) {
	return {
		name: result.name,
		file: result.file || null,
		description: result.description,
		chargeCompany: Boolean(result.chargeCompany),
		acceptOtherCampaign: Boolean(result.acceptOtherCampaign),

		active: result.active,
		type: result.type,
		valueType: result.valueType,
		value: result.value,
		startsAt: result.startsAt.getTime(),
		expiresAt: result.expiresAt.getTime(),

		companies: result.companies.map(row=>row.id),
		products: result.products.map(row=>row.id),
		users: result.users.map(row=>row.id),
	}
}