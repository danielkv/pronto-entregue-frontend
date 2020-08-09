import React from 'react'

import { useMutation } from '@apollo/react-hooks';
import { Chip, Typography, Card, CardContent, Avatar, Switch } from '@material-ui/core';
import { useSnackbar } from 'notistack';

import { getErrors } from '../../../utils/error';

import { UPDATE_DELIVERY_MEN_STATUS } from '../../../graphql/deliveryMan'


export default function DeliveryItem({ item: deliveryMan }) {
	const [updateDeliveryMan, { loading }] = useMutation(UPDATE_DELIVERY_MEN_STATUS, { variables: { userId: deliveryMan.user.id } })
	const { enqueueSnackbar } = useSnackbar();


	function handleSwitch () {
		const newStatus = !deliveryMan.isEnabled
		return updateDeliveryMan({ variables: { newStatus } })
			.then(()=>{
				enqueueSnackbar(`Entregador ${deliveryMan.user.fullName} ${newStatus ? 'ativado' : 'desativado'}`, { variant: 'success' });
			})
			.catch((err)=>{
				enqueueSnackbar(getErrors(err), { variant: 'error' });
			})
	}

	return (
		<Card>
			<CardContent style={{ position: 'relative' }}>
				<div style={{ position: 'absolute', right: 10 }}>
					<Switch disabled={loading} size='small' color='primary' checked={deliveryMan.isEnabled} onChange={handleSwitch} value="includeDisabled" />
				</div>
				<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
					<Avatar src={deliveryMan.user.image} style={{ width: 60, height: 60, marginRight: 20 }} />
					<div>
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<Typography variant='body'>{deliveryMan.user.fullName}</Typography>
							{Boolean(deliveryMan.user.phones.length) && <Typography style={{ fontSize: 14, color: '#666' }}>{deliveryMan.user.phones[0].value}</Typography>}
						</div>
						<div style={{ marginTop: 5 }}>
							<Chip color={deliveryMan.isEnabled ? 'secondary' : 'default'} size='small' label={deliveryMan.isEnabled ? 'Ativo' : 'Inativo'} />
							{deliveryMan.isEnabled && <Chip style={{ marginLeft: 5 }} size='small' label={`${deliveryMan.openDeliveries.length} entregas em andamento`} />}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
