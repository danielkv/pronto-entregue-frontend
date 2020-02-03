import React from 'react'
import { Route } from 'react-router-dom';

import { useLoggedUserRole } from '../../controller/hooks';

export default function ProtectedRoute(props) {
	const loggedUserRole = useLoggedUserRole();

	console.log(props)

	if (props.role !== loggedUserRole) return false;

	return <Route {...props} />
}
