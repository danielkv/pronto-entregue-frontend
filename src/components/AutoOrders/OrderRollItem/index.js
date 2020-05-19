import React, { useState, useRef, Fragment } from 'react'

import { useMutation } from '@apollo/react-hooks'
import { Chip, Typography, Paper, IconButton, useTheme, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress, Divider } from '@material-ui/core'
import { mdiDotsVertical } from '@mdi/js'
import Icon from '@mdi/react'
import moment from 'moment'
import { useSnackbar } from 'notistack'

import { getOrderStatusIcon, getOrderStatusLabel, availableStatus } from '../../../controller/orderStatus'
import { getErrors } from '../../../utils/error'
import OrderRollProduct from './OrderRollProduct'

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
				<div>
					<Typography style={{ fontWeight: 'bold' }}>{order.user.fullName}</Typography>
					{Boolean(order.user.phones && order.user.phones.length) && <div><Typography variant='caption'>{order.user.phones[0].value}</Typography></div>}
					<Typography variant='caption'>{order.user.email}</Typography>

					<div style={{ marginTop: 10 }}>
						{order.type === 'takeout'
							? <Typography>Retirada no Balcão</Typography>
							: (
								<div>
									<Typography style={{ fontWeight: 'bold' }}>{`${order.address.street}, n ${order.address.number}`}</Typography>
									<Typography variant='subtitle2'>{order.address.district}</Typography>
									<Typography variant='subtitle2'>{`${order.address.city} - ${order.address.state}`}</Typography>
									<Typography variant='subtitle2'>{order.address.zipcode}</Typography>
									<div style={{ marginTop: 10 }}>
										<Typography style={{ fontWeight: 'bold' }}>Valor: </Typography>
										<div style={{ marginLeft: 20 }}>
											<Typography variant='caption'>{`R$ ${order.price.toFixed(2).replace('.', ",")}`}</Typography>
											<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
												<img alt='Forma de pagamento' height={20} style={{ marginRight: 5 }} src={order.paymentMethod.image} />
												<Typography variant='caption'>{`${order.paymentMethod.displayName}`}</Typography>
											</div>
										</div>
									</div>
									{Boolean(order.message) && (
										<div style={{ marginTop: 10 }}>
											<Typography style={{ fontWeight: 'bold' }}>Observações: </Typography>
											<Typography variant='caption'>{order.message}</Typography>
										</div>
									)}
								</div>
							)}
					</div>
				</div>
			</div>
			<div style={{ position: 'absolute', right: 10, top: 10 }}>
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
