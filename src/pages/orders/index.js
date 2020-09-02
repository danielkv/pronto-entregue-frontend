import React, { useState, Fragment, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, TablePagination, TextField, ButtonGroup, Button, CircularProgress, Chip, Typography } from '@material-ui/core';
import { mdiPencil, mdiFilter, mdiDotsVertical, mdiEye, mdiCalendar } from '@mdi/js';
import Icon from '@mdi/react';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import numeral from 'numeral'

import OrderStatusMenu from '../../components/OrderStatusMenu';
import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, SidebarContainer, Sidebar } from '../../layout/components';

import { useSelectedCompany, useLoggedUserRole } from '../../controller/hooks';
import OrderController from '../../controller/order';
import { ErrorBlock, LoadingBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { getDeliveryTypeText } from '../../utils/orders';

import { GET_COMPANY_ORDERS, CHANGE_ORDER_STATUS } from '../../graphql/orders';

const initialFilter = {
	search: '',
}

function Page ({ match: { url } }) {
	setPageTitle('Pedidos');
	
	const loggedUserRole = useLoggedUserRole();

	const [anchorEl, setAnchorEl] = useState(null)
	const [menuOrder, setMenuOrder] = useState([]);
	const searchRef = useRef(null);
	const [filter, setFilter] = useState(initialFilter);
	const { enqueueSnackbar } = useSnackbar();
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
		data: { countOrders = 0, orders = [] } = {},
		loading: loadingOrders, error, called
	} = useQuery(GET_COMPANY_ORDERS, {
		variables: {
			//id: selectedCompany,
			filter: { ...filter, companyId: selectedCompany },
			pagination,
		}
	});
	const [loadingUpdateOrder, setLoadingUpdateOrder] = useState(null);
	const [changeOrderStatus] = useMutation(CHANGE_ORDER_STATUS)

	function handleCloseMenu() {
		setAnchorEl(null);
		setMenuOrder([]);
	}
	function handleOpenMenu(e) {
		setAnchorEl(e.currentTarget);
		const orderId = e.currentTarget.getAttribute('data-order-id')
		setMenuOrder(orders.find(row => row.id === orderId));
	}
	const handleUpdateStatus = (newStatus) => {
		setLoadingUpdateOrder(menuOrder.id)
		changeOrderStatus({ variables: { id: menuOrder.id, newStatus: newStatus.slug } })
			.then(()=>enqueueSnackbar(`Status do pedido #${menuOrder.id} foi alterado para ${newStatus.label}`, { variant: 'success' }))
			.catch((err)=>enqueueSnackbar(getErrors(err), { variant: 'error' }))
			.finally(()=>setLoadingUpdateOrder(null))
		handleCloseMenu();
	}

	if (error) return <ErrorBlock error={getErrors(error)} />
	if (!called && loadingOrders) return (<LoadingBlock />);

	return (
		<Fragment>
			<OrderStatusMenu
				open={Boolean(anchorEl)}
				onClose={handleCloseMenu}
				availableStatus={OrderController.availableStatus(menuOrder, loggedUserRole)}
				anchorEl={anchorEl}
				onClick={handleUpdateStatus}
				selected={menuOrder.status}
			/>
			<Content>
				{loadingOrders ? <LoadingBlock /> :
					<Block>
						<BlockHeader>
							<BlockTitle>Pedidos</BlockTitle>
							<Button
								size='small'
								variant="contained"
								color='primary'
								to={`${url}/novo`}
								component={Link}
								disabled={loadingUpdateOrder}
							>
								Adicionar
							</Button>
							<NumberOfRows>{countOrders} pedidos</NumberOfRows>
						</BlockHeader>
						<Paper>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell style={{ width: 100 }}></TableCell>
										<TableCell><Typography variant='caption'>Nº</Typography></TableCell>
										<TableCell><Typography variant='caption'>Cliente</Typography></TableCell>
										<TableCell><Typography variant='caption'>Entrega</Typography></TableCell>
										<TableCell><Typography variant='caption'>Valor</Typography></TableCell>
										<TableCell><Typography variant='caption'>Produtos</Typography></TableCell>
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
												<TableCell>
													<div style={{ display: 'flex', alignItems: 'center' }}>
														<Typography variant='body2'>{displayDate}</Typography>
														{row.scheduledTo
															&& <Icon
																title={`Agendado para ${moment(row.scheduledTo).format('DD/MM/YYYY [~]HH:mm')}`}
																style={{ marginLeft: 5 }}
																size={.8}
																path={mdiCalendar}
																color={moment(row.scheduledTo).isAfter() ? '#A4D82B' : '#999'}
															/>}
													</div>
												</TableCell>
												<TableCell><Typography variant='caption'>{`#${row.id}`}</Typography></TableCell>
												<TableCell><Typography variant='body2'>{row.user.fullName}</Typography></TableCell>
												<TableCell>{getDeliveryTypeText(row)}</TableCell>
												<TableCell><Typography variant='body2'>{numeral(row.price).format('$0,0.00')}</Typography></TableCell>
												<TableCell><Chip variant='outlined' label={row.countProducts} /></TableCell>
												<TableCell style={{ width: 30, textAlign: 'center' }}>{OrderController.statusIconComponent(row.status)}</TableCell>
												<TableCell style={{ width: 100 }}>
													<IconButton disabled={loadingUpdateOrder === row.id} component={Link} to={`${url}/alterar/${row.id}`}>
														<Icon path={canChangeStatus ? mdiPencil : mdiEye} size={1} color='#363E5E' />
													</IconButton>
													{canChangeStatus &&
														loadingUpdateOrder === row.id
														? <CircularProgress />
														: <IconButton disabled={loadingUpdateOrder} onClick={handleOpenMenu} data-order-id={row.id}>
															<Icon path={mdiDotsVertical} size={1} color='#363E5E' />
														</IconButton>
													}
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

export default Page;