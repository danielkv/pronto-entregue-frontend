export function sanitizeOptionsOrder(group) {
	group.options.map((row, index) => {
		row.order = index;
		if (row.action==='editable') row.action = 'update';
		return row;
	});
	if (group.action === 'editable') group.action = 'update';
	return group;
}