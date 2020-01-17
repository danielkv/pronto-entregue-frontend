import React from 'react';

import { mdiClock, mdiSilverwareSpoon, mdiMoped, mdiCheckCircle, mdiCloseCircle } from '@mdi/js';
import Icon from '@mdi/react';
import { uniqueId } from 'lodash';
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
	metas = metas.map(meta => {delete meta.__typename; return meta});

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

export const setPageTitle = (newTitle) => {
	if (newTitle)
		return document.title = `Flakery - ${newTitle}`;
	
	return document.title = `Flakery`;
}

export const createEmptyOrderProduct = (overwrite={}) => {
	if (overwrite.optionsGroups) {
		overwrite.optionsGroups = overwrite.optionsGroups.map(group=>{
			if (group.id) group.groupRelated = { id: group.id };
			//group.id = uniqueId();
			group.action = 'create';

			if (group.options) {
				group.options = group.options.map(option=>{
					if (option.id) option.optionRelated = { id: option.id };
					group.id = uniqueId();
					option.action = 'create';

					return { ...option, selected: option.selected || false }
				})
			}
			return group;
		})
	}
	if (overwrite.id) {
		overwrite.productRelated = { id: overwrite.id };
		delete overwrite.id;
	}
	return {
		action: 'new_empty',
		message: '',
		quantity: 1,
		optionsGroups: [],
		...overwrite,
		id: uniqueId(),
	}
}

export const createEmptyOptionsGroup = (overwrite={}) => {
	return {
		name: '',
		type: 'single',
		groupRestrained: '',
		action: 'new_empty',
		active: true,
		minSelect: 0,
		maxSelect: 0,
		options: [],
		...overwrite
	}
}

export const createEmptyOption = (overwrite={}) => {
	return {
		name: '',
		price: 0,
		item: '',
		active: true,
		maxSelectRestrainOther: 0,
		order: 0,
		action: 'new_empty',
		...overwrite
	}
}

export const calculateProductPrice = (product) => {
	return product.optionsGroups.reduce((totalGroup, group)=>{
		let optionsPrice = group.options.reduce((totalOption, option)=> {
			return (option.selected) ?  totalOption + option.price : totalOption;
		}, 0);
		return totalGroup + optionsPrice;
	}, product.price);
}

export const calculateOrderPrice = (products, initialValue=0) => {
	if (!products || !products.length) return initialValue;
	return parseFloat(products.filter(row=>row.action !== 'remove').reduce((totalProduct, product) => {
		return totalProduct + calculateProductPrice(product);
	}, initialValue).toFixed(2).replace(',', '.'));
}

export const sanitizeOrderData = (data) => {
	return {
		userId: data.user.id || null,
		type: data.type,
		status: data.status,
		paymentMethodId: data.paymentMethod && data.paymentMethod.id ? data.paymentMethod.id : '',

		paymentFee: data.paymentFee,
		deliveryPrice: data.deliveryPrice,
		discount: data.discount,
		price: calculateOrderPrice(data.products, data.paymentFee + data.deliveryPrice - data.discount),
		message: data.message,
		
		street: data.street,
		number: data.number || null,
		complement: data.complement,
		city: data.city,
		state: data.state,
		district: data.district,
		zipcode: data.zipcode || null,
		
		products: data.products.map(product => {
			let newProduct = {
				action: product.action,
				name: product.name,
				price: product.price,
				quantity: product.quantity,
				message: product.message || '',
				productId: product.productRelated.id,

				optionsGroups: product.optionsGroups.filter(group=>group.options.some(option=>option.selected)).map(group =>{
					let newGroup = {
						name: group.name,
						optionsGroupId: group.groupRelated.id,

						options: group.options.filter(option=>option.selected).map(option => {
							let newOption = {
								name: option.name,
								price: option.price,
								itemId: option.item ? option.item.id : null,
								optionId: option.optionRelated.id,
							};
							if (option.id) newOption.id = option.id;
							return newOption;
						})
					}
					if (group.id) newGroup.id = group.id;
					return newGroup;
				})
			};
			if (product.id) newProduct.id = product.id;
			return newProduct;
		})
	}
}

export const sanitizeProductData = (data) => {
	return {
		name: data.name,
		file: data.file,
		description: data.description,
		type: data.type,
		featured: data.featured,
		price: data.price,
		active: data.active,
		categoryId: data.category.id,
		optionsGroups: data.optionsGroups.map(group=>{
			let g = {
				action: group.action,
				name: group.name,
				type: group.type,
				order: group.order,
				minSelect: group.minSelect,
				maxSelect: group.type === 'single' ? 1 : group.maxSelect,
				active: group.active,
				maxSelectRestrain: group.groupRestrained && group.groupRestrained.id ? group.groupRestrained.id : null,
				options: group.options.map(option=>{
					let o = {
						action: option.action,
						name: option.name,
						order: option.order,
						active: option.active,
						price: option.price,
						maxSelectRestrainOther: parseInt(option.maxSelectRestrainOther),
						itemId: option.item && option.item.id !== 'none' ? option.item.id : null,
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