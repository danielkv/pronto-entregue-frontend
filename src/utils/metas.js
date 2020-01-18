export const joinMetas = (metas, values={}) => {
	let returnMetas = [];
	
	metas.forEach(key => {
		if (values[key]) {
			let value = values[key];
			switch (key) {
				case 'address':
					returnMetas.push({ ...value, value: JSON.stringify(value.value) });
					break;
				case 'addresses':
					returnMetas = [...returnMetas, ...value.map(v => ({ ...v, value: JSON.stringify(v.value) }))];
					break;
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

export const metaModel = (type, value='', action='new_empty') => {
	return { action, key: type, value: value };
}

export const initialMetas = (needed=[]) => {
	if (!needed) throw new Error('Metas necessárias não definidas');
	const metas = {};

	needed.forEach(need => {
		if (need === 'address') {
			metas[need] = metaModel('address', {
				street: '',
				number: '',
				district: '',
				zipcode: '',
				city: '',
				state: '',
			});
		} else if (need === 'addresses') {
			metas[need] = [metaModel('address', {
				street: '',
				number: '',
				district: '',
				zipcode: '',
				city: '',
				state: '',
			})];
		} else if (need === 'phones') {
			metas[need] = [metaModel('phone')];
		} else if (need === 'emails') {
			metas[need] = [metaModel('email')];
		} else
			metas[need] = metaModel(need);
	});

	return metas;
}

export const extractMetas = (needed, metas=[]) => {
	//valores padrão
	let returnMetas = initialMetas(needed);

	//Retira __typename dos metadados
	// eslint-disable-next-line no-param-reassign
	metas = metas.map(meta => {
		delete meta.__typename;
		meta.action = 'editable';
		return meta;
	});

	needed.forEach(key => {
		let value, searchMeta;

		if (key === 'addresses')
			searchMeta = 'address';
		else if (key === 'phones')
			searchMeta = 'phone';
		else if (key === 'emails')
			searchMeta = 'email';
		else
			searchMeta = key;

		const found = metas.filter(m => m.key === searchMeta);
		
		if (found.length) {
			switch(key) {
				case 'address':
					value = found[0];
					returnMetas[key] = { ...value, value: JSON.parse(value.value) };
					break;
				case 'addresses':
					returnMetas[key] = found.map(meta=>({ ...meta, value: JSON.parse(meta.value) }));
					break;
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