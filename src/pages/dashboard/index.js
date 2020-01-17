import React, { Fragment } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableRow, TableCell } from '@material-ui/core';

import { Content, BlockTitle, CircleNumber, ProductImage, Loading } from '../../layout/components';


import OrdersAwaiting from '../../assets/images/orders-awaiting.png';
import OrdersCanceled from '../../assets/images/orders-canceled.png';
import OrdersDelivered from '../../assets/images/orders-delivered.png';
import OrdersDelivering from '../../assets/images/orders-delivering.png';
import OrdersPreparing from '../../assets/images/orders-preparing.png';
import { ErrorBlock } from '../../layout/blocks';
import { getStatusIcon, setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { OrdersToday, OrderStatus, OrderCreated, OrderDate, OrderTime, DashContainer, OrdersTodayContainer, BestSellersContainer, LastSalesContainer } from './styles';

import { GET_SELECTED_COMPANY, GET_COMPANY_BEST_SELLERS } from '../../graphql/companies';
import { GET_COMPANY_ORDERS_QTY, GET_COMPANY_LAST_ORDERS } from '../../graphql/orders';

function Page () {
	setPageTitle('Dashboard');

	const filter = { createdAt: 'curdate' };
	const pagination = { page: 0, rowsPerPage: 4 };

	//get selected company
	const { data: { selectedCompany } } = useQuery(GET_SELECTED_COMPANY);

	//get company best sellers
	const { data: { company: { bestSellers = [] } = {} } = {} } = useQuery(GET_COMPANY_BEST_SELLERS, { variables: { id: selectedCompany, pagination, filter } });
	
	//get company last orders
	const { data: { company: { orders: lastOrders = [] } = {} } = {} } = useQuery(GET_COMPANY_LAST_ORDERS, { variables: { id: selectedCompany, pagination } });
	
	//load order qtys
	const {
		data: {
			company: {
				waitingOrders,
				preparingOrders,
				deliveryOrders,
				deliveredOrders,
				canceledOrders,
			}
		},
		loading: loadingOrdersQty,
		error: ordersQtyError
	} = useQuery(GET_COMPANY_ORDERS_QTY, { variables: { id: selectedCompany } });

	return (
		<Fragment>
			<Content>
				<DashContainer>
					<OrdersTodayContainer>
						{(ordersQtyError)
							? <ErrorBlock error={getErrors(ordersQtyError)} />
							: (
								<>
									<BlockTitle>Pedidos de hoje</BlockTitle>
									<OrdersToday>
										<OrderStatus>
											<img src={OrdersAwaiting} alt='Pedidos aguardando' />
											{loadingOrdersQty ? <Loading /> : <h4>{waitingOrders}</h4>}
											<div>Pedidos aguardando</div>
										</OrderStatus>
										<OrderStatus>
											<img src={OrdersPreparing} alt='Pedidos em preparo' />
											{loadingOrdersQty ? <Loading /> : <h4>{preparingOrders}</h4>}
											<div>Pedidos em preparo</div>
										</OrderStatus>
										<OrderStatus>
											<img src={OrdersDelivering} alt='Pedidos na entrega' />
											{loadingOrdersQty ? <Loading /> : <h4>{deliveryOrders}</h4>}
											<div>Pedidos na entrega</div>
										</OrderStatus>
										<OrderStatus>
											<img src={OrdersDelivered} alt='Pedidos entregues' />
											{loadingOrdersQty ? <Loading /> : <h4>{deliveredOrders}</h4>}
											<div>Pedidos entregues</div>
										</OrderStatus>
										<OrderStatus>
											<img src={OrdersCanceled} alt='Pedidos cancelados' />
											{loadingOrdersQty ? <Loading /> : <h4>{canceledOrders}</h4>}
											<div>Pedidos cancelados</div>
										</OrderStatus>
									</OrdersToday>
								</>
							)}
					</OrdersTodayContainer>
					<BestSellersContainer>
						<BlockTitle>Mais vendidos hoje</BlockTitle>
						<Paper>
							<Table>
								<TableBody>
									{bestSellers.map((row, index) => (
										<TableRow key={index}>
											<TableCell style={{ width: 80, paddingRight: 10 }}><ProductImage src={row.image} alt={row.name} /></TableCell>
											<TableCell>{row.name}</TableCell>
											<TableCell style={{ width: 70 }}><CircleNumber>{row.qty}</CircleNumber></TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Paper>
					</BestSellersContainer>
					<LastSalesContainer>
						<BlockTitle>Últimos pedidos</BlockTitle>
						<Paper>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell style={{ width: 80, paddingRight: 10 }}></TableCell>
										<TableCell>Usuário</TableCell>
										<TableCell>Local de entrega</TableCell>
										<TableCell>Nº de produtos</TableCell>
										<TableCell>Status</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{lastOrders.map((row, index) => (
										<TableRow key={index}>
											<TableCell>
												<OrderCreated>
													<OrderDate>{row.createdDate}</OrderDate>
													<OrderTime>{row.createdTime}</OrderTime>
												</OrderCreated>
											</TableCell>
											<TableCell>{row.user.full_name}</TableCell>
											<TableCell>{row.type === 'takeout' ? 'Retirada no local' : `${row.street}, ${row.number}`}</TableCell>
											<TableCell><CircleNumber>{row.products_qty}</CircleNumber></TableCell>
											<TableCell>{getStatusIcon(row.status)}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Paper>
					</LastSalesContainer>
				</DashContainer>
			</Content>
		</Fragment>
	)
}

export default Page;