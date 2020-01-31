import { createEmptyAddress, extractAddress, sanitizeAddress } from './address';
import { extractMetas, sanitizeMetas, createEmptyMetas } from "./metas";

export const metaTypes = ['document', 'contact', 'phones', 'emails'];

export function createEmptyCompany(overwrite={}) {
	return {
		name: '',
		displayName: '',
		type: { name: '', id: null },
		address: createEmptyAddress(),
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
		address: extractAddress(company.address),
		...extractMetas(metaTypes, company.metas)
	};
}

export function sanitizeCompany(result) {
	return {
		name: result.name,
		displayName: result.displayName,
		active: result.active,
		companyTypeId: result.type.id,
		address: sanitizeAddress(result.address),
		metas: sanitizeMetas(metaTypes, result),
	}
}