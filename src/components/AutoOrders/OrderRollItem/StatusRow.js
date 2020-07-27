import React, { useState } from 'react'

import { useMutation } from '@apollo/react-hooks'
import { Button, CircularProgress, ButtonGroup } from '@material-ui/core';
import { useSnackbar } from 'notistack';

import { useLoggedUserRole } from '../../../controller/hooks';
import OrderController from '../../../controller/order';
import { getErrors } from '../../../utils/error';

import { CHANGE_ORDER_STATUS } from '../../../graphql/orders';

export default function StatusRow({ order }) {
	const [loadingStatus, setLoadingStatus] = useState(null);
	const { enqueueSnackbar } = useSnackbar();
	const loggedUserRole = useLoggedUserRole();

	const [changeOrderStatus] = useMutation(CHANGE_ORDER_STATUS, { variables: { id: order.id } })

	const handleUpdateStatus = (newStatus) => () => {
		setLoadingStatus(newStatus.slug)
		
		changeOrderStatus({ variables: { newStatus: newStatus.slug } })
			.then(()=>{
				enqueueSnackbar(`Status do pedido #${order.id} alterado para ${newStatus.label}`, { variant: 'success' });
			})
			.catch((err)=>{
				enqueueSnackbar(getErrors(err), { variant: 'error' });
			})
			.finally(()=>setLoadingStatus(null))
	}

	const availableOrderStatus = OrderController.availableStatus(order, loggedUserRole);

	return (
		<div>
			<ButtonGroup>
				{availableOrderStatus.map(status => {
					const selected = order.status;
					const canChangeOrderStatus = loggedUserRole === 'master' || OrderController.canChangeStatus(availableOrderStatus, selected, status.slug);

					return (
						<Button
							key={status.slug}
							disabled={!canChangeOrderStatus}
							onClick={handleUpdateStatus(status)}
							style={{ fontSize: 12, textTransform: 'none',padding: '0 15px', height: 27 }}
							startIcon={status.IconComponent}
							color={selected === status.slug ? 'secondary': 'default'}
							variant='contained'
						>
							{loadingStatus === status.slug
								? <CircularProgress size={15} />
								: status.label}
						</Button>
					)
				})}
			</ButtonGroup>
		</div>
	)
}
