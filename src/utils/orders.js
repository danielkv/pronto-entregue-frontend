import React from 'react';

import { mdiClock, mdiSilverwareSpoon, mdiMoped, mdiCheckCircle, mdiCloseCircle } from '@mdi/js';
import Icon from '@mdi/react';
import { uniqueId } from 'lodash';

import { calculateProductPrice } from './products';

export function extractOrder(order) {
	return {
		user: order.user,
		paymentFee: order.paymentFee,
		deliveryPrice: order.deliveryPrice,
		price: order.price,
		type: order.type,
		discount: order.discount,
		status: order.status,
		message: order.message,
		street: order.street,
		number: order.number || '',
		city: order.city,
		state: order.state,
		district: order.district,
		zipcode: order.zipcode,
		paymentMethod: order.paymentMethod,
		products: order.products.map(product=>{
			return {
				...product.productRelated,

				id: product.id,
				price: product.price,
				name: product.name,
				quantity: product.quantity,
				action: 'editable',
				productRelated: { id: product.productRelated.id },

				optionsGroups: product.productRelated.optionsGroups.map(group=>{
					let orderGroup = product.optionsGroups.find(row=>row.optionsGroupRelated.id===group.id);
					let name = orderGroup ? orderGroup.name : group.name;
					let id = orderGroup ? orderGroup.id : group.id;

					let options = group.options.map(option=>{
						let orderOption = orderGroup ? orderGroup.options.find(row=>row.optionRelated.id===option.id) : null;
						let name = orderOption ? orderOption.name : option.name;
						let selected = orderOption ? true : false;
						let price = orderOption ? orderOption.price : option.price;
						let id = orderOption ? orderOption.id : option.id;
						return { ...option, id, name, selected, price, action: 'editable', optionRelated: { id: option.id } };
					})

					return { ...group, id, options, name, action: 'editable', groupRelated: { id: group.id } };
				}),
			}
		}),
	};
}

export const getOrderStatusIcon = (status) => {
	// isIn: [['waiting', 'preparing', 'delivery', 'delivered', 'canceled']],
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
				productRelatedId: product.productRelated.id,

				optionsGroups: product.optionsGroups.filter(group=>group.options.some(option=>option.selected)).map(group =>{
					let newGroup = {
						name: group.name,
						optionsGroupRelatedId: group.groupRelated.id,

						options: group.options.filter(option=>option.selected).map(option => {
							let newOption = {
								name: option.name,
								price: option.price,
								optionRelatedId: option.optionRelated.id,
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