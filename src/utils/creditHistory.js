export function sanitizeCreditHistory(result) {
	return {
		history: result.history,
		value: parseFloat(result.value),
	}
}