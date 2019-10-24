import { hot } from 'react-hot-loader/root';
import React from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';

import {useInitialize} from './services/init';
import Login from './pages/login';
import RoutesFrame from './routes-frame';
import { LoadingBlock, ErrorBlock } from './layout/blocks';

const Routes = ()  => {
	const {error, loading, authenticated} = useInitialize(true);

	if (loading) return <LoadingBlock />;
	if (error) return <ErrorBlock error={error} />;

	return (
		<BrowserRouter>
			<Switch>
				<Route path='/login'>
					{authenticated !== true ? <Login /> : <Redirect to='/' />}
				</Route>

				<Route path='/' >
					{authenticated === true ? <RoutesFrame /> : <Redirect to='/login' />}
				</Route>
			</Switch>
		</BrowserRouter>
	);
}

export default hot(Routes);