import { extractMetas, joinMetas } from "./metas";


export const metaTypes = ['document', 'addresses', 'phones'];

export function extractUser(user) {

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

export function sanitizeUserData(result) {
	return {
		firstName: result.firstName,
		lastName: result.lastName,
		password: result.password,
		role: result.role,
		email: result.email,
		active: result.active,
		metas: joinMetas(metaTypes, result),

		assignCompany: result.assignCompany,
	}
}