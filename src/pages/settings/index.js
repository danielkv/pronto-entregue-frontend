import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { Grid, Paper } from '@material-ui/core';

import { Content } from '../../layout/components';

import { setPageTitle } from '../../utils';
import BusinessHours from './businessHours';
import DeliveryAreas from './deliveryAreas';
import PaymentMethods from './paymentMethods';
import { MenuLink } from './styles';

function Page (props) {
	setPageTitle('Configurações');

	function isSelected(location) {
		const currentLocation = props.location.pathname.substr(1).split('/')[1];
		return currentLocation === location ? 'selected' : '';
	}
	
	return (
		<Content>
			<Grid container spacing={5}>
				<Grid item xs={3}>
					<Paper>
						<MenuLink className={isSelected('horarios')} to='/configuracoes/horarios'>Horário de atendimeto</MenuLink>
						<MenuLink className={isSelected('locais')} to='/configuracoes/locais'>Locais de entrega</MenuLink>
						<MenuLink className={isSelected('pagamentos')} to='/configuracoes/pagamentos'>Formas de pagamento</MenuLink>
						{/* <MenuLink className={isSelected('impressoras')} to='/configuracoes/impressoras'>Impressoras</MenuLink> */}
					</Paper>
				</Grid>
				<Grid item xs={7}>
					<Redirect from="/" to={`${props.match.path}/horarios`} />
					<Route path={`${props.match.path}/horarios`} component={BusinessHours} />
					<Route path={`${props.match.path}/locais`} component={DeliveryAreas} />
					<Route path={`${props.match.path}/pagamentos`} component={PaymentMethods} />
				</Grid>
			</Grid>
		</Content>
	)
}

export default Page;