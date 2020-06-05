import React from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';

import { ThemeProvider as StyledThemProvider } from 'styled-components'

import theme from '../layout/theme';
import App from '../pages/app';
import Landing from '../pages/landing';
import RecoverPassword from '../pages/recoverPassword';
import PrivacyPolicy from '../static/politica-privacidade';
import DashboardRoutes from './dashboard';

import 'moment/locale/pt-br';

const Router = ()  => {
	return (
		<ThemeProvider theme={theme}>
			<StyledThemProvider theme={theme}>
				<SnackbarProvider maxSnack={8}>
					<BrowserRouter>
						<Switch>
							<Route exact path='/' component={Landing} />
							<Route exact path='/nova-senha/:token' component={RecoverPassword} />
							<Route exact path='/app' component={App} />
							<Route path='/dashboard' component={DashboardRoutes} />
							<Route path='/politica-privacidade' component={PrivacyPolicy} />
						</Switch>
					</BrowserRouter>
				</SnackbarProvider>
			</StyledThemProvider>
		</ThemeProvider>
	);
}

export default hot(Router);