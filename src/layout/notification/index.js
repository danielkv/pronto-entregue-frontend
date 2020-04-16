import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link, useHistory } from 'react-router-dom';

import { useApolloClient } from '@apollo/react-hooks';
import { IconButton, Badge, Button } from '@material-ui/core';
import { mdiBell } from '@mdi/js';
import Icon from '@mdi/react';
import { useSnackbar } from 'notistack';

import { useSelectedCompany } from '../../controller/hooks';
import { Container } from './styles';

import { SUBSCRIBE_ORDER_CREATED } from '../../graphql/ordersRoll';

export default function Notification() {
	const { url } = useRouteMatch();
	const history = useHistory();
	const client = useApolloClient()
	const selectedCompany = useSelectedCompany();
	
	const [newOrdersList, setNewOrdersList] = useState([]);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	
	useEffect(() => {
		if (!selectedCompany) return;

		const observer = client.subscribe({
			query: SUBSCRIBE_ORDER_CREATED,
			variables: {
				companyId: selectedCompany,
			},
		})
		
		const subscription = observer.subscribe(({ data: { orderCreated } = {} }) => {
			addNewOrder(orderCreated);
		})
		
		return () => {
			setNewOrdersList([]);
			subscription.unsubscribe();
		}
		// eslint-disable-next-line
	}, [selectedCompany])
	
	function addNewOrder(order) {
		setNewOrdersList((orderList) => [...orderList, order])
		enqueueSnackbar(`Novo pedido de ${order.user.fullName} criado`, {
			persist: true,
			variant: 'warning',
			iconVariant: { warning: 'X' },
			action: (key) => (
				<div>
					<Button onClick={handleOpen(key, order.id)}>Abrir</Button>
					<Button onClick={handleClose(key)}>Ok</Button>
				</div>
			)
		})
	}
		
	const handleOpen = (key, orderId) => () => {
		closeSnackbar(key);
		history.push(`${url}/pedidos/alterar/${orderId}`)
	}
		
	const handleClose = (key) => () => {
		closeSnackbar(key);
	}
		
	return (
		<Container>
			<IconButton component={Link} to={`${url}/pedidos`}>
				<Badge badgeContent={newOrdersList.lenth} color='primary'>
					<Icon path={mdiBell} color='#ccc' size={1} />
				</Badge>
			</IconButton>
		</Container>
	);
}
		