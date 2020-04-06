import React, { Fragment } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableRow, TableCell, Avatar, Chip, Typography } from '@material-ui/core';
import moment from 'moment';

import { Content } from '../../layout/components';


import { useSelectedCompany } from '../../controller/hooks';
import { setPageTitle } from '../../utils';
import { getOrderStatusIcon } from '../../utils/orders';
import OrdersNumber from './OrdersNumber';
import { DashContainer, BestSellersContainer, LastSalesContainer } from './styles';

import { GET_COMPANY_LAST_ORDERS } from '../../graphql/orders';
import { GET_COMPANY_BEST_SELLERS } from '../../graphql/products';

function Page () {
	setPageTitle('Dashboard');

	const filter = { createdAt: 'curdate' };
	const pagination = { page: 0, rowsPerPage: 4 };

	//get selected company
	const selectedCompany = useSelectedCompany();

	//get company best sellers
	const { data: { company: { bestSellers = [] } = {} } = {} } = useQuery(GET_COMPANY_BEST_SELLERS, { variables: { id: selectedCompany, pagination, filter } });
	
	//get company last orders
	const { data: { company: { orders: lastOrders = [] } = {} } = {} } = useQuery(GET_COMPANY_LAST_ORDERS, { variables: { id: selectedCompany, pagination },  });
	
	//load order qtys
	

	return (
		<Fragment>
			<Content>
				<DashContainer>
					<OrdersNumber />
					<BestSellersContainer>
						<Typography variant='h6'>Mais vendidos hoje</Typography>
						<Paper>
							{bestSellers.length
								? (
									<Table>
										<TableBody>
											{bestSellers.map((row, index) => (
												<TableRow key={index}>
													<TableCell style={{ width: 80, paddingRight: 10 }}><Avatar src={row.image} alt={row.name} /></TableCell>
													<TableCell>{row.name}</TableCell>
													<TableCell style={{ width: 70 }}><Chip variant='outlined' label={row.qty} /></TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								)
								: (
									<div style={{ padding: 35 }}>
										<Typography variant='caption'>Ainda não há nenhum pedido hoje</Typography>
									</div>
								)}
						</Paper>
					</BestSellersContainer>
					<LastSalesContainer>
						<Typography variant='h6'>Últimos pedidos</Typography>
						<Paper>
							{lastOrders.length
								? (
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
											{lastOrders.map((row, index) => {
												const createdAt = moment(row.createdAt);
												const displayDate = moment().diff(createdAt, 'day') >= 1 ? createdAt.format('DD/MM/YY HH:mm') : createdAt.fromNow();
												return (
													<TableRow key={index}>
														<TableCell>{displayDate}</TableCell>
														<TableCell>{row.user.fullName}</TableCell>
														<TableCell>{row.type === 'takeout' ? 'Retirada no local' : `${row.address.street}, ${row.address.number}`}</TableCell>
														<TableCell><Chip variant='outlined' label={row.countProducts} /></TableCell>
														<TableCell>{getOrderStatusIcon(row.status)}</TableCell>
													</TableRow>
												)
											})}
										</TableBody>
									</Table>
								)
								: (
									<div style={{ padding: 35 }}>
										<Typography variant='caption'>Não há nenhum pedido</Typography>
									</div>
								)}
						</Paper>
					</LastSalesContainer>
				</DashContainer>
			</Content>
		</Fragment>
	)
}

export default Page;