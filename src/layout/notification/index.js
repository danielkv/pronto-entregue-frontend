import React, { useEffect, useState } from 'react';
import Icon from '@mdi/react';
import { useHistory } from 'react-router-dom';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import { IconButton, Badge } from '@material-ui/core';
import { mdiBell } from '@mdi/js';

import { Container } from './styles';

import { SUBSCRIBE_ORDER_CREATED } from '../../graphql/orders';
import { GET_SELECTED_BRANCH } from '../../graphql/branches';

export default function Notification() {
	const history = useHistory();
	const [newOrders, setNewOrders] = useState(0);

	const {data: { selectedBranch } } = useQuery(GET_SELECTED_BRANCH);
	const { data: { orderCreated } = {} } = useSubscription(SUBSCRIBE_ORDER_CREATED, { variables: { branch_id: selectedBranch } });

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
