import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import Dashboard from './pages/dashboard';

export default function Router() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path='/' component={Dashboard} />
			</Switch>
		</BrowserRouter>
	);
}