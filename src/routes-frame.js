import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';

import ProtectedRoute from './components/ProtectedRoute';
import { Container, HeaderArea, NavigationArea, Main } from './layout/components';

import Header from './layout/header';
import Navigation from './layout/navigation';
import theme from './layout/theme';
import Campaigns from './pages/campaigns';
import EditCampaign from './pages/campaigns/edit_campaign';
import NewCampaign from './pages/campaigns/new_campaign';
import Categories from './pages/categories';
import EditCategory from './pages/categories/edit_category';
import NewCategory from './pages/categories/new_category';
import Companies from './pages/companies';
import EditCompany from './pages/companies/edit_company';
import NewCompany from './pages/companies/new_company';
import CompanyTypes from './pages/companyTypes';
import EditType from './pages/companyTypes/edit_type';
import NewType from './pages/companyTypes/new_type';
import Dashboard from './pages/dashboard';
import Orders from './pages/orders';
import EditOrder from './pages/orders/edit_order';
import NewOrder from './pages/orders/new_order';
import People from './pages/people';
import EditPeople from './pages/people/edit_people';
import NewPeople from './pages/people/new_people';
import Users from './pages/people/users';
import Products from './pages/products';
import EditProduct from './pages/products/edit_product';
import NewProduct from './pages/products/new_product';
import Ratings from './pages/ratings';
import Settings from './pages/settings';

export default function Layout () {
	return (
		<ThemeProvider theme={theme}>
			<SnackbarProvider>
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

							<Route exact path='/categorias' component={Categories} />
							<Route path='/categorias/novo' component={NewCategory} />
							<Route path='/categorias/alterar/:id' component={EditCategory} />
						
							<Route exact path='/campanhas' component={Campaigns} />
							<Route path='/campanhas/nova' component={NewCampaign} />
							<Route path='/campanhas/alterar/:id' component={EditCampaign} />
						
							<Route exact path='/usuarios' component={Users} />
							<Route path='/pessoas/alterar/:id' component={EditPeople} />
							<ProtectedRoute role='master' exact path='/pessoas' component={People} />
							<ProtectedRoute role='master' path='/pessoas/nova' component={NewPeople} />

							<Route path='/pontuacao' component={Ratings} />
						
							<Route path='/configuracoes' component={Settings} />

							<ProtectedRoute exact role='master' path='/empresas' component={Companies} />
							<ProtectedRoute role='master' path='/empresas/novo' component={NewCompany} />
							<ProtectedRoute role='master' path='/empresas/alterar/:id' component={EditCompany} />

							<ProtectedRoute role='master' exact path='/ramos' component={CompanyTypes} />
							<ProtectedRoute role='master' path='/ramos/novo' component={NewType} />
							<ProtectedRoute role='master' path='/ramos/alterar/:id' component={EditType} />
						</Switch>
					</Main>
				</Container>
			</SnackbarProvider>
		</ThemeProvider>
	)
}