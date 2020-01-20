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