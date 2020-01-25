import { initialMetas, joinMetas, extractMetas } from "./metas";

export const metaTypes = ['document', 'addresses', 'phones'];

export function createEmptyPeople(overwrite ={}) {
	return {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		active: true,
		assignedCompany: {
			active: true,
		},
		...initialMetas(metaTypes),
		
		...overwrite,
	};
}

export function extractPeople(user) {

	return {
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		active: user.active,
		role: user.role,
		password: '',
		assignCompany: !!(user.company && user.company.userRelation),
		...extractMetas(metaTypes, user.metas),

		// extra fields
		forcePassword: false,
	};
}

export function sanitizePeople(result) {

	return {
		firstName: result.firstName,
		lastName: result.lastName,
		password: result.password,
		email: result.email,
		active: result.active,

		assignCompany: result.assignCompany,
		role: result.role,

		metas: joinMetas(metaTypes, result),
	}
}
