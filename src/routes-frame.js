import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

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
	const { path } = useRouteMatch();
	
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
							<Route exact path={`${path}/`} component={Dashboard} />
						
							<Route exact path={`${path}/pedidos/`} component={Orders} />
							<Route path={`${path}/pedidos/novo`} component={NewOrder} />
							<Route path={`${path}/pedidos/alterar/:id`} component={EditOrder} />
						
							<Route exact path={`${path}/produtos`} component={Products} />
							<Route path={`${path}/produtos/novo`} component={NewProduct} />
							<Route path={`${path}/produtos/alterar/:id`} component={EditProduct} />

							<Route exact path={`${path}/categorias`} component={Categories} />
							<Route path={`${path}/categorias/nova`} component={NewCategory} />
							<Route path={`${path}/categorias/alterar/:id`} component={EditCategory} />
						
							<Route exact path={`${path}/campanhas`} component={Campaigns} />
							<Route path={`${path}/campanhas/nova`} component={NewCampaign} />
							<Route path={`${path}/campanhas/alterar/:id`} component={EditCampaign} />
						
							<Route exact path={`${path}/usuarios`} component={Users} />
							<Route path={`${path}/pessoas/alterar/:id`} component={EditPeople} />
							<ProtectedRoute role='master' exact path={`${path}/pessoas`} component={People} />
							<ProtectedRoute role='master' path={`${path}/pessoas/nova`} component={NewPeople} />

							<Route path={`${path}/pontuacao`} component={Ratings} />
						
							<Route path={`${path}/configuracoes`} component={Settings} />

							<ProtectedRoute exact role='master' path={`${path}/empresas`} component={Companies} />
							<ProtectedRoute role='master' path={`${path}/empresas/novo`} component={NewCompany} />
							<ProtectedRoute role='master' path={`${path}/empresas/alterar/:id`} component={EditCompany} />

							<ProtectedRoute role='master' exact path={`${path}/ramos`} component={CompanyTypes} />
							<ProtectedRoute role='master' path={`${path}/ramos/novo`} component={NewType} />
							<ProtectedRoute role='master' path={`${path}/ramos/alterar/:id`} component={EditType} />
						</Switch>
					</Main>
				</Container>
			</SnackbarProvider>
		</ThemeProvider>
	)
}