import React from 'react';
import {Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, Switch } from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiStore, mdiPencil} from '@mdi/js';

import numeral from 'numeral';
import Layout from '../../layout';
import {Content, BlockTitle, NumberOfRows} from '../../layout/components';
//import {} from './styles';

function Page () {
	const companies = [
		{
			name: 'Copeiro',
			revenue:10684,
			branches_qty:3,
			orders_qty:15,
			created_at:'25/08/19 15:35',
			active: true,
		},
		{
			name: 'Temperoma',
			revenue:9465,
			branches_qty:3,
			orders_qty:15,
			created_at:'25/08/19 15:35',
			active: false,
		},
		{
			name: 'Casa da Árvore',
			revenue:10684,
			branches_qty:3,
			orders_qty:15,
			created_at:'25/08/19 15:35',
			active: true,
		},
		{
			name: 'Pizzaria Bom Gosto',
			revenue:32646,
			branches_qty:2,
			orders_qty:15,
			created_at:'25/08/19 15:35',
			active: true,
		},
	];

	return (
		<Layout>
			<Content>
				<BlockTitle>Empresas</BlockTitle>
				<NumberOfRows></NumberOfRows>
				<Paper>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell style={{width:30, paddingRight:10}}></TableCell>
								<TableCell>Empresa</TableCell>
								<TableCell>Faturamento último mês</TableCell>
								<TableCell>Número de filiais</TableCell>
								<TableCell>Número de pedidos</TableCell>
								<TableCell>Criada em</TableCell>
								<TableCell>Ações</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{companies.map(row => (
								<TableRow key={row.name}>
									<TableCell style={{width:30, paddingLeft:40, paddingRight:10}}><Icon path={mdiStore} size='20' color='#BCBCBC' /></TableCell>
									<TableCell>{row.name}</TableCell>
									<TableCell>{numeral(row.revenue).format('$0,0.00')}</TableCell>
									<TableCell>{row.branches_qty}</TableCell>
									<TableCell>{row.orders_qty}</TableCell>
									<TableCell>{row.created_at}</TableCell>
									<TableCell>
										<IconButton>
											<Icon path={mdiPencil} size='18' color='#363E5E' />
										</IconButton>
										<Switch
											checked={row.active}
											onChange={()=>{}}
											value="checkedB"
											size='small'
											color="secondary"
											inputProps={{ 'aria-label': 'primary checkbox' }}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Paper>
			</Content>
		</Layout>
	)
}

export default Page;