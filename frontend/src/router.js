import { hot } from 'react-hot-loader/root';
import React from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';

import {useInitialize} from './services/init';

import Login from './pages/login';
import RoutesFrame from './routes-frame';

//import { Loading } from './layout/components';
import { LoadingBlock } from './layout/blocks';

const Routes = ()  => {
	const {loading, isUserLoggedIn} = useInitialize(true);

	if (loading) return <LoadingBlock />;

	return (
		<BrowserRouter>
			<Switch>
				<Route path='/login'>
					{isUserLoggedIn !== true ? <Login /> : <Redirect to='/' />}
				</Route>

				<Route path='/' >
					{isUserLoggedIn === true ? <RoutesFrame /> : <Redirect to='/login' />}
				</Route>
			</Switch>
		</BrowserRouter>
	);
}

export default hot(Routes);