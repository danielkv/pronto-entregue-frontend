import React, { useState, Fragment, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useQuery } from '@apollo/react-hooks';
import { Paper, FormControl, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, TablePagination, TextField, ButtonGroup, Button, FormLabel, FormGroup, Checkbox } from '@material-ui/core';
import { mdiPencil, mdiFilter, mdiDotsVertical } from '@mdi/js';
import Icon from '@mdi/react';
import numeral from 'numeral'

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, CircleNumber, SidebarContainer, Sidebar } from '../../layout/components';

import { ErrorBlock, LoadingBlock } from '../../layout/blocks';
import { setPageTitle, getStatusIcon } from '../../utils';
import { OrderCreated, OrderDate, OrderTime } from './styles';

import { GET_SELECTED_COMPANY } from '../../graphql/companies';
import { GET_COMPANY_ORDERS } from '../../graphql/orders';

const initialFilter = {
	search: '',
}

function Page (props) {
	setPageTitle('Pedidos');
	
	const searchRef = useRef(null);
	const [filter, setFilter] = useState(initialFilter);
	const [pagination, setPagination] = useState({
		page: 0,
		rowsPerPage: 10,
	});

	useEffect(()=>{
		setPagination((pagination) => ({ ...pagination, page: 0 }));
	}, [filter]);

	const submitFilterForm = (e) => {
		e.preventDefault();

		setFilter({
			...filter,
			search: searchRef.current.value
		})
	}
	const clearFilterForm = () => {
		setFilter(initialFilter);
	}

	const { data: { selectedCompany }, loading: loadingSelectedData } = useQuery(GET_SELECTED_COMPANY);
	const {
		data: { company: { countOrders = 0, orders = [] } = {} } = {},
		loading: loadingOrders, error, called
	} = useQuery(GET_COMPANY_ORDERS, {
		variables: {
			id: selectedCompany,
			filter,
			pagination,
		}
	})

	if (error) return <ErrorBlock error={error} />
	if ((!called && loadingOrders) || loadingSelectedData) return (<LoadingBlock />);

	return (
		<Fragment>
			<Content>
				{loadingOrders ? <LoadingBlock /> :
					<Block>
						<BlockHeader>
							<BlockTitle>Pedidos</BlockTitle>
							<Button size='small' variant="contained" color='secondary' to='/pedidos/novo' component={Link}>Adicionar</Button>
							<NumberOfRows>{countOrders} pedidos</NumberOfRows>
						</BlockHeader>
						<Paper>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell style={{ width: 30, paddingRight: 10 }}></TableCell>
										<TableCell>Cliente</TableCell>
										<TableCell>Endereço de entrega</TableCell>
										<TableCell>Valor</TableCell>
										<TableCell>Nº de produtos</TableCell>
										<TableCell>Status</TableCell>
										<TableCell>Ações</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{orders.map(row => (
										<TableRow key={row.id}>
											<TableCell style={{ width: 30, paddingLeft: 30 }}>
												<OrderCreated>
													<OrderDate>{row.createdDate}</OrderDate>
													<OrderTime>{row.createdTime}</OrderTime>
												</OrderCreated>
											</TableCell>
											<TableCell>{row.user.full_name}</TableCell>
											<TableCell>{row.type === 'delivery' ? `${row.street}, ${row.number}` : 'Retirada no local'}</TableCell>
											<TableCell>{numeral(row.price).format('$0,0.00')}</TableCell>
											<TableCell><CircleNumber>{row.products_qty}</CircleNumber></TableCell>
											<TableCell style={{ width: 30, textAlign: 'center' }}>{getStatusIcon(row.status)}</TableCell>
											<TableCell style={{ width: 100 }}>
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
								backIconButtonProps={{
									'aria-label': 'previous page',
								}}
								nextIconButtonProps={{
									'aria-label': 'next page',
								}}
								count={countOrders}
								rowsPerPage={pagination.rowsPerPage}
								page={pagination.page}
								onChangePage={(e, newPage)=>{setPagination({ ...pagination, page: newPage })}}
								onChangeRowsPerPage={(e)=>{setPagination({ ...pagination, page: 0, rowsPerPage: e.target.value });}}
							/>
						</Paper>
						<NumberOfRows>{countOrders} pedidos</NumberOfRows>
					</Block>}
			</Content>
			<SidebarContainer>
				<Block>
					<BlockHeader>
						<BlockTitle><Icon path={mdiFilter} size='18' color='#D41450' /> Filtros</BlockTitle>
					</BlockHeader>
					<Sidebar>
						<form noValidate onSubmit={submitFilterForm}>
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<TextField
											label='Buscar'
											inputRef={searchRef}
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
											<Button type='reset' onClick={clearFilterForm} color='primary'>Limpar</Button>
											<Button type='submit' variant="contained" color='primary'>Aplicar</Button>
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