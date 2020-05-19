import React from 'react';

import { mdiClock, mdiSilverwareSpoon, mdiMoped, mdiCheckCircle, mdiCloseCircle } from '@mdi/js';
import Icon from '@mdi/react';
import { uniqueId } from 'lodash';

import { createEmptyAddress, sanitizeAddress, extractAddress } from './address';
import { calculateProductPrice } from './products';

export function createEmptyOrder(overwrite={}) {
	return {
		user: null,
		paymentFee: 0,
		deliveryPrice: 0,
		price: 0,
		type: '',
		discount: 0,
		status: 'waiting',
		message: '',

		address: createEmptyAddress(),

		products: [],
		paymentMethod: null,
		zipcodeOk: false,

		...overwrite,
	};
}

export function extractOrder(order, overwrite={}) {
	return {
		user: order.user,
		paymentFee: order.paymentFee,
		deliveryPrice: order.deliveryPrice,
		price: order.price,
		type: order.type,
		discount: order.discount,
		status: order.status,
		message: order.message,
		address: extractAddress(order.address),
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
					const orderGroup = product.optionsGroups.find(row=>row.optionsGroupRelated.id===group.id);
					const name = orderGroup ? orderGroup.name : group.name;
					const priceType = orderGroup ? orderGroup.priceType : group.priceType;
					const id = orderGroup ? orderGroup.id : group.id;

					const options = group.options.map(option=>{
						const orderOption = orderGroup ? orderGroup.options.find(row=>row.optionRelated.id===option.id) : null;
						const name = orderOption ? orderOption.name : option.name;
						const description = orderOption ? orderOption.description : option.description;
						const selected = orderOption ? true : false;
						const price = orderOption ? orderOption.price : option.price;
						const id = orderOption ? orderOption.id : option.id;

						return { ...option, id, name, description, selected, price, action: 'editable', optionRelated: { id: option.id } };
					})

					return { ...group, id, options, name, priceType, action: 'editable', groupRelated: { id: group.id } };
				}),
			}
		}),
		...overwrite
	};
}

export const calculateOrderPrice = (products, initialValue=0) => {
	if (!products || !products.length) return initialValue;
	return parseFloat(products.filter(row=>row.action !== 'remove').reduce((totalProduct, product) => {
		return totalProduct + calculateProductPrice(product);
	}, initialValue).toFixed(2).replace(',', '.'));
}

export const sanitizeOrder = (data) => {
	const order = {
		userId: data.user.id || null,
		type: data.type,
		status: data.status,
		paymentMethodId: data.paymentMethod && data.paymentMethod.id ? data.paymentMethod.id : '',
		companyId: data.companyId,

		paymentFee: data.paymentFee,
		deliveryPrice: data.deliveryPrice,
		discount: data.discount,
		price: calculateOrderPrice(data.products, data.paymentFee + data.deliveryPrice - data.discount),
		message: data.message,
		
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
								description: option.description,
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

	if (data.type === 'delivery') order.address = sanitizeAddress(data.address);

	return order;
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

export function checkDelivery (value) {
	const { type } = this.parent;

	if (type === 'takeout') return true;

	return !!value;
}

export function checkZipcode (value) {
	if (this.parent.type === 'takeout')
		return true;

	return  /^([\d]{5})-?([\d]{3})$/.test(value);
		
}