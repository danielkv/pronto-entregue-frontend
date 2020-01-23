import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import { ThemeProvider } from '@material-ui/styles';

import { Container, HeaderArea, NavigationArea, Main } from './layout/components';

import { useLoggedUserRole } from './controller/hooks';
import Header from './layout/header';
import Navigation from './layout/navigation';
import theme from './layout/theme';
import Categories from './pages/categories';
import EditCategory from './pages/categories/edit_category';
import NewCategory from './pages/categories/new_category';
import Companies from './pages/companies';
import EditCompany from './pages/companies/edit_company';
import NewCompany from './pages/companies/new_company';
import Dashboard from './pages/dashboard';
import Orders from './pages/orders';
import EditOrder from './pages/orders/edit_order';
import NewOrder from './pages/orders/new_order';
import Products from './pages/products';
import EditProduct from './pages/products/edit_product';
import NewProduct from './pages/products/new_product';
import Settings from './pages/settings';
import Users from './pages/users';
import Customers from './pages/users/customers';
import EditUser from './pages/users/edit_user';
import NewUser from './pages/users/new_user';

export default function Layout () {
	const loggedUserRole = useLoggedUserRole();

	return (
		<ThemeProvider theme={theme}>
			<Container>
				<HeaderArea>
					<Header />
				</HeaderArea>
				<NavigationArea>
					<Navigation />
				</NavigationArea>
				<Main>
					<Switch>
						<Redirect exact from='/' to='/dashboard' />

						<Route exact path='/dashboard' component={Dashboard} />
						
						<Route exact path='/pedidos' component={Orders} />
						<Route path='/pedidos/novo' component={NewOrder} />
						<Route path='/pedidos/alterar/:id' component={EditOrder} />
						
						<Route exact path='/produtos' component={Products} />
						<Route path='/produtos/novo' component={NewProduct} />
						<Route path='/produtos/alterar/:id' component={EditProduct} />
						
						<Route exact path='/usuarios' component={Users} />
						<Route path='/usuarios/alterar/:id' component={EditUser} />
						
						<Route path='/configuracoes' component={Settings} />

						{loggedUserRole === 'master' && (
							<>
								<Route exact path='/empresas' component={Companies} />
								<Route path='/empresas/novo' component={NewCompany} />
								<Route path='/empresas/alterar/:id' component={EditCompany} />

								<Route exact path='/categorias' component={Categories} />
								<Route path='/categorias/novo' component={NewCategory} />
								<Route path='/categorias/alterar/:id' component={EditCategory} />
								
								<Route exact path='/clientes' render={()=><Customers />} />
								<Route path='/clientes/novo' render={()=><NewUser />} />
							</>
						)}
					</Switch>
				</Main>
			</Container>
		</ThemeProvider>
	)
}