import moment from 'moment';

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
	return {
		...campaign,
		startsAt: moment(campaign.startsAt),
		expiresAt: moment(campaign.expiresAt),
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
		valueType: result.valueType,
		value: result.value,
		startsAt: result.startsAt.valueOf(),
		expiresAt: result.expiresAt.valueOf(),

		companies: result.companies.map(row=>row.id),
		products: result.products.map(row=>row.id),
		users: result.users.map(row=>row.id),
	}
}