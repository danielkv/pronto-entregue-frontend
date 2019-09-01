import React, {useState} from 'react';
import {Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button } from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiStore, mdiPencil, mdiFilter} from '@mdi/js';
import {Link} from 'react-router-dom';

import numeral from 'numeral';
import Layout from '../../layout';
import {Content, BlockHeader, BlockTitle, NumberOfRows, CircleNumber, SidebarContainer, Sidebar, SidebarBlock} from '../../layout/components';

function Page () {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

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
				<BlockHeader>
					<BlockTitle>Empresas <Button size='small' variant="contained" color='secondary' to='/empresas/novo' component={Link}>Adicionar</Button></BlockTitle>
					<NumberOfRows>{companies.length} empresas</NumberOfRows>
				</BlockHeader>
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
							{companies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
								<TableRow key={row.name}>
									<TableCell style={{width:30, paddingLeft:40, paddingRight:10}}><Icon path={mdiStore} size='20' color='#BCBCBC' /></TableCell>
									<TableCell>{row.name}</TableCell>
									<TableCell>{numeral(row.revenue).format('$0,0.00')}</TableCell>
									<TableCell><CircleNumber>{row.branches_qty}</CircleNumber></TableCell>
									<TableCell><CircleNumber>{row.orders_qty}</CircleNumber></TableCell>
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
					<TablePagination
						component="div"
						count={companies.length}
						rowsPerPage={rowsPerPage}
						page={page}
						backIconButtonProps={{
							'aria-label': 'previous page',
						}}
						nextIconButtonProps={{
							'aria-label': 'next page',
						}}
						onChangePage={(e, newPage)=>{setPage(newPage)}}
						onChangeRowsPerPage={(e)=>{setRowsPerPage(e.target.value); setPage(0);}}
						/>
				</Paper>
				<NumberOfRows>{companies.length} empresas</NumberOfRows>
			</Content>
			<SidebarContainer>
				<BlockHeader>
					<BlockTitle><Icon path={mdiFilter} size='18' color='#D41450' /> Filtros</BlockTitle>
					<FormControlLabel
						control={
							<Switch size='small' color='primary' checked={false} onChange={()=>{}} value="includeDisabled" />
						}
						
						label="Incluir inativos"
					/>
				</BlockHeader>
				<Sidebar>
					<form noValidate>
						<SidebarBlock>
							<TextField
								label='Buscar'
								onChange={(event)=>{}}
								/>
						</SidebarBlock>
						<SidebarBlock>
							<ButtonGroup fullWidth>
								<Button color='primary'>Limpar</Button>
								<Button variant="contained" color='primary'>Aplicar</Button>
							</ButtonGroup>
						</SidebarBlock>
					</form>
				</Sidebar>
			</SidebarContainer>
		</Layout>
	)
}

export default Page;