import React from 'react';
import Icon from '@mdi/react';
import { mdiClock, mdiSilverwareSpoon, mdiMoped, mdiCheckCircle, mdiCloseCircle } from '@mdi/js';

import numeral from 'numeral';

export const getStatusIcon = (status) => {
	switch(status) {
		case 'waiting':
			return <Icon path={mdiClock} size='18' color='#363E5E' alt='Aguardando' title='Aguardando' />
		case 'preparing':
			return <Icon path={mdiSilverwareSpoon} size='18' color='#363E5E' alt='Preparando' title='Preparando' />
		case 'delivering':
			return <Icon path={mdiMoped} size='18' color='#363E5E' alt='Na entrega' title='Na entrega' />
		case 'delivered':
			return <Icon path={mdiCheckCircle} size='18' color='#058F0A' alt='Entregues' title='Entregues' />
		case 'canceled':
			return <Icon path={mdiCloseCircle} size='18' color='#E63A3A' alt='Cancelado' title='Cancelado' />
		default: return '';
	}
}

export const joinMetas = (metas, values={}) => {
	let return_metas = [];

	//console.log(metas);
	
	metas.forEach(key => {
		if (values[key]) {
			let value = values[key];
			switch (key) {
				case 'address':
					return_metas.push({...value, meta_value:JSON.stringify(value.meta_value)});
				break;
				case 'addresses':
					return_metas = [...return_metas, ...value.map(v => ({...v, meta_value:JSON.stringify(v.meta_value)}))];
				break;
				case 'phones':
				case 'emails':
					return_metas = [...return_metas, ...value];
				break;
				default :
					return_metas.push(value);
			}
		}
	});

	return return_metas;
}

export const meta_model = (type, value='', action='create') => {
	return {action, meta_type:type, meta_value:value};
}

export const initialMetas = (needed=[]) => {
	if (!needed) throw new Error('Metas necessárias não definidas');
	const metas = {};

	needed.forEach(need => {
		if (need === 'address') {
			metas[need] = meta_model('address', {
				street:'',
				number:'',
				district:'',
				zipcode:'',
				city:'',
				state:'',
			});
		} else if (need === 'addresses') {
			metas[need] = [meta_model('address', {
				street:'',
				number:'',
				district:'',
				zipcode:'',
				city:'',
				state:'',
			})];
		} else if (need === 'phones') {
			metas[need] = [meta_model('phone')];
		} else if (need === 'emails') {
			metas[need] = [meta_model('email')];
		} else
			metas[need] = meta_model(need);
	});

	return metas;
}

export const extractMetas = (needed, metas=[]) => {
	//valores padrão
	let return_metas = initialMetas(needed);

	console.log(return_metas);

	//Retira __typename dos metadados
	metas = metas.map(meta => {delete meta.__typename; return meta});

	needed.forEach(meta_type => {
		let value, search_meta;

		if (meta_type === 'addresses')
			search_meta = 'address';
		else if (meta_type === 'phones')
			search_meta = 'phone';
		else if (meta_type === 'emails')
			search_meta = 'email';
		else
			search_meta = meta_type;

		const found = metas.filter(m => m.meta_type === search_meta);
		
		if (found.length) {
			switch(meta_type) {
				case 'address':
					value = found[0];
					return_metas[meta_type] = {...value, meta_value: JSON.parse(value.meta_value)};
				break;
				case 'addresses':
					return_metas[meta_type] = found.map(meta=>({...meta, meta_value:JSON.parse(meta.meta_value)}));
				break;
				case 'phones':
				case 'emails':
					return_metas[meta_type] = found;
				break;
				default :
					return_metas[meta_type] = found[0];
			}
		}
	});

	return return_metas;
}

export const setPageTitle = (new_title) => {
	if (new_title)
		return document.title = `Flakery - ${new_title}`;
	
	return document.title = `Flakery`;
}

numeral.register('locale', 'br', {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
    },
    currency: {
        symbol: 'R$ '
    }
});

numeral.locale('br');