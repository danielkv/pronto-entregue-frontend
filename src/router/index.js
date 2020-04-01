import React from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { ThemeProvider } from '@material-ui/styles';

import { ThemeProvider as StyledThemProvider } from 'styled-components'


import theme from '../layout/theme';
import Landing from '../pages/landing';
import DashboardRoutes from './dashboard';

import 'moment/locale/pt-br';

const Router = ()  => {
	return (
		<ThemeProvider theme={theme}>
			<StyledThemProvider theme={theme}>
				<BrowserRouter>
					<Switch>
						<Route exact path='/' component={Landing} />
						<Route path='/dashboard' component={DashboardRoutes} />
					</Switch>
				</BrowserRouter>
			</StyledThemProvider>
		</ThemeProvider>
	);
}

export default hot(Router);