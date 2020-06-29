import React from 'react'

import { Chip, Typography, Card, CardContent } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import moment from 'moment';
import numeral from 'numeral';

import DeliveryAddress from '../../../components/DeliveryAddress';

import { getOrderStatusLabel } from '../../../controller/orderStatus';
import StatusRow from './StatusRow';


export default function DeliveryItem({ item: delivery }) {
	//const colors = getStatusColors(delivery.status);


	// if user is the delivery man of this delivery

	return (
		
		<Card>
			<CardContent>
				<div style={{ marginBottom: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
					<Chip style={{ height: 28 }} label={`#${delivery.id}`} color='secondary' />
					<Chip style={{ height: 28, marginLeft: 8 }} label={getOrderStatusLabel(delivery)} variant='outlined' />
					<Typography style={{ marginLeft: 'auto' }} variant='caption'>{moment(delivery.createdAt).format('DD/MM/YY HH:mm')}</Typography>
				</div>

				<div style={{ marginBottom: 15 }}>
					<Chip style={{ height: 28 }} label={`Valor: ${numeral(delivery.value).format('$0,00.00')}`} />
				</div>

				{delivery.deliveryMan && <div style={{ marginBottom: 10 }}>
					<Alert severity='info'>
						<AlertTitle>Entregador</AlertTitle>
						<div>{delivery.deliveryMan.user.fullName}</div>
						{Boolean(delivery.deliveryMan.user.phones.length) && <Typography variant='caption'>{delivery.deliveryMan.user.phones[0].value}</Typography>}
					</Alert>
				</div>}

				<div style={{ marginBottom: 15 }}>
					<Typography variant='subtitle1' gutterBottom>{delivery.description}</Typography>
				
					<>
						{Boolean(delivery.senderContact) &&
							<Typography style={{ fontSize: 14 }} gutterBottom>
								<Typography style={{ fontWeight: 'bold', fontSize: 14 }} variant='caption'>Contato remetente: </Typography>
								{delivery.senderContact}
							</Typography>}
						<div>
							<Typography style={{ fontWeight: 'bold', fontSize: 14 }}>Entregar à:</Typography>
							<Typography style={{ fontSize: 14 }}>{delivery.receiverName}</Typography>
							<Typography style={{ fontSize: 14 }}>{delivery.receiverContact}</Typography>
						</div>
					</>
				</div>
			
				<div>
					<div style={{ padding: '15px 20px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 15, marginBottom: 10 }}>
						<DeliveryAddress address={delivery.from} title='Retirada' />
					</div>
					<div style={{ padding: '15px 20px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 15, marginBottom: 10 }}>
						<DeliveryAddress address={delivery.to} title='Entrega' />
					</div>
				</div>

				<StatusRow delivery={delivery} />
			</CardContent>
		</Card>
	)
}
