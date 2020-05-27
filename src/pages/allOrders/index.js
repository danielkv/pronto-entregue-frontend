import React, { useState, Fragment, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, TablePagination, TextField, ButtonGroup, Button, Menu, MenuItem, CircularProgress, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { mdiPencil, mdiFilter, mdiDotsVertical, mdiEye } from '@mdi/js';
import Icon from '@mdi/react';
import moment from 'moment';
import numeral from 'numeral'

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, SidebarContainer, Sidebar } from '../../layout/components';

import { useLoggedUserRole } from '../../controller/hooks';
import { getOrderStatusIcon, availableStatus } from '../../controller/orderStatus';
import { ErrorBlock, LoadingBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';

import { UPDATE_ORDER, GET_ORDERS } from '../../graphql/orders';

const initialFilter = {
	search: '',
}

export default function AllOrders ({ match: { url } }) {
	setPageTitle('Todos pedidos');
	
	const loggedUserRole = useLoggedUserRole();

	const [anchorEl, setAnchorEl] = useState(null)
	const [menuOrder, setMenuOrder] = useState([]);
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

	const {
		data: { countOrders = 0, orders = [] } = {},
		loading: loadingOrders, error, called
	} = useQuery(GET_ORDERS, {
		variables: {
			filter,
			pagination,
		}
	});
	const [updateOrder, { loading: loadingUpdateOrder, error: updateOrderError }] = useMutation(UPDATE_ORDER)

	function handleCloseMenu() {
		setAnchorEl(null);
		setMenuOrder([]);
	}
	function handleOpenMenu(e) {
		setAnchorEl(e.currentTarget);
		const orderId = e.currentTarget.getAttribute('data-order-id')
		setMenuOrder(orders.find(row => row.id === orderId));
	}
	const handleUpdateStatus = (newStatus) => () => {
		updateOrder({ variables: { id: menuOrder.id, data: { status: newStatus.slug } } });
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
				{availableStatus(menuOrder).map(status => {
					return (
						<MenuItem key={status.slug} onClick={handleUpdateStatus(status)} selected={menuOrder.status===status.slug} dense>
							<ListItemIcon>{status.Icon}</ListItemIcon>
							<ListItemText>{status.label}</ListItemText>
						</MenuItem>
					)
				})}
			</Menu>
			<Content>
				{loadingOrders ? <LoadingBlock /> :
					<Block>
						<BlockHeader>
							<BlockTitle>Todos pedidos</BlockTitle>
							{loadingUpdateOrder && <CircularProgress />}
							<NumberOfRows>{countOrders} pedidos</NumberOfRows>
						</BlockHeader>
						<Paper>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell style={{ width: 100 }}></TableCell>
										<TableCell><Typography variant='caption'>Nº</Typography></TableCell>
										<TableCell><Typography variant='caption'>Cliente</Typography></TableCell>
										<TableCell><Typography variant='caption'>Estabelecimento</Typography></TableCell>
										<TableCell><Typography variant='caption'>Valor</Typography></TableCell>
										<TableCell><Typography variant='caption'>Status</Typography></TableCell>
										<TableCell><Typography variant='caption'>Ações</Typography></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{orders.map(row => {
										const createdAt = moment(row.createdAt);
										const displayDate = moment().diff(createdAt, 'day') >= 1 ? createdAt.format('DD/MM/YY HH:mm') : createdAt.fromNow();
										const canChangeStatus = loggedUserRole === 'master' || !['delivered', 'canceled'].includes(row.status);

										return (
											<TableRow key={row.id}>
												<TableCell><Typography variant='body2'>{displayDate}</Typography></TableCell>
												<TableCell><Typography variant='caption'>{`#${row.id}`}</Typography></TableCell>
												<TableCell><Typography variant='body2'>{row.user.fullName}</Typography></TableCell>
												<TableCell><Typography variant='body2'>{row.company.displayName}</Typography></TableCell>
												<TableCell><Typography variant='body2'>{numeral(row.price).format('$0,0.00')}</Typography></TableCell>
												<TableCell style={{ width: 30, textAlign: 'center' }}>{getOrderStatusIcon(row)}</TableCell>
												<TableCell style={{ width: 100 }}>
													<IconButton disabled={loadingUpdateOrder} component={Link} to={`pedidos/alterar/${row.id}`}>
														<Icon path={canChangeStatus ? mdiPencil : mdiEye} size={1} color='#363E5E' />
													</IconButton>
													{canChangeStatus && <IconButton disabled={loadingUpdateOrder} onClick={handleOpenMenu} data-order-id={row.id}>
														<Icon path={mdiDotsVertical} size={1} color='#363E5E' />
													</IconButton>}
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
						<BlockTitle><Icon path={mdiFilter} size={1} color='#D41450' /> Filtros</BlockTitle>
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