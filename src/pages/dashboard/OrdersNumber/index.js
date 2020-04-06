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
	// eslint-disable-next-line
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
								<div>
									{loadingOrdersQty && waitingOrders  === null ? <CircularProgress color='primary' /> : <Typography variant='h4'>{waitingOrders}</Typography>}
									<Typography>Pedidos aguardando</Typography>
								</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersPreparing} alt='Pedidos em preparo' />
								<div>
									{loadingOrdersQty && preparingOrders === null ? <CircularProgress color='primary' /> : <Typography variant='h4'>{preparingOrders}</Typography>}
									<Typography>Pedidos em preparo</Typography>
								</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersDelivering} alt='Pedidos na entrega' />
								<div>
									{loadingOrdersQty && deliveryOrders === null ? <CircularProgress color='primary' /> : <Typography variant='h4'>{deliveryOrders}</Typography>}
									<Typography>Pedidos na entrega</Typography>
								</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersDelivered} alt='Pedidos entregues' />
								<div>
									{loadingOrdersQty && deliveredOrders === null ? <CircularProgress color='primary' /> : <Typography variant='h4'>{deliveredOrders}</Typography>}
									<Typography>Pedidos entregues</Typography>
								</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersCanceled} alt='Pedidos cancelados' />
								<div>
									{loadingOrdersQty && canceledOrders === null ? <CircularProgress color='primary' /> : <Typography variant='h4'>{canceledOrders}</Typography>}
									<Typography>Pedidos cancelados</Typography>
								</div>
							</OrderStatus>
						</OrdersToday>
					</>
				)}
		</OrdersTodayContainer>
	);
}
