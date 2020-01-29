/**
 * Convert fields to metas for saving
 * 
 * @param {Array} metas 
 * @param {Object} values 
 */

export const sanitizeMetas = (metas, values={}) => {
	let returnMetas = [];
	
	metas.forEach(key => {
		if (values[key]) {
			const value = values[key];
			switch (key) {
				case 'phones':
				case 'emails':
					returnMetas = [...returnMetas, ...value];
					break;
				default:
					returnMetas.push(value);
			}
		}
	});

	return returnMetas;
}

/**
 * Meta model to be used in application
 * @param {String} key 
 * @param {String|Object} value 
 * @param {String} action 
 */
export const metaModel = (key, value='', action='new_empty') => {
	return { action, key, value };
}

/**
 * Default meta data
 * 
 * @param {Array} needed which meta keys are needed
 */
export const createEmptyMetas = (needed=[]) => {
	if (!needed) throw new Error('Metas necessárias não definidas');
	const metas = {};

	needed.forEach(need => {
		if (need === 'phones') {
			metas[need] = [metaModel('phone')];
		} else if (need === 'emails') {
			metas[need] = [metaModel('email')];
		} else
			metas[need] = metaModel(need);
	});

	return metas;
}

/**
 * Convert metas comming from database to be read in application
 * 
 * @param {Array} needed which meta keys area needed
 * @param {Array} metas convert these metas
 */
export const extractMetas = (needed, metas=[]) => {
	// get default values
	let returnMetas = createEmptyMetas(needed);

	// remove __typename
	// eslint-disable-next-line no-param-reassign
	metas = metas.map(meta => {
		delete meta.__typename;
		meta.action = 'editable';
		return meta;
	});

	needed.forEach(key => {
		let searchMeta;

		if (key === 'phones')
			searchMeta = 'phone';
		else if (key === 'emails')
			searchMeta = 'email';
		else
			searchMeta = key;

		const found = metas.filter(m => m.key === searchMeta);
		
		if (found.length) {
			switch(key) {
				case 'phones':
				case 'emails':
					returnMetas[key] = found;
					break;
				default:
					returnMetas[key] = found[0];
			}
		}
	});

	return returnMetas;
}