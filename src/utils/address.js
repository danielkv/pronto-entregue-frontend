import { isInteger } from 'lodash';

export function createEmptyAddress () {
	return {
		name: '',
		street: '',
		number: '',
		complement: '',
		zipcode: '',
		reference: '',
		district: '',
		city: '',
		state: '',
		location: ['', ''],
	}
}

export function extractAddress(address) {
	return address;
}

export function sanitizeAddress(result) {
	const address = {
		name: result.name || '',
		street: result.street,
		number: parseInt(result.number),
		complement: result.complement,
		reference: result.reference,
		zipcode: isInteger(result.zipcode) ? result.zipcode : parseInt(result.zipcode.replace(/[\D]/g, '')),
		district: result.district,
		city: result.city,
		state: result.state,
		location: result.location,
	}

	if (result.id) address.id = result.id;
	return address;
}