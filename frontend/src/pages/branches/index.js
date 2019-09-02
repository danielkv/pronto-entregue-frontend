import React, {useState} from 'react';
import {Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button } from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiStore, mdiPencil, mdiFilter} from '@mdi/js';
import {Link} from 'react-router-dom';
import numeral from 'numeral'

import {setPageTitle} from '../../utils';
import Layout from '../../layout';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, CircleNumber, SidebarContainer, Sidebar} from '../../layout/components';

function Page () {
	setPageTitle('Filiais');

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const branches = [
		{
			name: 'Copeiro 1',
			revenue:10684,
			orders_qty:15,
			created_at:'25/08/19 15:35',
			active: true,
		},
		{
			name: 'Copeiro 2',
			revenue:9465,
			orders_qty:15,
			created_at:'25/08/19 15:35',
			active: false,
		},
		{
			name: 'Copeiro 3',
			revenue:10684,
			orders_qty:15,
			created_at:'25/08/19 15:35',
			active: true,
		},
	];

	return (
		<Layout>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Filiais <Button size='small' variant="contained" color='secondary' to='/filiais/novo' component={Link}>Adicionar</Button></BlockTitle>
						<NumberOfRows>{branches.length} filiais</NumberOfRows>
					</BlockHeader>
					<Paper>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell style={{width:30, paddingRight:10}}></TableCell>
									<TableCell>Empresa</TableCell>
									<TableCell>Faturamento último mês</TableCell>
									<TableCell>Número de pedidos</TableCell>
									<TableCell>Criada em</TableCell>
									<TableCell>Ações</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{branches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
									<TableRow key={row.name}>
										<TableCell style={{width:30, paddingLeft:40, paddingRight:10}}><Icon path={mdiStore} size='20' color='#BCBCBC' /></TableCell>
										<TableCell>{row.name}</TableCell>
										<TableCell>{numeral(row.revenue).format('$0,0.00')}</TableCell>
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
							count={branches.length}
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
					<NumberOfRows>{branches.length} filiais</NumberOfRows>
				</Block>
			</Content>
			<SidebarContainer>
				<Block>
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
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<TextField
											label='Buscar'
											onChange={(event)=>{}}
											/>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<ButtonGroup fullWidth>
											<Button color='primary'>Limpar</Button>
											<Button variant="contained" color='primary'>Aplicar</Button>
										</ButtonGroup>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
						</form>
					</Sidebar>
				</Block>
			</SidebarContainer>
		</Layout>
	)
}

export default Page;