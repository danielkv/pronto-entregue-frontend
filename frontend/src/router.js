import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import Dashboard from './pages/dashboard';

import Companies from './pages/companies';
import NewCompany from './pages/companies/new_company';

import Branches from './pages/branches';
import NewBranch from './pages/branches/new_branch';

import Orders from './pages/orders';
import NewOrder from './pages/orders/new_order';

import Categories from './pages/categories';
import NewCategory from './pages/categories/new_category';

import Products from './pages/products';
import NewProduct from './pages/products/new_product';

import Users from './pages/users';
import NewUser from './pages/users/new_user';

import Settings from './pages/settings';


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
				
				<Route exact path='/categorias' component={Categories} />
				<Route path='/categorias/novo' component={NewCategory} />
				
				<Route exact path='/produtos' component={Products} />
				<Route path='/produtos/novo' component={NewProduct} />
				
				<Route exact path='/usuarios' component={Users} />
				<Route path='/usuarios/novo' component={NewUser} />
				
				<Route path='/configuracoes' component={Settings} />
			</Switch>
		</BrowserRouter>
	);
}