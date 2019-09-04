import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import {Route} from 'react-router-dom';

import {setPageTitle} from '../../utils';
import Layout from '../../layout';
import {Content} from '../../layout/components';
import { MenuLink } from './styles';

import BusinessHours from './business_hours';
import ShippingAreas from './shipping_areas';
import PaymentMethods from './payment_methods';

function Page (props) {
	setPageTitle('Configurações');

	function isSelected(location) {
		const current_location = props.location.pathname.substr(1).split('/')[1];
		return current_location === location ? 'selected' : '';
	}
	
	return (
		<Layout>
			<Content>
				<Grid container spacing={5}>
					<Grid item xs={3}>
						<Paper>
							<MenuLink className={isSelected('horarios')} to='/configuracoes/horarios'>Horário de atendimeto</MenuLink>
							<MenuLink className={isSelected('locais')} to='/configuracoes/locais'>Locais de entrega</MenuLink>
							<MenuLink className={isSelected('pagamentos')} to='/configuracoes/pagamentos'>Formas de pagamento</MenuLink>
							<MenuLink className={isSelected('impressoras')} to='/configuracoes/impressoras'>Impressoras</MenuLink>
						</Paper>
					</Grid>
					<Grid item xs={6}>
						<Route path={`${props.match.path}/horarios`} component={BusinessHours} />
						<Route path={`${props.match.path}/locais`} component={ShippingAreas} />
						<Route path={`${props.match.path}/pagamentos`} component={PaymentMethods} />
					</Grid>
				</Grid>
			</Content>
		</Layout>
	)
}

export default Page;