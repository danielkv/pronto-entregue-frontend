export function createEmptyCategory(overwrite={}) {
	return {
		name: '',
		description: '',
		file: '',
		preview: '',
		active: true,

		...overwrite,
	};
}

export function extractCategory(category) {
	return {
		name: category.name,
		description: category.description || '',
		preview: category.image,
		active: category.active,
		file: '',
	};
}

export function sanitizeCategory(result) {
	return {
		name: result.name,
		description: result.description,
		active: result.active,
		file: result.file || null,
	}
}