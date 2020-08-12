import React, { useState } from 'react'

import { useMutation } from '@apollo/react-hooks';
import { Chip, Typography, Card, CardContent, Button, CircularProgress, Link } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import Icon from '@mdi/react';
import { motion, AnimatePresence  } from 'framer-motion';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import numeral from 'numeral';

import DeliveryAddress from '../../../components/DeliveryAddress';

import DeliveryController from '../../../controller/delivery';
import { getErrors } from '../../../utils/error';
import StatusRow from './StatusRow';
import UserAutoComplete from './userAutoComplete';

import { SET_DELIVERY_MAN, REMOVE_DELIVERY_MAN } from '../../../graphql/deliveries';


export default function DeliveryItem({ item: delivery }) {
	const [displayAddresses, setDisplayAddresses] = useState(false)
	const [displaySelectDeliveryMan, setDisplaySelectDeliveryMan] = useState(false);

	const { enqueueSnackbar } = useSnackbar();
	const [loadingSetDeliveryMan, setLoadingSetDeliveryMan] = useState(false)

	const [removeDeliveryMan] = useMutation(REMOVE_DELIVERY_MAN, { variables: { deliveryId: delivery.id } });
	const [setDeliveryMan] = useMutation(SET_DELIVERY_MAN, { variables: { deliveryId: delivery.id } });

	function setUser(user) {
		setLoadingSetDeliveryMan(true);

		removeDeliveryMan()
			.then(()=>setDeliveryMan({ variables: { userId: user.id } }))
			.then(()=>{
				enqueueSnackbar(`${user.fullName} definido como entregador da entrega #${delivery.id}`, { variant: 'success' });
			})
			.catch((err)=>{
				enqueueSnackbar(getErrors(err), { variant: 'error' });
			})
			.finally(()=>setLoadingSetDeliveryMan(false));
	}

	return (
		
		<Card>
			<CardContent>
				<div style={{ marginBottom: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
					<Chip style={{ height: 28 }} label={`#${delivery.id}`} color='secondary' />
					<Chip style={{ height: 28, marginLeft: 8 }} label={DeliveryController.statusLabel(delivery.status)} variant='outlined' />
					<Typography style={{ marginLeft: 'auto' }} variant='caption'>{moment(delivery.createdAt).format('DD/MM/YY HH:mm')}</Typography>
				</div>

				<div style={{ marginBottom: 15 }}>
					<Chip style={{ height: 28 }} label={`Valor: ${numeral(delivery.value).format('$0,00.00')}`} />
				</div>

				<AnimatePresence>
					{(displaySelectDeliveryMan || !delivery.deliveryMan) &&
					<motion.div
						initial={{ height: 0, marginBottom: 0 }}
						animate={{ height: 'auto', marginBottom: 15 }}
						exit={{ height: 0, marginBottom: 0 }}
						style={{ overflow: 'hidden' }}
					>
						<UserAutoComplete setUser={setUser} />
					</motion.div>}
				</AnimatePresence>

				{(loadingSetDeliveryMan || delivery.deliveryMan) && <div style={{ marginBottom: 10 }}>
					<Alert severity='info'>
						{loadingSetDeliveryMan
							? <CircularProgress />
							: <>
								<AlertTitle>Entregador <Link href='#' onClick={()=>setDisplaySelectDeliveryMan(!displaySelectDeliveryMan)} color='textSecondary' variant='subtitle2'>Alterar</Link></AlertTitle>
								<div>{delivery.deliveryMan.user.fullName}</div>
								{Boolean(delivery.deliveryMan.user.phones.length) && <Typography variant='caption'>{delivery.deliveryMan.user.phones[0].value}</Typography>}
							</>}
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
					>
						{displayAddresses? 'Esconder endereços' : 'Mostrar endereços'}
					</Button>
				</div>
				<AnimatePresence>
					{displayAddresses && (
						<motion.div
							initial={{ height: 0 }}
							animate={{ height: 'auto' }}
							exit={{ height: 0 }}
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
