import { hot } from 'react-hot-loader/root';
import React, { useState } from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import {init} from './services/init';

import Login from './pages/login';
import RoutesFrame from './routes-frame';

//import { Loading } from './layout/components';
import { LoadingBlock } from './layout/blocks';
import { IS_USER_LOGGED_IN } from './graphql/authentication';

const Routes = (props)  => {
	const [loaded, setLoaded] = useState(false);

	const {data:userLoggedInData} = useQuery(IS_USER_LOGGED_IN);

	function load() {
		init()
		.then(()=>{
			setLoaded(true);
		})
	}

	if (!loaded) {
		load();
		return <LoadingBlock />;
	}

	return (
		<BrowserRouter>
			<Switch>
				<Route path='/login' component={Login} />

				<Route path='/' component={userLoggedInData.isUserLoggedIn === true ? RoutesFrame : <Redirect to='/login' />} />				
			</Switch>
		</BrowserRouter>
	);
}

export default hot(Routes);