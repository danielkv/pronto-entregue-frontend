import React, { Fragment } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { FormControl, Select, MenuItem, CircularProgress, Button, Typography, Chip } from '@material-ui/core';
import { mdiStore, mdiLogout, mdiAccountCircle } from '@mdi/js';
import Icon from '@mdi/react';

import AutoOrders from '../../components/AutoOrders';

import mainLogo from '../../assets/images/logo.png';
import { useSelectedCompany } from '../../controller/hooks';
import { logUserOut } from '../../services/init';
import { HeaderContainer, LogoContainer, SelectContainer, RightSide, LoggedUser } from './styles';

import { LOGGED_USER_ID, GET_USER } from '../../graphql/authentication';
import { GET_USER_COMPANIES, SET_SELECTED_COMPANY, COMPANY_IS_OPEN } from '../../graphql/companies';

export default function Header () {
	const history = useHistory();
	const { url } = useRouteMatch();
	const dashboardUrl = '/' + url.substr(1).split('/')[0];
	
	const { data: { loggedUserId } } = useQuery(LOGGED_USER_ID);
	const { data: { user = {} } = {}, loading: loadingLoggedUser } = useQuery(GET_USER, { variables: { id: loggedUserId } });

	const {
		data: { user: { companies = [] } = {} } = {},
		loading: loadingCompanies,
	} = useQuery(GET_USER_COMPANIES, { variables: { id: loggedUserId } });
	
	const selectedCompany = useSelectedCompany();
	const [setSelectCompany] = useMutation(SET_SELECTED_COMPANY);

	const { data: { company = null } = {}, loading: loadingCompany } = useQuery(COMPANY_IS_OPEN, { variables: { id: selectedCompany }, pollInterval: 45000 });

	function handleLogout () {
		logUserOut();
		history.push(`${dashboardUrl}/login`);
	}

	return (
		<HeaderContainer>
			<LogoContainer>
				<img src={mainLogo} alt='Pronto, Entregue!' style={{ height: 'auto', width: 40 }} />
			</LogoContainer>
			{loadingCompanies ? <CircularProgress /> :
				<Fragment>
					<SelectContainer>
						<Icon path={mdiStore} size={1} color='#D41450' />
						{companies.length > 1
							? (<FormControl fullWidth={false}>
								{(!selectedCompany || !companies.length) ? 'Nenhuma empresa' :
									<Select
										disableUnderline={true}
										value={selectedCompany || ''}
										onChange={(e)=>setSelectCompany({ variables: { id: e.target.value } })}
										inputProps={{
											name: 'company',
											id: 'company',
										}}
									>
										{
											companies.map(company=>{
												return <MenuItem key={company.id} value={company.id}>{company.displayName}</MenuItem>;
											})
										}
									</Select>}
							</FormControl>)
							: (
								<Typography>{companies[0].displayName}</Typography>
							)}

						<div style={{ marginLeft: 10 }}>
							{loadingCompany && company === null ? <CircularProgress color='primary' /> : <Chip variant={company.isOpen ? 'default' : 'outlined'} label={company.isOpen ? 'Aberto' : 'Fechado'} color={company.isOpen ? 'secondary' : 'primary'} />}
						</div>
						<div style={{ marginLeft: 10 }}>
							<AutoOrders />
						</div>
					</SelectContainer>
				</Fragment>}
			{loadingLoggedUser || !user ? <CircularProgress /> :
				<RightSide>
					{/* <Notification /> */}
					<LoggedUser>
						<Icon  path={mdiAccountCircle} color='#999'  size={1} />
						<span>{user.full_name} <small>({user.email})</small></span>
					</LoggedUser>
					<Button onClick={handleLogout} variant='contained' color='primary' startIcon={<Icon path={mdiLogout} size={1} color='#fff' />}>Logout</Button>
				</RightSide>}
		</HeaderContainer>
	)
}