import React from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { LoadingBlock, ErrorBlock } from './layout/blocks';
import Login from './pages/login';
import RoutesFrame from './routes-frame';
import { useInitialize } from './services/init';
import { getErrors } from './utils/error';

const Routes = ()  => {
	const { error, loading, isUserLoggedIn } = useInitialize(true);

	if (loading) return <LoadingBlock />;
	if (error) return <ErrorBlock error={getErrors(error)} />;

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