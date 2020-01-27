import { extractMetas, joinMetas, initialMetas } from "./metas";

export const metaTypes = ['address', 'document', 'contact', 'phones', 'emails'];

export function createEmptyCompany(overwrite={}) {
	return {
		name: '',
		displayName: '',
		active: true,
		...initialMetas(metaTypes),
		...overwrite,
	}
}

export function extractCompany(company) {
	return {
		name: company.name,
		displayName: company.displayName,
		active: company.active,
		type: company.type,
		...extractMetas(metaTypes, company.metas)
	};
}

export function sanitizeCompany(result) {
	return {
		name: result.name,
		displayName: result.displayName,
		active: result.active,
		companyTypeId: result.type.id,
		metas: joinMetas(metaTypes, result)
	}
}