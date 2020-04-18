import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { LoadScript } from '@react-google-maps/api';

import { LoadingBlock, ErrorBlock } from '../layout/blocks';
import Login from '../pages/login';
import { useInitialize } from '../services/init';
import { getErrors } from '../utils/error';
import DashboardPages from './dashboard-pages';

export default function DashboardRoutes() {
	const { error, loading, isUserLoggedIn } = useInitialize(true);

	if (loading) return <LoadingBlock />;
	if (error) return <ErrorBlock error={getErrors(error)} />;

	return (
		<LoadScript googleMapsApiKey={process.env.REACT_APP_GMAPS_KEY}>
			<Switch>
				<Route path='/dashboard/login'>
					{isUserLoggedIn !== true ? <Login /> : <Redirect to='/dashboard' />}
				</Route>

				<Route path='/dashboard' >
					{isUserLoggedIn === true ? <DashboardPages /> : <Redirect to='/dashboard/login' />}
				</Route>
			</Switch>
		</LoadScript>
	);
}