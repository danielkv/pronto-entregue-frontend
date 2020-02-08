import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';

import { Grid, Paper, List, ListItem, ListItemText } from '@material-ui/core';

import { Content } from '../../layout/components';

import { setPageTitle } from '../../utils';
import BusinessHours from './businessHours';
import DeliveryAreas from './deliveryAreas';
import General from './general';
import PaymentMethods from './paymentMethods';

function Page (props) {
	setPageTitle('Configurações');

	function isSelected(location) {
		const currentLocation = props.location.pathname.substr(1).split('/')[1];
		return currentLocation === location ? true : false;
	}
	
	return (
		<Content>
			<Grid container spacing={5}>
				<Grid item xs={3}>
					<List component={Paper}>
						<ListItem button component={Link} selected={isSelected('geral')} to='/configuracoes/geral'>
							<ListItemText primary="Geral" />
						</ListItem>
						<ListItem button component={Link} selected={isSelected('horarios')} to='/configuracoes/horarios'>
							<ListItemText primary="Horário de atendimeto" />
						</ListItem>
						<ListItem button component={Link} selected={isSelected('locais')} to='/configuracoes/locais'>
							<ListItemText primary="Locais de entrega" />
						</ListItem>
						<ListItem button component={Link} selected={isSelected('pagamentos')} to='/configuracoes/pagamentos'>
							<ListItemText primary="Formas de pagamento" />
						</ListItem>
					</List>
				</Grid>
				<Grid item xs={7}>
					<Redirect from="/" to={`${props.match.path}/geral`} />
					<Route path={`${props.match.path}/geral`} component={General} />
					<Route path={`${props.match.path}/horarios`} component={BusinessHours} />
					<Route path={`${props.match.path}/locais`} component={DeliveryAreas} />
					<Route path={`${props.match.path}/pagamentos`} component={PaymentMethods} />
				</Grid>
			</Grid>
		</Content>
	)
}

export default Page;