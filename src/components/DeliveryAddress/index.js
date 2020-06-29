import React from 'react';

import { Typography } from '@material-ui/core';


// import { Container } from './styles';

function DeliveryAddress({ address, title }) {
	return <div>
		{Boolean(title) && <Typography style={{ fontWeight: 'bold', fontSize: 16 }}>{title}</Typography>}
		<Typography variant='subtitle2'>{`${address.street}, n ${address.number}`}</Typography>

		{Boolean(address.reference) && <Typography variant='subtitle2'>{address.reference}</Typography>}
		{Boolean(address.complement) && <Typography variant='subtitle2'>{address.complement}</Typography>}
		
		<Typography variant='subtitle2'>{address.district}</Typography>
		<Typography variant='subtitle2'>{`${address.city} - ${address.state}`}</Typography>
		{/* <Typography variant='subtitle'>{address.zipcode}</Typography> */}
	</div>;
}

export default DeliveryAddress;