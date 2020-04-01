import React from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// config import
import 'moment/locale/pt-br';

import Landing from '../pages/landing';
import DashboardRoutes from './dashboard';

const Router = ()  => {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path='/' component={Landing} />
				<Route path='/dashboard' component={DashboardRoutes} />
			</Switch>
		</BrowserRouter>
	);
}

export default hot(Router);