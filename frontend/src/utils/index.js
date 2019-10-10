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

export const meta_model = (type, value='', action='new_empty') => {
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

export const createEmptyOrderProduct = (overwrite={}) => {
	if (overwrite.options_groups) {
		overwrite.options_groups = overwrite.options_groups.map(group=>{
			if (group.options) {
				group.options = group.options.map(option=>{
					return {...option, selected:false}
				})
			}
			return group;
		})
	}
	return {
		action:'new_empty',
		message:'',
		options_groups: [],
		...overwrite
	}
}

export const createEmptyOptionsGroup = (overwrite={}) => {
	return {
		name:'',
		type:'single',
		groupRestrained:'',
		action:'new_empty',
		active:true,
		min_select:0,
		max_select:0,
		options:[],
		...overwrite
	}
}

export const createEmptyOption = (overwrite={}) => {
	return {
		name:'',
		price:0,
		item:'',
		active:true,
		max_select_restrain_other:0,
		order:0,
		action:'new_empty',
		...overwrite
	}
}

export const sanitizeOrderData = (data) => {
	return {
		user_id: data.user.id,
		type: data.type,
		status: data.status,
		payment_method_id: data.payment_method,

		payment_fee: data.payment_fee,
		delivery_price: data.delivery_price,
		discount: data.discount,
		price: data.price,
		message: data.message,
		
		street: data.street,
		number: data.number,
		complement: data.complement,
		city: data.city,
		state: data.state,
		district: data.district,
		zipcode: data.zipcode,
		
		products: data.products.map(product => ({
			name: product.name,
			price: product.price,
			message: product.message,
			product_id: product.id,

			optionsGroups: product.options_groups.filter(group=>group.options.some(option=>option.selected)).map(group =>({
				name: group.name,
				options_group_id: group.id,

				options: group.options.filter(option=>option.selected).map(option => ({
					name: option.name,
					price: option.price,
					item_id: option.item ? option.item.id : null,
					option_id: option.id,
				}))
			}))
		}))
	}
}

export const sanitizeProductData = (data) => {
	return {
		name: data.name,
		file: data.file,
		description: data.description,
		type: data.type,
		price: data.price,
		active: data.active,
		category_id: data.category.id,
		options_groups: data.options_groups.map(group=>{
			let g = {
				action: group.action,
				name: group.name,
				type: group.type,
				order: group.order,
				min_select: group.min_select,
				max_select: group.type === 'single' ? 1 : group.max_select,
				active: group.active,
				max_select_restrain: group.groupRestrained && group.groupRestrained.id ? group.groupRestrained.id : null,
				options: group.options.map(option=>{
					let o = {
						action: option.action,
						name: option.name,
						order: option.order,
						active: option.active,
						price: option.price,
						max_select_restrain_other: parseInt(option.max_select_restrain_other),
						item_id: option.item && option.item.id !== 'none' ? option.item.id : null,
					};
					if (option.id && option.action !== 'create') o.id = option.id;
					return o;
				}),
			}
			if (group.id && group.action !== 'create') g.id = group.id;
			return g;
		})	
	}
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