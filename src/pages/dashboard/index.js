import React, { Fragment } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableRow, TableCell, Avatar, Chip, Typography } from '@material-ui/core';

import { Content } from '../../layout/components';


import { useSelectedCompany } from '../../controller/hooks';
import { setPageTitle } from '../../utils';
import OrdersNumber from './OrdersNumber';
import { DashContainer, BestSellersContainer } from './styles';

import { GET_COMPANY_BEST_SELLERS } from '../../graphql/products';

function Page () {
	setPageTitle('Dashboard');

	const filter = { createdAt: 'curdate' };
	const pagination = { page: 0, rowsPerPage: 4 };

	//get selected company
	const selectedCompany = useSelectedCompany();

	//get company best sellers
	const { data: { company: { bestSellers = [] } = {} } = {} } = useQuery(GET_COMPANY_BEST_SELLERS, { variables: { id: selectedCompany, pagination, filter } });

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
				</DashContainer>
			</Content>
		</Fragment>
	)
}

export default Page;