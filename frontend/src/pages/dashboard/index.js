import React from 'react';
import {Paper, Table, TableBody, TableHead, TableRow, TableCell } from '@material-ui/core';

import {getStatusIcon, setPageTitle} from '../../utils';
import Layout from '../../layout';
import {Content, BlockTitle, CircleNumber, ProductImage} from '../../layout/components';
import {OrdersToday, OrderStatus, OrderCreated, OrderDate, OrderTime, DashContainer, OrdersTodayContainer, TopSalesContainer, LastSalesContainer} from './styles';

import OrdersAwaiting from '../../assets/images/orders-awaiting.png';
import OrdersPreparing from '../../assets/images/orders-preparing.png';
import OrdersDelivering from '../../assets/images/orders-delivering.png';
import OrdersDelivered from '../../assets/images/orders-delivered.png';
import OrdersCanceled from '../../assets/images/orders-canceled.png';

function Page () {
	setPageTitle('Dashboard');
	const topSales = [
		{
			image:'https://media-manager.noticiasaominuto.com/1920/1509039392/naom_59bfa667ce128.jpg',
			name:'Hambúrguer de Siri',
			qty : 4,
		},
		{
			image:'https://www.tropicalishotel.com.br/wp-content/uploads/bodegadosertao_59365197_598901567288489_8009772026720440913_n-950x600.jpg',
			name:'Hambúrguer de Costela',
			qty : 4,
		},
		{
			image:'https://img.elo7.com.br/product/main/258B7CB/adesivo-parede-restaurante-prato-feito-comida-caseira-lenha-adesivo-restaurante-fritas-salada.jpg',
			name:'Top Pão com arroz',
			qty : 3,
		},
		{
			image:'https://www.turismoouropreto.com/wp-content/uploads/culin%C3%A1ria-mineira.jpg',
			name:'Panelada Mineira',
			qty : 2,
		},
	];
	const lastOrders = [
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
	];

	return (
		<Layout>
			<Content>
				<DashContainer>
					<OrdersTodayContainer>
						<BlockTitle>Pedidos de hoje</BlockTitle>
						<OrdersToday>
							<OrderStatus>
								<img src={OrdersAwaiting} alt='Pedidos aguardando' />
								<h4>8</h4>
								<div>Pedidos aguardando</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersPreparing} alt='Pedidos em preparo' />
								<h4>8</h4>
								<div>Pedidos em preparo</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersDelivering} alt='Pedidos na entrega' />
								<h4>8</h4>
								<div>Pedidos na entrega</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersDelivered} alt='Pedidos entregues' />
								<h4>8</h4>
								<div>Pedidos entregues</div>
							</OrderStatus>
							<OrderStatus>
								<img src={OrdersCanceled} alt='Pedidos cancelados' />
								<h4>8</h4>
								<div>Pedidos cancelados</div>
							</OrderStatus>
						</OrdersToday>
					</OrdersTodayContainer>
					<TopSalesContainer>
						<BlockTitle>Mais vendidos hoje</BlockTitle>
						<Paper>
							<Table>
								<TableBody>
									{topSales.map(row => (
										<TableRow>
											<TableCell style={{width:80, paddingRight:10}}><ProductImage src={row.image} alt={row.name} /></TableCell>
											<TableCell>{row.name}</TableCell>
											<TableCell style={{width:70}}><CircleNumber>{row.qty}</CircleNumber></TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Paper>
					</TopSalesContainer>
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
									{lastOrders.map(row => (
										<TableRow>
											<TableCell><OrderCreated><OrderDate></OrderDate>{row.created_at.date}<OrderTime>{row.created_at.time}</OrderTime></OrderCreated></TableCell>
											<TableCell>{row.user}</TableCell>
											<TableCell>{row.address}</TableCell>
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