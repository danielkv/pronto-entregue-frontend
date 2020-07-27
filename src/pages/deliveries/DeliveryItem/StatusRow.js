import React, { useState } from 'react'

import { useMutation } from '@apollo/react-hooks'
import { CircularProgress, IconButton, useTheme } from '@material-ui/core';
import Icon from '@mdi/react';
import { useSnackbar } from 'notistack';


import DeliveryController from '../../../controller/delivery';
import { getErrors } from '../../../utils/error';

import { CHANGE_DELIVERY_STATUS } from '../../../graphql/deliveries';

export default function StatusRow({ delivery }) {
	const [loadingStatus, setLoadingStatus] = useState(null);
	const { enqueueSnackbar } = useSnackbar();
	const { palette } = useTheme();

	const [changeDeliveryStatus] = useMutation(CHANGE_DELIVERY_STATUS, { variables: { deliveryId: delivery.id } })

	const handleUpdateStatus = (newStatus) => () => {
		setLoadingStatus(newStatus.slug)
		
		changeDeliveryStatus({ variables: { newStatus: newStatus.slug } })
			.then(()=>{
				enqueueSnackbar(`Status da entrega #${delivery.id} alterado para ${newStatus.label}`, { variant: 'success' });
			})
			.catch((err)=>{
				enqueueSnackbar(getErrors(err), { variant: 'error' });
			})
			.finally(()=>setLoadingStatus(null))
	}

	const availableOrderStatus = DeliveryController.availableStatus();

	return (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			{availableOrderStatus.map(status => {
				const selected = delivery.status;
				const backgroundColor = selected === status.slug ? palette.secondary.main : 'transparent';

				return (
					<IconButton
						key={status.slug}
						onClick={handleUpdateStatus(status)}
						style={{ fontSize: 12, textTransform: 'none', backgroundColor }}
						//color={selected === status.slug ? 'secondary': 'default'}
							
					>
						{loadingStatus === status.slug
							? <CircularProgress size={15} />
							: <Icon {...status.icon} size={.9} />}
					</IconButton>
				)
			})}
		</div>
	)
}
