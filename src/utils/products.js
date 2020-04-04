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
		price: 0,
		active: true,
		maxSelectRestrainOther: 0,
		order: 0,
		action: 'new_empty',
		...overwrite
	}
}

export function calculateProductPrice(product) {
	return product.optionsGroups.reduce((totalGroup, group)=>{
		let optionsPrice = group.options.reduce((totalOption, option)=> {
			return (option.selected) ?  totalOption + option.price : totalOption;
		}, 0);
		return totalGroup + optionsPrice;
	}, product.price);
}

export function extractProduct(product) {
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
		
		optionsGroups: product.optionsGroups.map(optionsGroup => ({
			action: 'editable',
			...optionsGroup,
			options: optionsGroup.options.map(option => ({
				action: 'editable',
				...option
			}))
		}))
	};
}

export function sanitizeProduct(data) {
	return {
		name: data.name,
		file: data.file,
		sku: data.sku,
		description: data.description,
		type: data.type,
		price: data.price,
		fromPrice: data.fromPrice,
		active: data.active,
		categoryId: data.category.id,
		sale: sanitizeSale(data.sale),

		optionsGroups: data.optionsGroups.map(group=>{
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
				options: group.options.map(option=>{
					let o = {
						action: option.action,
						name: option.name,
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