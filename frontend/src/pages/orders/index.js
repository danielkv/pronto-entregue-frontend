import React, {useState} from 'react';
import {Paper, FormControl, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button, FormLabel, FormGroup, Checkbox } from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiPencil, mdiFilter, mdiDotsVertical} from '@mdi/js';
import {Link} from 'react-router-dom';
import numeral from 'numeral'

import {setPageTitle, getStatusIcon} from '../../utils';
import Layout from '../../layout';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, CircleNumber, SidebarContainer, Sidebar} from '../../layout/components';
import {OrderCreated, OrderDate, OrderTime} from './styles';

function Page () {
	setPageTitle('Pedidos');

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const orders = [
		{
			created_at:{date:'25/08', time:'15:35'},
			user: 'Ivandro Cardoso',
			address: 'Rua João Quartieiro, 43',
			price:72.32,
			products_qty:15,
			status: 'waiting',
		},
		{
			created_at:{date:'25/08', time:'15:35'},
			user: 'Maria José Almeida',
			address: 'Rua João Quartieiro, 43',
			price:72.32,
			products_qty:15,
			status: 'preparing',
		},
		{
			created_at:{date:'25/08', time:'15:35'},
			user: 'Carlos antonio',
			address: 'Rua João Quartieiro, 43',
			price:72.32,
			products_qty:15,
			status: 'delivered',
		},
		{
			created_at:{date:'25/08', time:'15:35'},
			user: 'Ivandro Cardoso',
			address: 'Rua João Quartieiro, 43',
			price:72.32,
			products_qty:15,
			status: 'waiting',
		},
		{
			created_at:{date:'25/08', time:'15:35'},
			user: 'Maria José Almeida',
			address: 'Rua João Quartieiro, 43',
			price:72.32,
			products_qty:15,
			status: 'preparing',
		},
		{
			created_at:{date:'25/08', time:'15:35'},
			user: 'Carlos antonio',
			address: 'Rua João Quartieiro, 43',
			price:72.32,
			products_qty:15,
			status: 'delivered',
		},
		{
			created_at:{date:'25/08', time:'15:35'},
			user: 'Ivandro Cardoso',
			address: 'Rua João Quartieiro, 43',
			price:72.32,
			products_qty:15,
			status: 'waiting',
		},
		{
			created_at:{date:'25/08', time:'15:35'},
			user: 'Maria José Almeida',
			address: 'Rua João Quartieiro, 43',
			price:72.32,
			products_qty:15,
			status: 'preparing',
		},
		{
			created_at:{date:'25/08', time:'15:35'},
			user: 'Carlos antonio',
			address: 'Rua João Quartieiro, 43',
			price:72.32,
			products_qty:15,
			status: 'delivered',
		},
	];

	return (
		<Layout>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Pedidos <Button size='small' variant="contained" color='secondary' to='/pedidos/novo' component={Link}>Adicionar</Button></BlockTitle>
						<NumberOfRows>{orders.length} pedidos</NumberOfRows>
					</BlockHeader>
					<Paper>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell style={{width:30, paddingRight:10}}></TableCell>
									<TableCell>Cliente</TableCell>
									<TableCell>Endereço de entrega</TableCell>
									<TableCell>Valor</TableCell>
									<TableCell>Nº de produtos</TableCell>
									<TableCell>Status</TableCell>
									<TableCell>Ações</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
									<TableRow key={row.user}>
										<TableCell style={{width:30, paddingLeft:30}}>
											<OrderCreated>
												<OrderDate>{row.created_at.date}</OrderDate>
												<OrderTime>{row.created_at.time}</OrderTime>
											</OrderCreated>
										</TableCell>
										<TableCell>{row.user}</TableCell>
										<TableCell>{row.address}</TableCell>
										<TableCell>{numeral(row.price).format('$0,0.00')}</TableCell>
										<TableCell><CircleNumber>{row.products_qty}</CircleNumber></TableCell>
										<TableCell style={{width:30, textAlign:'center'}}>{getStatusIcon(row.status)}</TableCell>
										<TableCell style={{width:100}}>
											<IconButton>
												<Icon path={mdiPencil} size='18' color='#363E5E' />
											</IconButton>
											<IconButton>
												<Icon path={mdiDotsVertical} size='18' color='#363E5E' />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<TablePagination
							component="div"
							count={orders.length}
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
					<NumberOfRows>{orders.length} pedidos</NumberOfRows>
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
										<FormControl component="fieldset">
											<FormLabel component="legend">Status</FormLabel>
											<FormGroup>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="waiting" />}
													label="Aguardando"
												/>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="preparing" />}
													label="Preparando"
												/>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="delivering" />}
													label="Na entrega"
												/>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="delivered" />}
													label="Entregue"
												/>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="canceled" />}
													label="Cancelado"
												/>
											</FormGroup>
										</FormControl>
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