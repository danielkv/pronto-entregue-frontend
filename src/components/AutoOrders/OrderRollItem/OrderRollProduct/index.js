import React from 'react'

import { Typography } from '@material-ui/core'

export default function OrderRollProduct({ product }) {
	return (
		<div key={product.id}>
			<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
				<Typography style={{ fontWeight: 'bold' }}>{product.name}</Typography>
				{Boolean(product.productRelated.sku) && <Typography style={{ marginLeft: 10 }} variant='caption'>{`#${product.productRelated.sku}`}</Typography>}
			</div>
			<div style={{ marginLeft: 15 }}>
				<Typography variant='caption'>{product.productRelated.description}</Typography>
				<div>
					{product.optionsGroups.map(group => (
						<div key={group.id}>
							<Typography style={{ fontSize: 13, fontWeight: 'bold', display: 'inline-block' }}>{`${group.name}:`}</Typography>
							<Typography style={{ fontSize: 13, display: 'inline-block' }}>{group.options.map(option => option.name).join(', ')}</Typography>
						</div>
					))}
				</div>
				{Boolean(product.message) && <Typography variant='caption'>{product.message}</Typography>}
			</div>
		</div>
	)
}
