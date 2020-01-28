import React, { useState, Fragment, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, FormControl, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, TablePagination, TextField, ButtonGroup, Button, FormLabel, FormGroup, Checkbox, Menu, MenuItem, CircularProgress, ListItemIcon, ListItemText, Chip } from '@material-ui/core';
import { mdiPencil, mdiFilter, mdiDotsVertical } from '@mdi/js';
import Icon from '@mdi/react';
import moment from 'moment';
import numeral from 'numeral'

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, SidebarContainer, Sidebar } from '../../layout/components';

import { useSelectedCompany } from '../../controller/hooks';
import { ErrorBlock, LoadingBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { getOrderStatusIcon } from '../../utils/orders';

import { GET_COMPANY_ORDERS, UPDATE_ORDER } from '../../graphql/orders';

const initialFilter = {
	search: '',
}

function Page (props) {
	setPageTitle('Pedidos');
	
	const [anchorEl, setAnchorEl] = useState(null)
	const [menuOrderStatus, setMenuOrderStatus] = useState('');

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

	const selectedCompany = useSelectedCompany();
	const {
		data: { company: { countOrders = 0, orders = [] } = {} } = {},
		loading: loadingOrders, error, called
	} = useQuery(GET_COMPANY_ORDERS, {
		variables: {
			id: selectedCompany,
			filter,
			pagination,
		}
	});
	const [updateOrder, { loading: loadingUpdateOrder, error: updateOrderError }] = useMutation(UPDATE_ORDER)

	function handleCloseMenu() {
		setAnchorEl(null);
		setMenuOrderStatus('');
	}
	function handleOpenMenu(e) {
		setAnchorEl(e.currentTarget);
		setMenuOrderStatus(e.currentTarget.getAttribute('data-order-status'));
	}
	const handleUpdateStatus = (newStatus) => () => {
		updateOrder({ variables: { id: anchorEl.getAttribute('data-order-id'), data: { status: newStatus } } });
		handleCloseMenu();
	}

	if (error || updateOrderError) return <ErrorBlock error={getErrors(error || updateOrderError)} />
	if (!called && loadingOrders) return (<LoadingBlock />);

	return (
		<Fragment>
			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleCloseMenu}
			>
				<MenuItem onClick={handleUpdateStatus('waiting')} selected={menuOrderStatus==='waiting'} dense>
					<ListItemIcon>{getOrderStatusIcon('waiting')}</ListItemIcon>
					<ListItemText>Aguardando</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleUpdateStatus('preparing')} selected={menuOrderStatus==='preparing'} dense>
					<ListItemIcon>{getOrderStatusIcon('preparing')}</ListItemIcon>
					<ListItemText>Em preparo</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleUpdateStatus('delivering')} selected={menuOrderStatus==='delivering'} dense>
					<ListItemIcon>{getOrderStatusIcon('delivering')}</ListItemIcon>
					<ListItemText>Na entrega</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleUpdateStatus('delivered')} selected={menuOrderStatus==='delivered'} dense>
					<ListItemIcon>{getOrderStatusIcon('delivered')}</ListItemIcon>
					<ListItemText>Entregue</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleUpdateStatus('canceled')} selected={menuOrderStatus==='canceled'} dense>
					<ListItemIcon>{getOrderStatusIcon('canceled')}</ListItemIcon>
					<ListItemText>Cancelado</ListItemText>
				</MenuItem>
			</Menu>
			<Content>
				{loadingOrders ? <LoadingBlock /> :
					<Block>
						<BlockHeader>
							<BlockTitle>Pedidos</BlockTitle>
							<Button
								size='small'
								variant="contained"
								color='secondary'
								to='/pedidos/novo'
								component={Link}
								disabled={loadingUpdateOrder}
							>
								Adicionar
							</Button>
							{loadingUpdateOrder && <CircularProgress />}
							<NumberOfRows>{countOrders} pedidos</NumberOfRows>
						</BlockHeader>
						<Paper>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell style={{ width: 120, paddingRight: 10 }}></TableCell>
										<TableCell>Cliente</TableCell>
										<TableCell>Endereço de entrega</TableCell>
										<TableCell>Valor</TableCell>
										<TableCell>Nº de produtos</TableCell>
										<TableCell>Status</TableCell>
										<TableCell>Ações</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{orders.map(row => {
										const createdAt = moment(row.createdAt);
										const displayDate = moment().diff(createdAt, 'day') >= 1 ? createdAt.format('DD/MM/YY HH:mm') : createdAt.fromNow();
										return (
											<TableRow key={row.id}>
												<TableCell>{displayDate}</TableCell>
												<TableCell>{row.user.fullName}</TableCell>
												<TableCell>{row.type === 'delivery' ? `${row.street}, ${row.number}` : 'Retirada no local'}</TableCell>
												<TableCell>{numeral(row.price).format('$0,0.00')}</TableCell>
												<TableCell><Chip variant='outlined' label={row.countProducts} /></TableCell>
												<TableCell style={{ width: 30, textAlign: 'center' }}>{getOrderStatusIcon(row.status)}</TableCell>
												<TableCell style={{ width: 100 }}>
													<IconButton disabled={loadingUpdateOrder} onClick={()=>{props.history.push(`/pedidos/alterar/${row.id}`);}}>
														<Icon path={mdiPencil} size='18' color='#363E5E' />
													</IconButton>
													<IconButton disabled={loadingUpdateOrder} onClick={handleOpenMenu} data-order-id={row.id} data-order-status={row.status}>
														<Icon path={mdiDotsVertical} size='18' color='#363E5E' />
													</IconButton>
												</TableCell>
											</TableRow>
										)})}
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