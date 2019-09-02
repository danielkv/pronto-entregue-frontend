import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import Dashboard from './pages/dashboard';

import Companies from './pages/companies';
import NewCompany from './pages/companies/new_company';

import Branches from './pages/branches';
import NewBranch from './pages/branches/new_branch';

import Orders from './pages/orders';
import NewOrder from './pages/orders/new_order';

export default function Router() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path='/' component={Dashboard} />

				<Route exact path='/empresas' component={Companies} />
				<Route path='/empresas/novo' component={NewCompany} />
				
				<Route exact path='/filiais' component={Branches} />
				<Route path='/filiais/novo' component={NewBranch} />
				
				<Route exact path='/pedidos' component={Orders} />
				<Route path='/pedidos/novo' component={NewOrder} />
			</Switch>
		</BrowserRouter>
	);
}