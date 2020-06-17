import React from 'react';
import { Route, Redirect, Link, useRouteMatch } from 'react-router-dom';

import { Grid, Paper, List, ListItem, ListItemText, Divider } from '@material-ui/core';

import ProtectedRoute from '../../components/ProtectedRoute';
import { Content } from '../../layout/components';

import { useLoggedUserRole } from '../../controller/hooks';
import { setPageTitle } from '../../utils';
import BusinessHours from './businessHours';
import DeliveryAreas from './deliveryAreas';
import General from './general';
import PaymentMethods from './paymentMethods';
import PeDeliveryAreas from './peDeliveryAreas';
import ViewAreas from './viewAreas';

export default function Settings(props) {
	setPageTitle('Configurações');
	const { path, url } = useRouteMatch();
	const loggedUserRole = useLoggedUserRole();

	function isSelected(location) {
		const currentLocation = props.location.pathname.substr(1).split('/')[2];
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
						<ListItem button component={Link} selected={isSelected('locais-de-entrega')} to={`${url}/locais-de-entrega`}>
							<ListItemText primary="Locais de entrega" secondary='Preços e áreas de entrega' />
						</ListItem>
						<ListItem button component={Link} selected={isSelected('locais-de-vizualizacao')} to={`${url}/locais-de-vizualizacao`}>
							<ListItemText primary="Locais de vizualização" secondary='Retirada no balcão' />
						</ListItem>
						<ListItem button component={Link} selected={isSelected('pagamentos')} to={`${url}/pagamentos`}>
							<ListItemText primary="Formas de pagamento" />
						</ListItem>
						{loggedUserRole === 'master' &&
							<>
								<Divider />
								<ListItem button component={Link} selected={isSelected('locais-de-entrega-pe')} to={`${url}/locais-de-entrega-pe`}>
									<ListItemText primary="Locais de entrega (PE)" />
								</ListItem>
							</>
						}
					</List>
				</Grid>
				<Grid item xs={7}>
					<Redirect from="/" to={`${url}/geral`} />
					<Route path={`${path}/geral`} component={General} />
					<Route path={`${path}/horarios`} component={BusinessHours} />
					<Route path={`${path}/locais-de-entrega`} component={DeliveryAreas} />
					<Route path={`${path}/locais-de-vizualizacao`} component={ViewAreas} />
					<Route path={`${path}/pagamentos`} component={PaymentMethods} />
					<ProtectedRoute role='master' path={`${path}/locais-de-entrega-pe`} component={PeDeliveryAreas} />
				</Grid>
			</Grid>
		</Content>
	)
}