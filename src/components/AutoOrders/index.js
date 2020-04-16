import React, { Fragment, useState, useEffect, useContext } from 'react'

import { useApolloClient } from '@apollo/react-hooks';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'

import { useSelectedCompany } from '../../controller/hooks';
import { OrderRollContext } from '../../services/ordersRollContext';

import { SUBSCRIBE_ORDER_CREATED } from '../../graphql/ordersRoll';

export default function AutoOrders() {
	const [open, setOpen] = useState(true);
	const client = useApolloClient()
	const selectedCompany = useSelectedCompany();

	console.log(OrderRollContext);

	const { ordersRoll, dispatch } = useContext(OrderRollContext);
	
	function handleClose() {
		setOpen(false);
	}

	useEffect(()=>{
		if (!selectedCompany) return;

		const observer = client.subscribe({
			query: SUBSCRIBE_ORDER_CREATED,
			variables: {
				companyId: selectedCompany,
			},
		})

		const subscription = observer.subscribe(({ data: { orderCreated } = {} }) => {
			console.log(orderCreated)
			dispatch({ type: 'ADD_ORDER_ROLL', order: orderCreated })
		})
	
		return () => {
			subscription.unsubscribe();
		}
	}, [client, selectedCompany])

	return (
		<Fragment>
			<Button variant='contained' onClick={()=>setOpen(!open)}>Mostrar pedidos</Button>

			<Dialog
				fullWidth
				maxWidth='md'
				open={open}
				onClose={handleClose}
				aria-labelledby="max-width-dialog-title"
			>
				<DialogTitle id="max-width-dialog-title">Pedidos em tempo real</DialogTitle>
				<DialogContent>
					{ordersRoll.map(order => (
						<div key={order.id}>{order.user.firstName}</div>
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
