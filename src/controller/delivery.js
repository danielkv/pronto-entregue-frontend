import { mdiPlaylistCheck, mdiClock, mdiAccountClock, mdiMoped, mdiCheckCircle, mdiCloseCircle } from "@mdi/js";

class DeliveryControl {
	availableStatus(delivery) {
		let status = ['waiting', 'waitingDelivery', 'delivering', 'delivered', 'canceled'];
	
		return status.map(stat => ({ slug: stat, label: this.statusLabel(stat), icon: this.statusIcon(stat) }))
	}

	statusIcon(status) {
		// isIn: [['waiting', 'preparing', 'delivery', 'delivered', 'canceled']],
		switch(status) {
			case 'accepted':
				return { path: mdiPlaylistCheck, color: '#363E5E' }
			case 'waiting':
				return { path: mdiClock, color: '#363E5E' }
			case 'waitingDelivery':
				return { path: mdiAccountClock, color: '#363E5E' }
			case 'delivering':
				return { path: mdiMoped, color: '#363E5E' }
			case 'delivered':
				return { path: mdiCheckCircle, color: '#058F0A' }
			case 'canceled':
				return { path: mdiCloseCircle,  color: '#E63A3A' }
			default: return '';
		}
	}

	statusLabel(status) {
		// isIn: [['waiting', 'preparing', 'delivering', 'delivered', 'canceled']],
			
		switch(status) {
			case 'waiting':
				return 'Aguardando';
			case 'preparing':
				return 'Preparando';
			case 'waitingDelivery':
				return 'Aguardando entregador';
			case 'delivering':
				return 'A caminho';
			case 'delivered':
				return 'Entregue';
			case 'canceled':
				return 'Cancelado';
			default: return '';
		}
		
	}
	
	statusColors(status) {
		switch (status) {
			case 'delivered':
				return {
					background: '#A4D82B',
					text: '#000'
				};
			case 'delivering':
				return {
					background: '#FFCA39',
					text: '#333'
				};
			case 'canceled':
				return {
					background: '#f44336',
					text: '#fff'
				};
			case 'waiting':
			default:
				return {
					background: '#000',
					text: '#fff'
				};
		}
	}
}

const DeliveryController = new DeliveryControl();

export default DeliveryController;