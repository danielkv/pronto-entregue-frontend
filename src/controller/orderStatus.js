import React from 'react';

import { mdiClock, mdiSilverwareSpoon, mdiMoped, mdiCheckCircle, mdiCloseCircle, mdiBagChecked } from '@mdi/js';
import Icon from '@mdi/react';

export const getOrderStatusIcon = (order, size=1) => {
	const label = getOrderStatusLabel(order);

	switch(order.status) {
		case 'waiting':
			return <Icon path={mdiClock} size={size} color='#363E5E' alt={label} title={label} />
		case 'preparing':
			return <Icon path={mdiSilverwareSpoon} size={size} color='#363E5E' alt={label} title={label} />
		case 'delivering':
			if (order.type === 'takeout')
				return <Icon path={mdiBagChecked} size={size} color='#363E5E' alt={label} title={label} />
			return <Icon path={mdiMoped} size={size} color='#363E5E' alt={label} title={label} />
		case 'delivered':
			return <Icon path={mdiCheckCircle} size={size} color='#058F0A' alt={label} title={label} />
		case 'canceled':
			return <Icon path={mdiCloseCircle} size={size} color='#E63A3A' alt={label} title={label} />
		default: return '';
	}
}

export function availableStatus(order) {
	const status = ['waiting', 'preparing', 'delivering', 'delivered', 'canceled'];

	return status.map(stat => ({ slug: stat, label: getOrderStatusLabel(order, stat), Icon: getOrderStatusIcon({ ...order, status: stat }) }))
}

export function getOrderStatusLabel(order, status) {
	// isIn: [['waiting', 'preparing', 'delivering', 'delivered', 'canceled']],
		
	switch(status || order.status) {
		case 'waiting':
			return 'Aguardando';
		case 'preparing':
			return 'Preparando';
		case 'delivering':
			return order.type === 'takeout' ? 'Aguardando retirada' : 'A caminho';
		case 'delivered':
			return 'Entregue';
		case 'canceled':
			return 'Cancelado';
		default: return '';
	}
	
}