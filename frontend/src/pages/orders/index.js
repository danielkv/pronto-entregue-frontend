import React, {useState, Fragment} from 'react';
import {Paper, FormControl, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button, FormLabel, FormGroup, Checkbox } from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiPencil, mdiFilter, mdiDotsVertical} from '@mdi/js';
import {Link} from 'react-router-dom';
import numeral from 'numeral'

import {setPageTitle, getStatusIcon} from '../../utils';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, CircleNumber, SidebarContainer, Sidebar} from '../../layout/components';
import {OrderCreated, OrderDate, OrderTime} from './styles';
import { useQuery } from '@apollo/react-hooks';
import { GET_SELECTED_BRANCH } from '../../graphql/branches';
import { GET_BANCH_ORDERS } from '../../graphql/orders';
import { ErrorBlock, LoadingBlock } from '../../layout/blocks';

function Page (props) {
	setPageTitle('Pedidos');

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const {data:selectedBranchData, loading:loadingSelectedData} = useQuery(GET_SELECTED_BRANCH);
	const {data:ordersData, loading:loadingOrdersData, error} = useQuery(GET_BANCH_ORDERS, {variables:{id:selectedBranchData.selectedBranch}})
	const orders = ordersData && !loadingOrdersData && !loadingSelectedData ? ordersData.branch.orders : [];

	if (error) return <ErrorBlock error={error} />
	if (loadingOrdersData || loadingSelectedData) return (<LoadingBlock />);

	return (
		<Fragment>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Pedidos</BlockTitle>
						<Button size='small' variant="contained" color='secondary' to='/pedidos/novo' component={Link}>Adicionar</Button>
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
									<TableRow key={row.id}>
										<TableCell style={{width:30, paddingLeft:30}}>
											<OrderCreated>
												<OrderDate>{row.createdDate}</OrderDate>
												<OrderTime>{row.createdTime}</OrderTime>
											</OrderCreated>
										</TableCell>
										<TableCell>{row.user.full_name}</TableCell>
										<TableCell>{row.type === 'delivery' ? `${row.street}, ${row.number}` : 'Retirada no local'}</TableCell>
										<TableCell>{numeral(row.price).format('$0,0.00')}</TableCell>
										<TableCell><CircleNumber>{row.products_qty}</CircleNumber></TableCell>
										<TableCell style={{width:30, textAlign:'center'}}>{getStatusIcon(row.status)}</TableCell>
										<TableCell style={{width:100}}>
											<IconButton onClick={()=>{props.history.push(`/pedidos/alterar/${row.id}`);}}>
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
		</Fragment>
	)
}

export default Page;