import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useQuery, useSubscription } from '@apollo/react-hooks';
import { IconButton, Badge } from '@material-ui/core';
import { mdiBell } from '@mdi/js';
import Icon from '@mdi/react';

import { Container } from './styles';

import { GET_SELECTED_COMPANY } from '../../graphql/companies'
import { SUBSCRIBE_ORDER_CREATED } from '../../graphql/orders';

export default function Notification() {
	const history = useHistory();
	const [newOrders, setNewOrders] = useState(0);

	const { data: { selectedCompany } } = useQuery(GET_SELECTED_COMPANY);
	const { data: { orderCreated } = {} } = useSubscription(SUBSCRIBE_ORDER_CREATED, { variables: { companyId: selectedCompany } });

	useEffect(() => {
		if (orderCreated) setNewOrders((newOrders) => newOrders += 1)
	}, [orderCreated, setNewOrders]);

	return (
		<Container>
			<IconButton onClick={()=>history.push('/pedidos')}>
				<Badge badgeContent={newOrders} color='secondary'>
					<Icon path={mdiBell} color='#ccc' size='22' />
				</Badge>
			</IconButton>
		</Container>
	);
}
