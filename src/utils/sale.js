import moment from "moment";

export function createEmptySale(overwrite={}) {
	const startsAt = moment();
	const expiresAt = moment().add(2, 'days');

	return {
		progress: false,

		startsAt,
		expiresAt,

		price: '',
		active: true,

		action: 'new_empty',

		...overwrite
	}
}

export function extractSale(sale) {
	if (!sale) return createEmptySale();
	
	return {
		id: sale.id,
		progress: sale.progress,
		startsAt: moment(sale.startsAt),
		expiresAt: moment(sale.expiresAt),
		price: sale.price,
		active: sale.active,
		action: 'editable'
	};
}

export function sanitizeSale(result) {
	if (!result || result.action === 'new_empty' || result.action === 'editable') return null;
	
	return {
		startsAt: result.startsAt.valueOf(),
		expiresAt: result.expiresAt.valueOf(),
		price: result.price,
		action: result.action,
	};
}