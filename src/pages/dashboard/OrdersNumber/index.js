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

import { GET_ORDERS_STATUS_QTY, SUBSCRIBE_ORDER_STATUS_QTY } from '../../../graphql/orders';


// import { Container } from './styles';

export default function OrdersNumber() {
	const selectedCompany = useSelectedCompany();

	const {
		data: {
			ordersStatusQty: {
				waiting = 0,
				preparing = 0,
				delivery = 0,
				delivered = 0,
				canceled = 0,
			} = {}
		} = {},
		loading: loadingOrdersQty,
		error: ordersQtyError,
		subscribeToMore
	} = useQuery(GET_ORDERS_STATUS_QTY, { variables: { companyId: selectedCompany } });

	useEffect(()=>{
		if (!selectedCompany) return;

		const unsubscribe = subscribeToMore({
			document: SUBSCRIBE_ORDER_STATUS_QTY,
			variables: { companyId: selectedCompany },
			updateQuery(prev, { subscriptionData: { data: { updateOrderStatus = null } } }) {
				if (!updateOrderStatus) return prev;

				const result = Object.assign({}, prev, { ordersStatusQty: updateOrderStatus })

				return result
			}
		})

		return unsubscribe;
	// eslint-disable-next-line
	}, [selectedCompany])

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
									{loadingOrdersQty && waiting  === null ? <CircularProgress color='primary' /> : <Typography variant='h4'>{waiting}</Typography>}
									<Typography>Pedidos aguardando</Typography>
								</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersPreparing} alt='Pedidos em preparo' />
								<div>
									{loadingOrdersQty && preparing === null ? <CircularProgress color='primary' /> : <Typography variant='h4'>{preparing}</Typography>}
									<Typography>Pedidos em preparo</Typography>
								</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersDelivering} alt='Pedidos na entrega' />
								<div>
									{loadingOrdersQty && delivery === null ? <CircularProgress color='primary' /> : <Typography variant='h4'>{delivery}</Typography>}
									<Typography>Pedidos na entrega</Typography>
								</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersDelivered} alt='Pedidos entregues' />
								<div>
									{loadingOrdersQty && delivered === null ? <CircularProgress color='primary' /> : <Typography variant='h4'>{delivered}</Typography>}
									<Typography>Pedidos entregues</Typography>
								</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersCanceled} alt='Pedidos cancelados' />
								<div>
									{loadingOrdersQty && canceled === null ? <CircularProgress color='primary' /> : <Typography variant='h4'>{canceled}</Typography>}
									<Typography>Pedidos cancelados</Typography>
								</div>
							</OrderStatus>
						</OrdersToday>
					</>
				)}
		</OrdersTodayContainer>
	);
}
