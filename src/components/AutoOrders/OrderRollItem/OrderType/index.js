import React from 'react'

import { Typography } from '@material-ui/core'
import { mdiRacingHelmet } from '@mdi/js'
import Icon from '@mdi/react'

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

						{order.type === 'peDelivery' && (
							<div style={{ marginTop: 5 }}>
								{Boolean(order.delivery && order.delivery.deliveryMan) && (
									<div>
										<Typography variant='subtitle2'><b>Entregador:</b> {order.delivery.deliveryMan.user.fullName}</Typography>
										{Boolean(order.delivery.deliveryMan.user.phones.length) && <Typography variant='caption'>{order.delivery.deliveryMan.user.phones[0].value}</Typography>}
									</div>
								)}
								<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
									<div style={{ marginRight: 5 }}><Icon title='Entrega pronto, entregue!' path={mdiRacingHelmet} size={.8} color='#666' /></div>
									<Typography variant='caption'>Entrega de responsabilidade Pronto, entregue!</Typography>
								</div>
							</div>
						)}
					</div>
				)}
		</div>
	)
}
