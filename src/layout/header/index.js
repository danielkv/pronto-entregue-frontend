import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { FormControl, Select, MenuItem, Fab } from '@material-ui/core';
import { mdiStore, mdiLogout, mdiAccountCircle } from '@mdi/js';
import Icon from '@mdi/react';

import { Loading } from '../components';

import mainLogo from '../../assets/images/logo.png';
import { logUserOut } from '../../services/init';
import Notification from '../notification';
import { HeaderContainer, LogoContainer, SelectContainer, RightSide, LoggedUser } from './styles';

import { LOGGED_USER_ID, GET_USER } from '../../graphql/authentication';
import { GET_USER_COMPANIES, GET_SELECTED_COMPANY, SET_SELECTED_COMPANY } from '../../graphql/companies';

export default function Header () {
	const history = useHistory();
	
	const { data: { loggedUserId } } = useQuery(LOGGED_USER_ID);
	const { data: { user = {} } = {}, loading: loadingLoggedUser } = useQuery(GET_USER, { variables: { id: loggedUserId } });

	const {
		data: { user: { companies = [] } = {} } = {},
		loading: loadingCompanies,
	} = useQuery(GET_USER_COMPANIES, { variables: { id: loggedUserId } });
	const { data: { selectedCompany } } = useQuery(GET_SELECTED_COMPANY);

	const [selectCompany] = useMutation(SET_SELECTED_COMPANY);

	function handleLogout () {
		logUserOut();
		history.push('/login');
	}

	return (
		<HeaderContainer>
			<LogoContainer>
				<img src={mainLogo} alt='Flakery' />
			</LogoContainer>
			{loadingCompanies ? <Loading /> :
				<Fragment>
					<SelectContainer>
						<Icon path={mdiStore} size='24' color='#D41450' />
						<FormControl fullWidth={false}>
							{(!selectedCompany || !companies.length) ? 'Nenhuma empresa' :
								<Select
									disableUnderline={true}
									value={selectedCompany || ''}
									onChange={(e)=>selectCompany({ variables: { id: e.target.value } })}
									inputProps={{
										name: 'company',
										id: 'company',
									}}
								>
									{
										companies.map(company=>{
											return <MenuItem key={company.id} value={company.id}>{company.display_name}</MenuItem>;
										})
									}
								</Select>}
						</FormControl>
					</SelectContainer>
				</Fragment>}
			{loadingLoggedUser || !user ? <Loading /> :
				<RightSide>
					<Notification />
					<LoggedUser>
						<Icon path={mdiAccountCircle} color='#999' size='24' />
						<span>{user.full_name} <small>({user.email})</small></span>
					</LoggedUser>
					<Fab onClick={handleLogout} variant='extended' size='medium' color='secondary'><Icon path={mdiLogout} size='20' color='#fff' /> Logout</Fab>
				</RightSide>}
		</HeaderContainer>
	)
}