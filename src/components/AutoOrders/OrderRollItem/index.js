import React, { useState, useRef, Fragment } from 'react'

import { useMutation } from '@apollo/react-hooks'
import { Chip, Typography, Paper, IconButton, useTheme, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress, Divider } from '@material-ui/core'
import { mdiDotsVertical, mdiPrinter } from '@mdi/js'
import Icon from '@mdi/react'
import moment from 'moment'
import { useSnackbar } from 'notistack'
import numeral from 'numeral'

import { getOrderStatusIcon, getOrderStatusLabel, availableStatus } from '../../../controller/orderStatus'
import { getErrors } from '../../../utils/error'
import OrderRollProduct from './OrderRollProduct'
import OrderType from './OrderType'

import { UPDATE_ORDER } from '../../../graphql/orders'

export default function OrderRollItem({ item: order }) {
	const { palette } = useTheme();
	const [menuOpen, setMenuOpen] = useState(false);
	const anchorEl = useRef(null);
	const { enqueueSnackbar } = useSnackbar();
	const [updateOrderStatus, { loading: loadingUpdate }] = useMutation(UPDATE_ORDER, { variables: { id: order.id } })

	function handleCloseMenu() {
		setMenuOpen(false);
	}
	const handleUpdateStatus = (newStatus) => () => {
		updateOrderStatus({ variables: { data: { status: newStatus.slug } } })
			.then(()=>{
				enqueueSnackbar(`Status do pedido #${order.id} alterado para ${newStatus.label}`, { variant: 'success' });
			})
			.catch((err)=>{
				enqueueSnackbar(getErrors(err), { variant: 'error' });
			})
		handleCloseMenu()
	}

	const orderTotal = order.price + order.discount;
	
	return (
		<Paper style={{ marginTop: 10, marginBottom: 10, padding: 15, position: 'relative' }} elevation={0}>
			<Menu
				id="simple-menu"
				anchorEl={anchorEl.current}
				keepMounted
				open={menuOpen}
				onClose={handleCloseMenu}
			>
				{availableStatus(order).map(status => {
					return (
						<MenuItem key={status.slug} onClick={handleUpdateStatus(status)} selected={order.status===status.slug} dense>
							<ListItemIcon>{status.Icon}</ListItemIcon>
							<ListItemText>{status.label}</ListItemText>
						</MenuItem>
					)
				})}
			</Menu>
			<div style={{ marginBottom: 10 }}>
				<Chip size='small' label={`#${order.id}`} color='secondary' />
				<Chip avatar={getOrderStatusIcon(order, .8)} size='small' label={getOrderStatusLabel(order)} style={{ marginLeft: 6 }} variant='outlined' />
				<Typography style={{ marginLeft: 6 }} variant='caption'>{moment(order.createdAt).format('DD/MM HH:mm')}</Typography>
			</div>
			
			<div style={{ marginLeft: 20, display: 'flex', flexDirection: 'row' }}>
				<div style={{ width: '55%', marginRight: 30 }}>
					{order.products.map((product, index) => (
						<Fragment key={product.id}>
							{index > 0 && <Divider style={{ marginTop: 8, marginBottom: 8 }} />}
							<OrderRollProduct product={product} />
						</Fragment>
					))}
				</div>
				<div style={{ width: '40%' }}>
					<Typography style={{ fontWeight: 'bold' }}>{order.user.fullName}</Typography>
					{Boolean(order.user.phones && order.user.phones.length) && <div><Typography variant='caption'>{order.user.phones[0].value}</Typography></div>}
					<Typography variant='caption'>{order.user.email}</Typography>

					<div style={{ marginTop: 10 }}>
						<OrderType order={order} />

						<div>
							<div style={{ marginTop: 10 }}>
								<div style={{ fontWeight: 'bold', display: 'flex', flexDirection: 'row' }}>
									<Typography style={{ fontWeight: 'bold', marginRight: 5 }}>Pagamento:</Typography>
									{order.paymentMethod && <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
										<img alt='Forma de pagamento' height={20} style={{ marginRight: 5 }} src={order.paymentMethod.image} />
										<Typography variant='caption'>{`${order.paymentMethod.displayName}`}</Typography>
									</div>}
								</div>
										
							</div>
							<div style={{ marginLeft: 20 }}>
								<table style={{ width: '100%' }}>
									{!!order.discount &&
										<>
											<tr>
												<td><Typography variant='caption' style={{ fontWeight: 'bold' }}>Subtotal</Typography></td>
												<td style={{ textAlign: 'right' }}><Typography variant='caption'>{numeral(orderTotal).format('$0,0.00')}</Typography></td>
											</tr>
											<tr>
												<td><Typography variant='caption' style={{ fontWeight: 'bold' }}>Descontos {order.creditHistory && '(Créditos)'} {order.coupon && '(Cupom)'}</Typography></td>
												<td style={{ textAlign: 'right' }}><Typography variant='caption'>{numeral(order.discount).format('$0,0.00')}</Typography></td>
											</tr>
										</>
									}
									<tr>
										<td><Typography variant='caption' style={{ fontWeight: 'bold' }}>Total (cobrado do cliente)</Typography></td>
										<td style={{ textAlign: 'right' }}><Typography style={{ fontWeight: 'bold' }}>{numeral(order.price).format('$0,0.00')}</Typography></td>
									</tr>
								</table>
							</div>
						</div>

						{Boolean(order.message) && (
							<div style={{ marginTop: 10 }}>
								<Typography style={{ fontWeight: 'bold' }}>Observações: </Typography>
								<Typography variant='caption'>{order.message}</Typography>
							</div>
						)}
					</div>
				</div>
			</div>
			<div style={{ position: 'absolute', right: 10, top: 10 }}>
				<IconButton onClick={()=>window.open(`/imprimir/${order.id}`)}>
					<Icon path={mdiPrinter} size={.8} color='#999' />
				</IconButton>
				{loadingUpdate
					? <CircularProgress color='primary' />
					: (
						<IconButton innerRef={anchorEl} onClick={()=>setMenuOpen(true)}>
							<Icon path={mdiDotsVertical} size={.8} color={palette.primary.main} />
						</IconButton>
					)}
			</div>
		</Paper>
	)
}
