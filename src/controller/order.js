import React from 'react';

import { mdiClock, mdiSilverwareSpoon, mdiMoped, mdiCheckCircle, mdiCloseCircle, mdiBagChecked, mdiAccountClock, mdiPlaylistCheck, mdiCalendarCheck } from '@mdi/js';
import Icon from '@mdi/react';

class OrderController {
	static statusVariant(status) {
		// isIn: [['waiting', 'preparing', 'delivering', 'delivered', 'canceled']],
			
		switch(status) {
			case 'waiting':
			case 'preparing':
			case 'waitingDelivery':
				return 'default';
			case 'delivering':
			case 'waitingPickUp':
				return 'warning';
			case 'delivered':
				return 'success';
			case 'canceled':
				return 'error';
			default:
				return 'default';
		}
		
	}

	static statusIcon (status) {
		switch(status) {
			case 'accepted':
				return { path: mdiPlaylistCheck, color: '#363E5E' };
			case 'waiting':
				return { path: mdiClock, color: '#363E5E' };
			case 'scheduled':
				return { path: mdiCalendarCheck, color: '#363E5E' };
			case 'preparing':
				return { path: mdiSilverwareSpoon, color: '#363E5E' };
			case 'waitingDelivery':
				return { path: mdiAccountClock, color: '#363E5E' };
			case 'waitingPickUp':
				return { path: mdiBagChecked, color: '#363E5E' };
			case 'delivering':
				return { path: mdiMoped, color: '#363E5E' };
			case 'delivered':
				return { path: mdiCheckCircle, color: '#058F0A' };
			case 'canceled':
				return { path: mdiCloseCircle, color: '#E63A3A' };
			default: return '';
		}
	}

	static statusIconComponent(status, size=.8) {
		const label = OrderController.statusLabel(status);
		const icon = OrderController.statusIcon(status);

		return <Icon path={icon.path} size={size} color={icon.color} alt={label} title={label} />
	}

	static canChangeStatus(availableStatus, oldStatus, newStatus) {
		const oldStatusIndex = availableStatus.findIndex(stat => stat.slug === oldStatus);
		const newStatusIndex = availableStatus.findIndex(stat => stat.slug === newStatus);

		if (oldStatusIndex <= newStatusIndex) return true;
		return false;
	}

	static availableStatus(order, userRole) {
		// ['waiting', 'preparing', 'delivering', 'delivered', 'canceled']

		// initial status
		let status = ['accepted', 'canceled'];

		if (order.status !== 'waiting' || userRole === 'master') {
			status = ['waiting'];
			
			if (order.scheduledTo) {
				status.push('scheduled')
			} else {
				status.push('preparing')
			}
			
			status = [...status, ...OrderController.getOrderTypesStatus(order.type)]
		}

		const acceptChangeStatusTo = order.scheduledTo ? 'scheduled' : 'preparing';

		return status.map(stat => ({
			slug: stat === 'accepted' ? acceptChangeStatusTo : stat,
			label: OrderController.statusLabel(stat),
			icon: OrderController.statusIcon(stat),
			IconComponent: OrderController.statusIconComponent(stat)
		}))
	}

	static getOrderTypesStatus(type) {
		switch (type) {
			case 'peDelivery':
				return ['waitingDelivery', 'delivering', 'delivered', 'canceled']
			case 'takeout':
				return ['waitingPickUp', 'delivered', 'canceled']
			case 'delivery':
			default:
				return ['delivering', 'delivered', 'canceled']
		}
	}

	static statusLabel(status) {
	// isIn: [['waiting', 'preparing', 'delivering', 'delivered', 'canceled']],
		
		switch(status) {
			case 'accepted':
				return 'Abrir';
			case 'waiting':
				return 'Aguardando';
			case 'scheduled':
				return 'Agendado';
			case 'preparing':
				return 'Preparando';
			case 'waitingDelivery':
				return 'Aguardando entregador';
			case 'waitingPickUp':
				return 'Aguardando retirada';
			case 'delivering':
				return 'A caminho';
			case 'delivered':
				return 'Entregue';
			case 'canceled':
				return 'Cancelar';
			default: return '';
		}
	
	}
}

export default OrderController;