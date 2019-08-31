import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import Dashboard from './pages/dashboard';
import Companies from './pages/companies';

export default function Router() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path='/empresas' component={Companies} />
				<Route path='/' component={Dashboard} />
			</Switch>
		</BrowserRouter>
	);
}