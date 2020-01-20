import { extractMetas, joinMetas } from "./metas";

export const metaTypes = ['address', 'document', 'contact', 'phones', 'emails'];

export function extractCompany(company) {
	return {
		name: company.name,
		displayName: company.displayName,
		active: company.active,
		...extractMetas(metaTypes, company.metas)
	};
}

export function sanitizeCompanyData(result) {
	return {
		name: result.name,
		displayName: result.displayName,
		active: result.active,
		metas: joinMetas(metaTypes, result)
	}
}