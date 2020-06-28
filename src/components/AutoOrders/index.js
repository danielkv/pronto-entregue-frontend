import React, { Fragment, useState, useEffect, useRef } from 'react'

import { useQuery } from '@apollo/react-hooks';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core'
import { mdiVolumeHigh } from '@mdi/js';
import Icon from '@mdi/react';

import notificationAudio from '../../assets/audio/notification.ogg';
import { useSelectedCompany } from '../../controller/hooks';
import OrderRollItem from './OrderRollItem';

import { SUBSCRIBE_ORDER_CREATED, GET_ORDER_ROLL, ORDER_UPDATED } from '../../graphql/ordersRoll';

export default function AutoOrders() {
	const [open, setOpen] = useState(false);
	const selectedCompany = useSelectedCompany();
	const { data: { company: { orders = [] } = {} } = {}, subscribeToMore } = useQuery(GET_ORDER_ROLL, { variables: { companyId: selectedCompany, filter: { status: ['waiting', 'waitingDelivery', 'preparing', 'delivering'] } } });
	const notificationRef = useRef();

	function handleCloseOrdersRoll() {
		setOpen(false);
	}

	useEffect(()=>{
		if (!selectedCompany) return ;

		const unsubscribeNewOrder = subscribeToMore({
			document: SUBSCRIBE_ORDER_CREATED,
			variables: { companyId: selectedCompany },
			updateQuery(prev, { subscriptionData: { data: { orderCreated = null } } }) {
				if (!orderCreated) return prev;

				playNotification();
				
				/* 	enqueueSnackbar(`Novo pedido de ${orderCreated.user.fullName}`, {
					persist: true,
					variant: 'warning',
					iconVariant: { warning: 'X' },
					action: (key) => (
						<div>
							<Button onClick={handleOpen(key, orderCreated.id)}>Abrir</Button>
							<Button onClick={handleClose(key)}>Ok</Button>
						</div>
					)
				}) */

				return Object.assign({}, prev, {
					company: {
						...prev.company,
						orders: [orderCreated, ...prev.company.orders],
					}
				})
			}
		})

		const unsubscribeUpdatedOrder = subscribeToMore({
			document: ORDER_UPDATED,
			variables: { companyId: selectedCompany },
		})

		return ()=>{
			unsubscribeNewOrder()
			unsubscribeUpdatedOrder()
		};
	// eslint-disable-next-line
	}, [selectedCompany])

	function playNotification() {
		if (!notificationRef.current) return;
		notificationRef.current.play()
	}

	return (
		<Fragment>
			<audio ref={notificationRef}>
				<source src={notificationAudio} type="audio/ogg" />
			</audio>
			
			<Button variant='contained' onClick={()=>setOpen(!open)}>Mostrar pedidos</Button>
			
			<IconButton variant='contained' onClick={playNotification} title='Testar áudio'>
				<Icon path={mdiVolumeHigh} size={.9} color='#ccc' />
			</IconButton>

			<Dialog
				fullWidth
				maxWidth='md'
				open={open}
				onClose={handleCloseOrdersRoll}
				aria-labelledby="max-width-dialog-title"
				scroll='body'
				PaperProps={{ style: { backgroundColor: '#EFE8DA' } } }
			>
				<DialogTitle id="max-width-dialog-title">Pedidos em tempo real</DialogTitle>
				<DialogContent>
					{orders.map((order) => (
						<OrderRollItem key={order.id} item={order} />
					))}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseOrdersRoll} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	)
}
