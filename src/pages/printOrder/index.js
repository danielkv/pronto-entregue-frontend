import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';

import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import numeral from 'numeral';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { getErrors } from '../../utils/error';

import { LOAD_PRINT_ORDER } from '../../graphql/orders';

export default function PrintOrder() {
	const { orderId } = useParams();

	const { data: { order = null } = {}, loading: loadingGetData, error } = useQuery(LOAD_PRINT_ORDER, { variables: { id: orderId } });

	useEffect(()=>{
		if (!order || process.env.NODE_ENV === 'development') return;
		window.print();
		window.close();
	}, [order])

	if (loadingGetData) return <LoadingBlock />
	if (error) return <ErrorBlock error={getErrors(error)} />

	const orderTotal = order.price + order.discount;

	return (
		<div style={{ width: '8cm', boxSizing: 'border-box', backgroundColor: 'white', fontSize: '12pt', padding: '1.5cm 0', color: '#000' }}>
			<div style={{ textAlign: 'center' }}>
				<div style={{ fontSize: '1.1em', fontWeight: 'bold' }}>{order.company.displayName}</div>
				<div><b>Pedido #{order.id}</b> - {moment(order.createdAt).format('DD/MM HH:mm')}</div>
				<div>Impresso às {moment().format('HH:mm')} em {moment().format('DD/MM')}</div>
			</div>
			<div style={{ marginTop: '.3cm' }}>
				<div style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '.2cm' }}>Cliente:</div>
				<div>{order.user.fullName}</div>
				{Boolean(order.user.phones && order.user.phones.length) && <div>{order.user.phones[0].value}</div>}
				<div>{order.user.email}</div>
			</div>
			<div style={{ marginTop: '.2cm' }}>
				{order.type === 'takeout'
					? <div>Retirada no balcão</div>
					: (
						<>
							<div>{`${order.address.street}, ${order.address.number}`}</div>
							{Boolean(order.address.complement) && <div>{order.address.complement}</div>}
							{Boolean(order.address.reference) && <div>{order.address.reference}</div>}
							<div>{order.address.district}</div>
							{Boolean(order.address.city && order.address.state) && <div>{`${order.address.city}, ${order.address.state}`}</div>}
						</>
					)}
			</div>
			<div style={{ marginTop: '.3cm' }}>
				<div style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '.2cm' }}>Produtos:</div>
				<div>
					<table style={{ width: '100%' }}>
						{order.products.map((product, index) => (
							<tr key={index}>
								<td>
									{product.quantity}x {product.name}
									{Boolean(product.optionsGroups.length) && <div>
										{product.optionsGroups.map(group => (
											<div style={{ fontSize: '.9em' }} key={group.id}><b>{group.name}:</b> {group.options.map(option => option.name).join(', ')}</div>
										))}
									</div>}
									{Boolean(product.message) && <div>Obs: {product.message}</div>}
								</td>
								<td style={{ verticalAlign: 'top', fontSize: '.9em', textAlign: 'right' }}>{numeral(product.price).format('0,0.00')}</td>
							</tr>
						))}
					</table>
				</div>
			</div>
			<div style={{ marginTop: '.3cm' }}>
				<div style={{ marginBottom: '.6em' }}>
					<div><b>Taxa de Entrega:</b> {numeral(order.deliveryPrice).format('$0,0.00')}</div>
					{!!order.discount && (
						<>
							<div>Subtotal: {numeral(orderTotal).format('$0,0.00')}</div>
							<div>Descontos {order.creditHistory && '(Créditos)'} {order.coupon && '(Cupom)'}: {numeral(order.discount).format('$0,0.00')}</div>
						</>
					)}
					<div><b>Total Pedido:</b> {numeral(order.price).format('$0,0.00')}</div>
				</div>
				{order.paymentMethod && <div><b>Pagamento:</b> {order.paymentMethod.displayName}</div>}
				{Boolean(order.message) && <div><b>Obs:</b> {order.message}</div>}
			</div>
		</div>
	)
}
