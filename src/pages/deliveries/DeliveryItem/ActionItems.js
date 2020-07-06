import React, { useState } from 'react';

import { useMutation } from '@apollo/react-hooks';
import { Button, CircularProgress } from '@material-ui/core';

import { availableStatus } from '../../../controller/orderStatus';

import { CHANGE_DELIVERY_STATUS } from '../../../graphql/deliveries';

// import { Container } from './styles';

function ActionItems ({ delivery }) {
	const [updatingLoading, setUpdatingLoading] = useState(null);
		
	const [changeDelvieryStatus] = useMutation(CHANGE_DELIVERY_STATUS, { variables: { deliveryId: delivery.id } });

	const handleChangeStatus = (status) => () => {
		setUpdatingLoading(status.slug);
		changeDelvieryStatus({ variables: { newStatus: status.slug } })
			.catch((err)=>{
				Alert.alert('Ops, ocorreu um erro!', getErrorMessage(err))
			})
			.finally(()=>setUpdatingLoading(null))
	}

	const statuses = availableStatus(delivery);

	return (
		<div style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
			{statuses.map((stat) => {
				
				const label = stat.slug === 'canceled' ? 'Cancelar' : stat.label;
			
				return <Button
					disabled={Boolean(updatingLoading)}
					key={stat.slug}
					onPress={handleChangeStatus(stat)}
					variant='filled'
					icon={updatingLoading === stat.slug ? null : { ...icon, color: delivery.status === stat.slug ? colors.text : '#333', size: 18 }}
					style={{
						button: { backgroundColor: delivery.status === stat.slug ? colors.background : '#ccc', paddingHorizontal: 10, height: 40 },
						text: { fontSize: 13, color: delivery.status === stat.slug ? colors.text : '#333' }
					}}
				>
					{updatingLoading === stat.slug ? <CircularProgress /> : label}
				</Button>
			})}
		</div>
	);
}

export default ActionItems;