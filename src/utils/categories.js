export function extractCategory(cateogry) {

}

export function sanitizeCategoryData(result) {
	return {
		name: result.name,
		description: result.description,
		active: result.active,
		file: result.file || null,
	}
}