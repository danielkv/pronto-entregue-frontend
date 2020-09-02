import React from 'react'
import { Route } from 'react-router-dom';

import { useLoggedUserRole } from '../../controller/hooks';

export default function ProtectedRoute(props) {
	const loggedUserRole = useLoggedUserRole();

	const permissions = ['master', props.role];

	if (!permissions.includes(loggedUserRole)) return false;

	return <Route {...props} />
}
