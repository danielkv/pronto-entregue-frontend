export function createEmptyCompanyType(overwrite={}) {
	return {
		name: '',
		description: '',
		file: '',
		preview: '',
		active: true,

		...overwrite,
	};
}

export function extractCompanyType(companyType) {
	return {
		name: companyType.name,
		description: companyType.description || '',
		preview: companyType.image,
		active: companyType.active,
		file: '',
	};
}

export function sanitizeCompanyType(result) {
	return {
		name: result.name,
		description: result.description,
		active: result.active,
		file: result.file || null,
	}
}