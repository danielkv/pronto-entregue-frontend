import React from 'react'

import { Typography } from '@material-ui/core'

export default function OrderType({ order }) {
	return (
		<div>
			{order.type === 'takeout'
				? <Typography>Retirada no Balcão</Typography>
				: (
					<div>
						<Typography style={{ fontWeight: 'bold' }}>{`${order.address.street}, n ${order.address.number}`}</Typography>
						<Typography variant='subtitle2'>{order.address.district}</Typography>
						<Typography variant='subtitle2'>{`${order.address.city} - ${order.address.state}`}</Typography>
						<Typography variant='subtitle2'>{order.address.zipcode}</Typography>
						{order.address.complement && <Typography variant='subtitle2'>{order.address.complement}</Typography>}
						{order.address.reference && <Typography variant='caption'>
							<Typography variant='caption' style={{ fontWeight: 'bold' }}>Ponto de referência</Typography>: {order.address.reference}
						</Typography>}
					</div>
				)}
		</div>
	)
}
