import React, { Fragment, useState, useEffect, useRef } from 'react'

import { useQuery } from '@apollo/react-hooks';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'

import { useSelectedCompany } from '../../controller/hooks';
import OrderRollItem from './OrderRollItem';

import { GET_COMPANY_CONFIG } from '../../graphql/companies';
import { SUBSCRIBE_ORDER_CREATED, GET_ORDER_ROLL, ORDER_UPDATED } from '../../graphql/ordersRoll';

export default function AutoOrders() {
	const [open, setOpen] = useState(false);
	const selectedCompany = useSelectedCompany();
	const { data: { company: { orders = [] } = {} } = {}, subscribeToMore } = useQuery(GET_ORDER_ROLL, { variables: { companyId: selectedCompany, filter: { status: { '$not': ['delivered', 'canceled'] } } } });
	const notificationRef = useRef();

	const { data: { companyConfig: { notificationSound = null } = {} } = {}, loading: loadingSound } = useQuery(GET_COMPANY_CONFIG, { variables: { companyId: selectedCompany, keys: ['notificationSound'] }, fetchPolicy: 'cache-first' });

	function handleCloseOrdersRoll() {
		setOpen(false);
	}

	function addOrderToList(prev, order) {
		const excludeStatus = ['paymentPending', 'delivered', 'canceled'];
		if (excludeStatus.includes(order.status)) return prev;

		if (order.status === 'waiting') {
			playNotification();
			setOpen(true)
		}

		// should push new order to orders list
		const ordersInList = prev.company.orders;
		if (!ordersInList.find(o => o.id === order.id))
			return Object.assign({}, prev, {
				company: {
					...prev.company,
					orders: [order, ...prev.company.orders],
				}
			})

		return prev;
	}

	useEffect(() => {
		if (!selectedCompany) return;


		const unsubscribeNewOrder = subscribeToMore({
			document: SUBSCRIBE_ORDER_CREATED,
			variables: { companyId: selectedCompany },
			updateQuery(prev, { subscriptionData: { data: { orderCreated = null } } }) {
				if (!orderCreated) return prev;

				return addOrderToList(prev, orderCreated)
			}
		})

		const unsubscribeUpdatedOrder = subscribeToMore({
			document: ORDER_UPDATED,
			variables: { companyId: selectedCompany },
			updateQuery(prev, { subscriptionData: { data: { orderUpdated = null } } }) {
				if (!orderUpdated) return prev;

				return addOrderToList(prev, orderUpdated);
			}
		})

		return () => {
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
				<source src={notificationSound.url} />
			</audio>}

			<Button variant='contained' onClick={() => setOpen(!open)}>Mostrar pedidos</Button>

			<Dialog
				fullWidth
				maxWidth='md'
				open={open}
				onClose={handleCloseOrdersRoll}
				aria-labelledby="max-width-dialog-title"
				scroll='body'
				PaperProps={{ style: { backgroundColor: '#EFE8DA' } }}
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
