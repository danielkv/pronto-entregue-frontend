import React, { useState, useRef } from 'react'

import { useMutation } from '@apollo/react-hooks'
import { Chip, Typography, Paper, IconButton, useTheme, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress } from '@material-ui/core'
import { mdiDotsVertical } from '@mdi/js'
import Icon from '@mdi/react'
import moment from 'moment'
import { useSnackbar } from 'notistack'

import { getErrors } from '../../../utils/error'
import { getOrderStatusIcon, getOrderStatusName } from '../../../utils/orders'
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
		updateOrderStatus({ variables: { data: { status: newStatus } } })
			.then(()=>{
				enqueueSnackbar(`Status do pedido #${order.id} alterado para ${getOrderStatusName(newStatus)}`, { variant: 'success' });
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
				<MenuItem onClick={handleUpdateStatus('waiting')} selected={order.status==='waiting'} dense>
					<ListItemIcon>{getOrderStatusIcon('waiting')}</ListItemIcon>
					<ListItemText>Aguardando</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleUpdateStatus('preparing')} selected={order.status==='preparing'} dense>
					<ListItemIcon>{getOrderStatusIcon('preparing')}</ListItemIcon>
					<ListItemText>Em preparo</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleUpdateStatus('delivering')} selected={order.status==='delivering'} dense>
					<ListItemIcon>{getOrderStatusIcon('delivering')}</ListItemIcon>
					<ListItemText>Na entrega</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleUpdateStatus('delivered')} selected={order.status==='delivered'} dense>
					<ListItemIcon>{getOrderStatusIcon('delivered')}</ListItemIcon>
					<ListItemText>Entregue</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleUpdateStatus('canceled')} selected={order.status==='canceled'} dense>
					<ListItemIcon>{getOrderStatusIcon('canceled')}</ListItemIcon>
					<ListItemText>Cancelado</ListItemText>
				</MenuItem>
			</Menu>
			<div style={{ marginBottom: 10 }}>
				<Chip size='small' label={`#${order.id}`} color='secondary' />
				<Chip avatar={getOrderStatusIcon(order.status, .8)} size='small' label={getOrderStatusName(order.status)} style={{ marginLeft: 6 }} variant='outlined' />
				<Typography style={{ marginLeft: 6 }} variant='caption'>{moment(order.createdAt).format('DD/MM HH:mm')}</Typography>
			</div>
			
			<div style={{ marginLeft: 20, display: 'flex', flexDirection: 'row' }}>
				<div style={{ width: '55%', marginRight: 30 }}>
					{order.products.map(product => <OrderRollProduct key={product.id} product={product} />)}
				</div>
				<div>
					<Typography>{order.user.fullName}</Typography>
					{order.type === 'takeout'
						? <Typography>Retirada no Balcão</Typography>
						: (
							<div>
								<Typography style={{ fontWeight: 'bold' }}>{`${order.address.street}, n ${order.address.number}`}</Typography>
								<Typography variant='subtitle2'>{order.address.district}</Typography>
								<Typography variant='subtitle2'>{`${order.address.city} - ${order.address.state}`}</Typography>
								<Typography variant='subtitle2'>{order.address.zipcode}</Typography>
								{Boolean(order.message) && (
									<div style={{ marginTop: 15 }}>
										<Typography style={{ fontWeight: 'bold' }}>Observações: </Typography>
										<Typography variant='caption'>{order.message}</Typography>
									</div>
								)}
							</div>
						)}
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
