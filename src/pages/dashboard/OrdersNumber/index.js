import React, { useEffect } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { Typography, CircularProgress } from '@material-ui/core';

import OrdersAwaiting from '../../../assets/images/orders-awaiting.png';
import OrdersDelivered from '../../../assets/images/orders-delivered.png';
import OrdersDelivering from '../../../assets/images/orders-delivering.png';
import OrdersPreparing from '../../../assets/images/orders-preparing.png';
import { useSelectedCompany } from '../../../controller/hooks';
import { ErrorBlock } from '../../../layout/blocks';
import { getErrors } from '../../../utils/error';
import OrdersCanceled from '../.././../assets/images/orders-canceled.png';
import { OrdersTodayContainer, OrdersToday, OrderStatus } from '../styles';

import { GET_COMPANY_ORDERS_QTY } from '../../../graphql/orders';


// import { Container } from './styles';

export default function OrdersNumber() {
	const selectedCompany = useSelectedCompany();

	const {
		data: {
			company: {
				waitingOrders = 0,
				preparingOrders = 0,
				deliveryOrders = 0,
				deliveredOrders = 0,
				canceledOrders = 0,
			} = {}
		} = {},
		loading: loadingOrdersQty,
		error: ordersQtyError,
		startPolling,
		stopPolling
	} = useQuery(GET_COMPANY_ORDERS_QTY, { variables: { id: selectedCompany } });

	useEffect(()=>{
		if (loadingOrdersQty || !startPolling) return;
		
		startPolling(30000);
		return ()=>{
			stopPolling();
		}
	}, [loadingOrdersQty])

	return (
		<OrdersTodayContainer>
			{(ordersQtyError)
				? <ErrorBlock error={getErrors(ordersQtyError)} />
				: (
					<>
						<Typography variant='h6'>Pedidos</Typography>
						<OrdersToday>
							<OrderStatus>
								<img src={OrdersAwaiting} alt='Pedidos aguardando' />
								{loadingOrdersQty && waitingOrders  === null ? <CircularProgress color='primary' /> : <h4>{waitingOrders}</h4>}
								<div>Pedidos aguardando</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersPreparing} alt='Pedidos em preparo' />
								{loadingOrdersQty && preparingOrders === null ? <CircularProgress color='primary' /> : <h4>{preparingOrders}</h4>}
								<div>Pedidos em preparo</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersDelivering} alt='Pedidos na entrega' />
								{loadingOrdersQty && deliveryOrders === null ? <CircularProgress color='primary' /> : <h4>{deliveryOrders}</h4>}
								<div>Pedidos na entrega</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersDelivered} alt='Pedidos entregues' />
								{loadingOrdersQty && deliveredOrders === null ? <CircularProgress color='primary' /> : <h4>{deliveredOrders}</h4>}
								<div>Pedidos entregues</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersCanceled} alt='Pedidos cancelados' />
								{loadingOrdersQty && canceledOrders === null ? <CircularProgress color='primary' /> : <h4>{canceledOrders}</h4>}
								<div>Pedidos cancelados</div>
							</OrderStatus>
						</OrdersToday>
					</>
				)}
		</OrdersTodayContainer>
	);
}
