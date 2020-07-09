import { createEmptyAddress, extractAddress, sanitizeAddress } from "./address";
import { createEmptyMetas, sanitizeMetas, extractMetas } from "./metas";

export const metaTypes = ['document', 'phones'];

export function createEmptyPeople(overwrite ={}) {
	return {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		active: true,
		role: '',
		assignedCompany: {
			active: true,
		},
		addresses: [createEmptyAddress()],
		...createEmptyMetas(metaTypes),
		
		...overwrite,
	};
}

export function extractPeople(user) {

	return {
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		active: user.active,
		role: user.company && user.company.userRelation ? user.company.userRelation.role.name : user.role,
		password: '',
		assignCompany: !!(user.company && user.company.userRelation),
		addresses: user.addresses.map(address => extractAddress(address)),
		...extractMetas(metaTypes, user.metas),

		// extra fields
		forcePassword: false,
	};
}

export function sanitizePeople(result) {
	const data = {
		firstName: result.firstName,
		lastName: result.lastName,
		email: result.email,
		active: result.active,

		assignCompany: result.assignCompany,
		role: result.role,

		metas: sanitizeMetas(metaTypes, result),
	}

	if (result.addresses) data.addresses = result.addresses.map(address => sanitizeAddress(address));
	if (result.password) data.password = result.password;

	return data;
}

export function getUserRoleLabel(role) {
	switch(role) {
		case 'master':
			return 'Master';
		case 'adm':
			return 'Administrador';
		case 'customer':
		default:
			return 'Cliente';
	}
}
