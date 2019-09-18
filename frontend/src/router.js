import './services/init';

import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import Login from './pages/login';
import Dashboard from './pages/dashboard';

import Companies from './pages/companies';
import NewCompany from './pages/companies/new_company';
import EditCompany from './pages/companies/edit_company';

import Branches from './pages/branches';
import NewBranch from './pages/branches/new_branch';
import EditBranch from './pages/branches/edit_branch';

import Storage from './pages/storage';
import NewItem from './pages/storage/new_item';

import Orders from './pages/orders';
import NewOrder from './pages/orders/new_order';

import Categories from './pages/categories';
import NewCategory from './pages/categories/new_category';

import Products from './pages/products';
import NewProduct from './pages/products/new_product';

import Users from './pages/users';
import NewUser from './pages/users/new_user';
import EditUser from './pages/users/edit_user';

import Settings from './pages/settings';

export default function Router(props) {
	return (
		<BrowserRouter>
			<Switch>
				<Route path='/login' component={Login} />

				<Route exact path='/' component={Dashboard} />

				<Route exact path='/empresas' component={Companies} />
				<Route path='/empresas/novo' component={NewCompany} />
				<Route path='/empresas/alterar/:id' component={EditCompany} />
				
				<Route exact path='/filiais' component={Branches} />
				<Route path='/filiais/novo' component={NewBranch} />
				<Route path='/filiais/alterar/:id' component={EditBranch} />

				<Route exact path='/estoque' component={Storage} />
				<Route path='/estoque/novo' component={NewItem} />
				
				<Route exact path='/pedidos' component={Orders} />
				<Route path='/pedidos/novo' component={NewOrder} />
				
				<Route exact path='/categorias' component={Categories} />
				<Route path='/categorias/novo' component={NewCategory} />
				
				<Route exact path='/produtos' component={Products} />
				<Route path='/produtos/novo' component={NewProduct} />
				
				<Route exact path='/usuarios' component={Users} />
				<Route path='/usuarios/novo' component={NewUser} />
				<Route path='/usuarios/alterar/:id' component={EditUser} />
				
				<Route path='/configuracoes' component={Settings} />
			</Switch>
		</BrowserRouter>
	);
}