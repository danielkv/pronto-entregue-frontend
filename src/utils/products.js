import _ from 'lodash';

import { extractSale, sanitizeSale, createEmptySale } from "./sale";

export function createEmptyProduct(overwrite={}) {
	return {
		name: '',
		description: '',
		active: true,
		type: 'inline',
		price: '',
		sku: '',
		file: '',
		preview: '',
		fromPrice: '',
		category: { id: '' },
		optionsGroups: [],
		campaigns: [],
		sale: createEmptySale(),
		minDeliveryTime: null,
		scheduleEnabled: false,

		...overwrite,
	};
}

export function createEmptyOptionsGroup(overwrite={}) {
	return {
		name: '',
		type: 'single',
		priceType: 'higher',
		groupRestrained: '',
		action: 'new_empty',
		active: true,
		minSelect: 0,
		maxSelect: 0,
		options: [],
		
		...overwrite
	}
}

export function createEmptyOption(overwrite={}) {
	return {
		name: '',
		description: '',
		price: 0,
		active: true,
		maxSelectRestrainOther: 0,
		order: 0,
		action: 'new_empty',
		...overwrite
	}
}

export function calculateOptionsGroupPrice(group) {
	let optionsPrice = 0;
	if (group.priceType === 'sum') {
		// case group should SUM all selected options' prices
		optionsPrice = group.options.reduce((totalOption, option)=> {
			return totalOption + option.price;
		}, 0);
	} else if (group.priceType === 'higher') {
		// case group should consider only the highest selected options' prices
		if (group.options.length) {
			group.options.sort((a, b) => a.price > b.price ? -1 : 1);
			optionsPrice = group.options[0].price;
		}
	}
	return optionsPrice;
}

export function calculateProductPrice(product) {
	return product.optionsGroups.reduce((totalGroup, group)=>{
		const groupPrice = calculateOptionsGroupPrice(group)
		return totalGroup + groupPrice;
	}, product.price) * product.quantity;
}

export function filterProductSelectedOptions(product) {
	return {
		...product,
		optionsGroups: product.optionsGroups.filter(group=>group.options.some(option=>option.selected)).map(group =>({
			...group,
			options: group.options.filter(option=>option.selected)
		}))
	}
}

export function extractProduct(product) {
	const minDeliveryTime = product.minDeliveryTime;
	const hours = Math.floor(minDeliveryTime / 60);
	const minutes = minDeliveryTime - (hours * 60);

	return {
		name: product.name,
		description: product.description,
		active: product.active,
		category: product.category,
		price: product.price,
		sku: product.sku || '',
		fromPrice: product.fromPrice,
		type: product.type,
		campaigns: product.campaigns,
		file: '',
		preview: product.image,
		sale: extractSale(product.sale),
		minDeliveryTime: `${hours}:${minutes}`,
		scheduleEnabled: product.scheduleEnabled,
		
		optionsGroups: product.optionsGroups.map(optionsGroup => ({
			action: 'editable',
			...optionsGroup,
			options: optionsGroup.options.map(option => ({
				action: 'editable',
				...option,
				description: option.description || ''
			}))
		}))
	};
}

export function sanitizeProduct(data) {
	const splittedTime = data.minDeliveryTime.split(':');
	const minDeliveryTime = _.toInteger(splittedTime[0]) * 60 + _.toInteger(splittedTime[1]);

	return {
		name: data.name,
		file: data.file,
		sku: data.sku,
		description: data.description,
		type: data.type || 'inline',
		price: data.price,
		fromPrice: data.fromPrice,
		active: data.active,
		categoryId: data.category.id,
		sale: sanitizeSale(data.sale),
		minDeliveryTime,
		scheduleEnabled: data.scheduleEnabled,

		optionsGroups: data.optionsGroups.filter(g => g.action !== 'remove_new').map(group => {
			let g = {
				action: group.action,
				name: group.name,
				type: group.type,
				priceType: group.priceType,
				order: group.order,
				minSelect: group.minSelect,
				maxSelect: group.type === 'single' ? 1 : group.maxSelect,
				active: group.active,
				maxSelectRestrain: group.groupRestrained && group.groupRestrained.id ? group.groupRestrained.id : null,
				options: group.options.filter(o => o.action !== 'remove_new').map(option=>{
					let o = {
						action: option.action,
						name: option.name,
						description: option.description,
						order: option.order,
						active: option.active,
						price: option.price,
						maxSelectRestrainOther: parseInt(option.maxSelectRestrainOther),
					};
					if (option.id && option.action !== 'create') o.id = option.id;
					return o;
				}),
			}
			if (group.id) g.id = group.id;
			return g;
		})
	}
}