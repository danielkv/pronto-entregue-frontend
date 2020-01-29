import { isObject, isString } from 'lodash';

export function getErrors (err) {
	if (err.graphQLErrors) {
		if (err.graphQLErrors[0] && err.graphQLErrors[0].message) {
			return err.graphQLErrors[0].message;
		}
	}

	if (err.networkError) {
		if (err.networkError.result && err.networkError.result.errors) return err.networkError.result.errors[0].message;

		return err.networkError.message;
	}

	if (err.message) return err.message;

	return err;
}

export function errorObjectsToArray(errors) {
	let array = [];
	Object.entries(errors).forEach(([_, err]) => {
		if (isString(err))
			array.push(err)
		else if (isObject(err))
			array = [...array, ...errorObjectsToArray(err)]
	})
	return array;
}