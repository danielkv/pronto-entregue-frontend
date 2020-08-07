import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { Chip, Typography, Paper, Divider, IconButton } from '@material-ui/core'
import { mdiPrinter, mdiPencil, mdiCalendar } from '@mdi/js'
import Icon from '@mdi/react'
import { AnimatePresence, motion } from 'framer-motion'
import moment from 'moment'
import numeral from 'numeral'

import OrderController from '../../../controller/order'
import OrderRollProduct from './OrderRollProduct'
import OrderType from './OrderType'
import StatusRow from './StatusRow'

export default function OrderRollItem({ item: order }) {
	const orderTotal = order.price + order.discount;
	
	return (
		<Paper
			style={{ marginTop: 10, marginBottom: 10, padding: 15, position: 'relative', backgroundColor: order.status === 'waiting' ? 'rgba(0,0,0,.1)' : 'rgba(255,255,255,1)' }}
			elevation={0}
		>
			<div style={{ marginBottom: 10 }}>
				<Chip size='small' label={`#${order.id}`} color='secondary' />
				<Chip avatar={OrderController.statusIconComponent(order.status)} size='small' label={OrderController.statusLabel(order.status)} style={{ marginLeft: 6 }} variant='outlined' />
				<Typography style={{ marginLeft: 6 }} variant='caption'>{moment(order.createdAt).format('DD/MM HH:mm')}</Typography>
				{Boolean(order.scheduledTo) && <Chip
					avatar={<Icon style={{ backgroundColor: 'transparent' }} path={mdiCalendar} size={.8} color='#333' />}
					size='small'
					variant='default'
					color={moment(order.scheduledTo).isAfter() ? 'secondary' : 'default'}
					label={`Agendado para ${moment(order.scheduledTo).format('DD/MM/YYYY [~]HH:mm')}`}
					style={{ marginLeft: 6 }}
				/>}

				{order.status !== 'waiting' &&
					<div style={{ position: 'absolute', right: 10, top: 10 }}>
						<IconButton component={Link} to={`/dashboard/pedidos/alterar/${order.id}`}>
							<Icon path={mdiPencil} size={.8} color='#999' />
						</IconButton>
						<IconButton onClick={()=>window.open(`/imprimir/${order.id}`)}>
							<Icon path={mdiPrinter} size={.8} color='#999' />
						</IconButton>
					</div>}
			</div>
			<AnimatePresence>
				{order.status !== 'waiting' &&
					<motion.div
						initial={{ height: 0 }}
						animate={{ height: 'auto' }}
						exit={{ height: 0 }}
						style={{ marginLeft: 20, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}
					>
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
											<tbody>
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
											</tbody>
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
					</motion.div>}
			</AnimatePresence>
			<div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
				<StatusRow order={order} />
			</div>
		</Paper>
	)
}
