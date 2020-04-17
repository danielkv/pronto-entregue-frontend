import React from 'react'

import { Chip, Typography, Paper } from '@material-ui/core'
import moment from 'moment'

import OrderRollProduct from './OrderRollProduct'

export default function OrderRollItem({ item: order }) {
	return (
		<Paper style={{ marginTop: 10, marginBottom: 10, padding: 15 }} elevation={0}>
			<div style={{ marginBottom: 10 }}>
				<Chip label={`#${order.id}`} color='secondary' />
				<Typography style={{ marginLeft: 6 }} variant='caption'>{moment(order.createdAt).format('DD/MM HH:mm')}</Typography>
			</div>
			
			<div style={{ marginLeft: 20, display: 'flex', flexDirection: 'row' }}>
				<div style={{ width: '55%', marginRight: 30 }}>
					{order.products.map(product => <OrderRollProduct key={product.id} product={product} />)}
				</div>
				<div>
					<Typography>{order.user.fullName}</Typography>
					{order.type === 'takeout'
						? <Typography>Retirada no Balcão</Typography>
						: (
							<div>
								<Typography style={{ fontWeight: 'bold' }}>{`${order.address.street}, n ${order.address.number}`}</Typography>
								<Typography variant='subtitle2'>{order.address.district}</Typography>
								<Typography variant='subtitle2'>{`${order.address.city} - ${order.address.state}`}</Typography>
								<Typography variant='subtitle2'>{order.address.zipcode}</Typography>
								{Boolean(order.message) && (
									<div style={{ marginTop: 15 }}>
										<Typography style={{ fontWeight: 'bold' }}>Observações: </Typography>
										<Typography variant='caption'>{order.message}</Typography>
									</div>
								)}
							</div>
						)}
				</div>
			</div>
		</Paper>
	)
}
