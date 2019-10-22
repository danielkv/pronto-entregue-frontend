import React from 'react';
import {Paper, Table, TableBody, TableHead, TableRow, TableCell } from '@material-ui/core';

import {getStatusIcon, setPageTitle} from '../../utils';
import Layout from '../../layout';
import {Content, BlockTitle, CircleNumber, ProductImage, Loading} from '../../layout/components';
import {OrdersToday, OrderStatus, OrderCreated, OrderDate, OrderTime, DashContainer, OrdersTodayContainer, BestSellersContainer, LastSalesContainer} from './styles';

import OrdersAwaiting from '../../assets/images/orders-awaiting.png';
import OrdersPreparing from '../../assets/images/orders-preparing.png';
import OrdersDelivering from '../../assets/images/orders-delivering.png';
import OrdersDelivered from '../../assets/images/orders-delivered.png';
import OrdersCanceled from '../../assets/images/orders-canceled.png';
import { GET_BRANCH_ORDERS_QTY, GET_SELECTED_BRANCH, GET_BRANCH_BEST_SELLERS, GET_BRANCH_LAST_ORDERS } from '../../graphql/branches';
import { useQuery } from '@apollo/react-hooks';

function Page () {
	setPageTitle('Dashboard');

	/* const lastOrders = [
		{
			created_at: {date:'26/08', time:'19:03'},
			user:'João Antonio de Melo',
			address:'Padre João Reitz, 1057',
			products_qty : 4,
			status: 'waiting'
		},
		{
			created_at: {date:'26/08', time:'18:56'},
			user:'Marina Carla de Melo',
			address:'Padre João Reitz, 1057',
			products_qty : 4,
			status: 'waiting'
		},
		{
			created_at: {date:'26/08', time:'18:53'},
			user:'Tonia Simão Scheffer',
			address:'Padre João Reitz, 1057',
			products_qty : 4,
			status: 'preparing'
		},
		{
			created_at: {date:'26/08', time:'18:35'},
			user:'Joana Maria de Lucca',
			address:'Padre João Reitz, 1057',
			products_qty : 4,
			status: 'delivered'
		},
	]; */

	//get selected branch
	const {data:selectedBranchData} = useQuery(GET_SELECTED_BRANCH);

	//get branch best sellers
	const {data:bestSellersData, loading:loadingBestSellers} = useQuery(GET_BRANCH_BEST_SELLERS, {variables:{id:selectedBranchData.selectedBranch, limit:4, createdAt:'curdate'}});
	const bestSellers = !loadingBestSellers && bestSellersData ? bestSellersData.branch.best_sellers : [];
	
	//get branch last orders
	const {data:lastOrdersData, loading:loadingLastOrders} = useQuery(GET_BRANCH_LAST_ORDERS, {variables:{id:selectedBranchData.selectedBranch, limit:4}});
	const lastOrders = !loadingLastOrders && lastOrdersData ? lastOrdersData.branch.orders : [];
	
	//load order qtys
	const {data:ordersWaitingData, loading:loadingOrdersWaiting} = useQuery(GET_BRANCH_ORDERS_QTY, {variables:{id:selectedBranchData.selectedBranch, filter:{status:'waiting', createdAt:'CURDATE'}}});
	const {data:ordersPreparingData, loading:loadingOrdersPreparing} = useQuery(GET_BRANCH_ORDERS_QTY, {variables:{id:selectedBranchData.selectedBranch, filter:{status:'preparing', createdAt:'CURDATE'}}});
	const {data:ordersDeliveryData, loading:loadingOrdersDelivery} = useQuery(GET_BRANCH_ORDERS_QTY, {variables:{id:selectedBranchData.selectedBranch, filter:{status:'delivery', createdAt:'CURDATE'}}});
	const {data:ordersDeliveredData, loading:loadingOrdersDelivered} = useQuery(GET_BRANCH_ORDERS_QTY, {variables:{id:selectedBranchData.selectedBranch, filter:{status:'delivered', createdAt:'CURDATE'}}});
	const {data:ordersCanceledData, loading:loadingOrdersCanceled} = useQuery(GET_BRANCH_ORDERS_QTY, {variables:{id:selectedBranchData.selectedBranch, filter:{status:'canceled', createdAt:'CURDATE'}}});

	return (
		<Layout>
			<Content>
				<DashContainer>
					<OrdersTodayContainer>
						<BlockTitle>Pedidos de hoje</BlockTitle>
						<OrdersToday>
							<OrderStatus>
								<img src={OrdersAwaiting} alt='Pedidos aguardando' />
								{loadingOrdersWaiting ? <Loading /> : <h4>{ordersWaitingData.branch.orders_qty}</h4>}
								<div>Pedidos aguardando</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersPreparing} alt='Pedidos em preparo' />
								{loadingOrdersPreparing ? <Loading /> : <h4>{ordersPreparingData.branch.orders_qty}</h4>}
								<div>Pedidos em preparo</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersDelivering} alt='Pedidos na entrega' />
								{loadingOrdersDelivery ? <Loading /> : <h4>{ordersDeliveryData.branch.orders_qty}</h4>}
								<div>Pedidos na entrega</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersDelivered} alt='Pedidos entregues' />
								{loadingOrdersDelivered ? <Loading /> : <h4>{ordersDeliveredData.branch.orders_qty}</h4>}
								<div>Pedidos entregues</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersCanceled} alt='Pedidos cancelados' />
								{loadingOrdersCanceled ? <Loading /> : <h4>{ordersCanceledData.branch.orders_qty}</h4>}
								<div>Pedidos cancelados</div>
							</OrderStatus>
						</OrdersToday>
					</OrdersTodayContainer>
					<BestSellersContainer>
						<BlockTitle>Mais vendidos hoje</BlockTitle>
						<Paper>
							<Table>
								<TableBody>
									{bestSellers.map((row, index) => (
										<TableRow key={index}>
											<TableCell style={{width:80, paddingRight:10}}><ProductImage src={row.image} alt={row.name} /></TableCell>
											<TableCell>{row.name}</TableCell>
											<TableCell style={{width:70}}><CircleNumber>{row.qty}</CircleNumber></TableCell>
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
										<TableCell style={{width:80, paddingRight:10}}></TableCell>
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
		</Layout>
	)
}

export default Page;