import React, { Fragment, useState, useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'

import { useSelectedCompany } from '../../controller/hooks';
import OrderRollItem from './OrderRollItem';

import { SUBSCRIBE_ORDER_CREATED, GET_ORDER_ROLL, ORDER_STATUS_UPDATED } from '../../graphql/ordersRoll';

export default function AutoOrders() {
	const [open, setOpen] = useState(false);
	const selectedCompany = useSelectedCompany();
	const { data: { company: { orders = [] } = {} } = {}, subscribeToMore } = useQuery(GET_ORDER_ROLL, { variables: { companyId: selectedCompany, filter: { status: ['waiting', 'preparing', 'delivering'] } } });

	function handleClose() {
		setOpen(false);
	}

	useEffect(()=>{
		if (!selectedCompany) return ;

		const unsubscribeNewOrder = subscribeToMore({
			document: SUBSCRIBE_ORDER_CREATED,
			variables: { companyId: selectedCompany },
			updateQuery(prev, { subscriptionData: { data: { orderCreated = null } } }) {
				if (!orderCreated) return prev;

				return Object.assign({}, prev, {
					company: {
						...prev.company,
						orders: [orderCreated, ...prev.company.orders],
					}
				})
			}
		})

		const unsubscribeUpdatedOrder = subscribeToMore({
			document: ORDER_STATUS_UPDATED,
			variables: { companyId: selectedCompany }
		})

		return ()=>{
			unsubscribeNewOrder()
			unsubscribeUpdatedOrder()
		};
	// eslint-disable-next-line
	}, [selectedCompany])

	return (
		<Fragment>
			<Button variant='contained' onClick={()=>setOpen(!open)}>Mostrar pedidos</Button>

			<Dialog
				fullWidth
				maxWidth='md'
				open={open}
				onClose={handleClose}
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
					<Button onClick={handleClose} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	)
}
