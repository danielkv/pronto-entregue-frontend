import React from 'react';
import { Route, Redirect, Link, useRouteMatch } from 'react-router-dom';

import { Grid, Paper, List, ListItem, ListItemText } from '@material-ui/core';

import { Content } from '../../layout/components';

import { setPageTitle } from '../../utils';
import BusinessHours from './businessHours';
import DeliveryAreas from './deliveryAreas';
import General from './general';
import PaymentMethods from './paymentMethods';

export default function Settings(props) {
	setPageTitle('Configurações');
	const { path, url } = useRouteMatch();

	function isSelected(location) {
		const currentLocation = props.location.pathname.substr(1).split('/')[1];
		return currentLocation === location ? true : false;
	}
	
	return (
		<Content>
			<Grid container spacing={6}>
				<Grid item xs={3}>
					<List component={Paper}>
						<ListItem button component={Link} selected={isSelected('geral')} to={`${url}/geral`}>
							<ListItemText primary="Geral" />
						</ListItem>
						<ListItem button component={Link} selected={isSelected('horarios')} to={`${url}/horarios`}>
							<ListItemText primary="Horário de atendimeto" />
						</ListItem>
						<ListItem button component={Link} selected={isSelected('locais')} to={`${url}/locais`}>
							<ListItemText primary="Locais de entrega" />
						</ListItem>
						<ListItem button component={Link} selected={isSelected('pagamentos')} to={`${url}/pagamentos`}>
							<ListItemText primary="Formas de pagamento" />
						</ListItem>
					</List>
				</Grid>
				<Grid item xs={7}>
					<Redirect from="/" to={`${url}/geral`} />
					<Route path={`${path}/geral`} component={General} />
					<Route path={`${path}/horarios`} component={BusinessHours} />
					<Route path={`${path}/locais`} component={DeliveryAreas} />
					<Route path={`${path}/pagamentos`} component={PaymentMethods} />
				</Grid>
			</Grid>
		</Content>
	)
}