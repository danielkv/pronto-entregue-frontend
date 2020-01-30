import { isInteger } from 'lodash';

import { extractMetas, sanitizeMetas, createEmptyMetas } from "./metas";

export const metaTypes = ['document', 'contact', 'phones', 'emails'];

export function createEmptyCompany(overwrite={}) {
	return {
		name: '',
		displayName: '',
		type: { name: '', id: null },
		active: true,
		...createEmptyMetas(metaTypes),
		...overwrite,
	}
}

export function extractCompany(company) {
	return {
		name: company.name,
		displayName: company.displayName,
		active: company.active,
		type: company.type,
		address: company.address,
		...extractMetas(metaTypes, company.metas)
	};
}

export function sanitizeCompany(result) {
	return {
		name: result.name,
		displayName: result.displayName,
		active: result.active,
		companyTypeId: result.type.id,
		address: {
			name: result.address.name,
			street: result.address.street,
			number: parseInt(result.address.number),
			complement: result.address.complement,
			zipcode: isInteger(result.address.zipcode) ? result.address.zipcode : parseInt(result.address.zipcode.replace(/[\D]/g, '')),
			district: result.address.district,
			city: result.address.city,
			state: result.address.state,
			location: result.address.location,
		},

		metas: sanitizeMetas(metaTypes, result),
	}
}