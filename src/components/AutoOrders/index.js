import React, { Fragment, useState, useEffect, useRef } from 'react'

import { useQuery } from '@apollo/react-hooks';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'

import { useSelectedCompany } from '../../controller/hooks';
import OrderRollItem from './OrderRollItem';

import { GET_NOTIFICATION_SOUND } from '../../graphql/companies';
import { SUBSCRIBE_ORDER_CREATED, GET_ORDER_ROLL, ORDER_UPDATED } from '../../graphql/ordersRoll';

export default function AutoOrders() {
	const [open, setOpen] = useState(false);
	const selectedCompany = useSelectedCompany();
	const { data: { company: { orders = [] } = {} } = {}, subscribeToMore } = useQuery(GET_ORDER_ROLL, { variables: { companyId: selectedCompany, filter: { status: { '$not': ['delivered', 'canceled'] } } } });
	const notificationRef = useRef();

	const { data: { companySound = null } = {}, loading: loadingSound } = useQuery(GET_NOTIFICATION_SOUND, { variables: { companyId: selectedCompany }, fetchPolicy: 'cache-first' });

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

				setOpen(true)

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
		notificationRef.current.load()
		notificationRef.current.play()
	}

	return (
		<Fragment>
			{!loadingSound && <audio ref={notificationRef}>
				<source src={companySound.url} />
			</audio>}
			
			<Button variant='contained' onClick={()=>setOpen(!open)}>Mostrar pedidos</Button>

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
