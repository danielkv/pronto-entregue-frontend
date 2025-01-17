import React from 'react'

import { Typography, Chip } from '@material-ui/core'

export default function OrderRollProduct({ product }) {
	return (
		<div key={product.id}>
			<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
				<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
					<Typography style={{ fontWeight: 'bold' }}>{product.name}</Typography>
					<Chip size='small' style={{ marginLeft: 5, fontSize: 13 }} label={product.productRelated.category.name} />
				</div>
				{Boolean(product.productRelated.sku) && <Typography style={{ marginLeft: 10 }} variant='caption'>{`#${product.productRelated.sku}`}</Typography>}
			</div>
			<div style={{ marginLeft: 15 }}>
				<div>
					<Typography style={{ fontSize: 13, fontWeight: 'bold', display: 'inline-block' }}>Quantidade: </Typography>
					<Typography style={{ fontSize: 13, display: 'inline-block' }}>{product.quantity}</Typography>
				</div>
				<Typography variant='caption'>{product.productRelated.description}</Typography>
				<div>
					{product.optionsGroups.map(group => (
						<div key={group.id}>
							<Typography style={{ fontSize: 13, fontWeight: 'bold', display: 'inline-block' }}>{`${group.name}:`}</Typography>
							<Typography style={{ fontSize: 13, display: 'inline-block' }}>{group.options.map(option => option.name).join(', ')}</Typography>
						</div>
					))}
				</div>
				{Boolean(product.message) && (
					<div style={{ marginTop: 5 }}>
						<Typography style={{ fontSize: 13, fontWeight: 'bold', display: 'inline-block' }}>Observações: </Typography>
						<Typography style={{ fontSize: 13, display: 'inline-block' }}>{product.message}</Typography>
					</div>
				)}
			</div>
		</div>
	)
}
