import React, { useEffect, useRef } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { useQuery } from '@apollo/react-hooks';
import { useSnackbar } from 'notistack';

import ProtectedRoute from '../components/ProtectedRoute';
import { Container, HeaderArea, NavigationArea, Main } from '../layout/components';

import { useSelectedCompany } from '../controller/hooks';
import NotificationsController from '../controller/notifications';
import OrderController from '../controller/order';
import Header from '../layout/header';
import Navigation from '../layout/navigation';
import AllOrders from '../pages/allOrders';
import Categories from '../pages/categories';
import EditCategory from '../pages/categories/edit_category';
import NewCategory from '../pages/categories/new_category';
import Companies from '../pages/companies';
import EditCompany from '../pages/companies/edit_company';
import NewCompany from '../pages/companies/new_company';
import CompanyTypes from '../pages/companyTypes';
import EditType from '../pages/companyTypes/edit_type';
import NewType from '../pages/companyTypes/new_type';
import Coupons from '../pages/coupons';
import EditCoupon from '../pages/coupons/edit_coupon';
import NewCoupon from '../pages/coupons/new_coupon';
import Dashboard from '../pages/dashboard';
import Deliveries from '../pages/deliveries';
import DeliveryMen from '../pages/deliveryMen';
import Orders from '../pages/orders';
import EditOrder from '../pages/orders/edit_order';
import NewOrder from '../pages/orders/new_order';
import People from '../pages/people';
import EditPeople from '../pages/people/edit_people';
import NewPeople from '../pages/people/new_people';
import Users from '../pages/people/users';
import Products from '../pages/products';
import EditProduct from '../pages/products/edit_product';
import NewProduct from '../pages/products/new_product';
import Reports from '../pages/reports';
import SendNotification from '../pages/sendNotification';
//import Ratings from '../pages/ratings';
import Settings from '../pages/settings';

import { GET_COMPANY_CONFIG } from '../graphql/companies';

export default function DashboardPages() {
	const { path } = useRouteMatch();
	const { enqueueSnackbar } = useSnackbar();
	const selectedCompany = useSelectedCompany();
	const notificationRef = useRef();
	
	function playNotification() {
		if (!notificationRef.current) return;
		notificationRef.current.load()
		notificationRef.current.play()
	}

	const { data: { companyConfig: { notificationSound = null } = {} } = {}, loading: loadingSound } = useQuery(GET_COMPANY_CONFIG, { variables: { companyId: selectedCompany, keys: ['notificationSound'] }, fetchPolicy: 'cache-first' });

	useEffect(()=>{
		NotificationsController.addHandler('enqueueSnack', (payload)=>{
			let options = { variant: 'default', sound: false };
			
			if (payload.data && payload.data.sound) options.sound = payload.data.sound;

			if (payload.data && payload.data.action && payload.data.action === 'statusChange' && payload.data.newStatus) {
				options.variant = OrderController.statusVariant(payload.data.newStatus);
			} else {
				if (payload.data && payload.data.options) options = payload.data.options;
			}
			enqueueSnackbar(payload.notification.body, options);

			if (options.sound) playNotification();
		})

		return ()=>{
			NotificationsController.removeHandler('enqueueSnack')
		}
	})
	
	return (
		<Container>
			{!loadingSound && <audio ref={notificationRef}>
				<source src={notificationSound.url} />
			</audio>}
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
						
					<Route exact path={`${path}/cupons`} component={Coupons} />
					<Route path={`${path}/cupons/nova`} component={NewCoupon} />
					<Route path={`${path}/cupons/alterar/:id`} component={EditCoupon} />
						
					<Route exact path={`${path}/usuarios`} component={Users} />
					<Route path={`${path}/pessoas/alterar/:id`} component={EditPeople} />

					<ProtectedRoute role='master' exact path={`${path}/pessoas`} component={People} />
					<ProtectedRoute role='master' path={`${path}/pessoas/nova`} component={NewPeople} />

					<ProtectedRoute role='master' path={`${path}/enviar-notificacoes`} component={SendNotification} />

					{/* <Route path={`${path}/pontuacao`} component={Ratings} /> */}
						
					<Route path={`${path}/configuracoes`} component={Settings} />

					<ProtectedRoute exact role='master' path={`${path}/entregas`} component={Deliveries} />
					<ProtectedRoute exact role='master' path={`${path}/entregadores`} component={DeliveryMen} />
					<ProtectedRoute exact role='master' path={`${path}/todos-pedidos`} component={AllOrders} />
					<ProtectedRoute exact role='master' path={`${path}/empresas`} component={Companies} />
					<ProtectedRoute role='master' path={`${path}/relatorios`} component={Reports} />
					<ProtectedRoute role='master' path={`${path}/empresas/novo`} component={NewCompany} />
					<ProtectedRoute role='master' path={`${path}/empresas/alterar/:id`} component={EditCompany} />

					<ProtectedRoute role='master' exact path={`${path}/ramos`} component={CompanyTypes} />
					<ProtectedRoute role='master' path={`${path}/ramos/novo`} component={NewType} />
					<ProtectedRoute role='master' path={`${path}/ramos/alterar/:id`} component={EditType} />
				</Switch>
			</Main>
		</Container>
	)
}