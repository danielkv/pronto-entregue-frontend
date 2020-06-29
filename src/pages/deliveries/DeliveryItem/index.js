import React, { useState } from 'react'

import { Chip, Typography, Card, CardContent, Button } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import Icon from '@mdi/react';
import { motion, AnimatePresence  } from 'framer-motion';
import moment from 'moment';
import numeral from 'numeral';

import DeliveryAddress from '../../../components/DeliveryAddress';

import { getOrderStatusLabel } from '../../../controller/orderStatus';
import StatusRow from './StatusRow';


export default function DeliveryItem({ item: delivery }) {
	const [displayAddresses, setDisplayAddresses] = useState(false)

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
			

				<div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
					<Button
						startIcon={<Icon path={displayAddresses ? mdiChevronUp : mdiChevronDown} size={.8} />}
						style={{ fontSize: 13, textTransform: 'none', alignSelf: 'center' }}
						onClick={()=>setDisplayAddresses(!displayAddresses)}
						dense
					>
						{displayAddresses? 'Esconder endereços' : 'Mostrar endereços'}
					</Button>
				</div>
				<AnimatePresence>
					{displayAddresses && (
						<motion.div
							initial={{ maxHeight: 0 }}
							animate={{ maxHeight: 300 }}
							exit={{ maxHeight: 0 }}
							style={{ marginTop: 10, overflow: 'hidden' }}
						>
							<div style={{ padding: '15px 20px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 15, marginBottom: 10 }}>
								<DeliveryAddress address={delivery.from} title='Retirada' />
							</div>
							<div style={{ padding: '15px 20px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 15, marginBottom: 10 }}>
								<DeliveryAddress address={delivery.to} title='Entrega' />
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				<StatusRow delivery={delivery} />
			</CardContent>
		</Card>
	)
}
