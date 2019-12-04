import React, { Fragment } from 'react';
import { FormControl, Select, MenuItem, Fab } from '@material-ui/core';
import Icon from '@mdi/react';
import { mdiStore, mdiSourceBranch, mdiLogout, mdiAccountCircle } from '@mdi/js';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {useHistory} from 'react-router-dom';

import {Loading} from '../components';
import { logUserOut } from '../../services/init';
import {HeaderContainer, LogoContainer, SelectContainer, RightSide, LoggedUser} from './styles';
import mainLogo from '../../assets/images/logo.png';

import { GET_USER_COMPANIES, GET_SELECTED_COMPANY, SELECT_COMPANY} from '../../graphql/companies';
import { GET_SELECTED_BRANCH, SELECT_BRANCH, GET_COMPANY_BRANCHES} from '../../graphql/branches';
import { LOGGED_USER_ID, GET_USER } from '../../graphql/authentication';

export default function Header () {
	const history = useHistory();
	
	const { data: { loggedUserId }} = useQuery(LOGGED_USER_ID);
	const {data: { user = {} } = {}, loading:loadingLoggedUser} = useQuery(GET_USER, { variables: { id: loggedUserId } });

	const {
		data: { user: { companies = [] } = {} } = {},
		loading: loadingCompanies,
	} = useQuery(GET_USER_COMPANIES, { variables: { id: loggedUserId } });
	const {data: { selectedCompany } } = useQuery(GET_SELECTED_COMPANY);

	const {
		data: { company: { branches = [] } = {} } = {},
		loading: loadingBranches,
	} = useQuery(GET_COMPANY_BRANCHES, {variables:{id: selectedCompany}});
	const {data: { selectedBranch } } = useQuery(GET_SELECTED_BRANCH);

	const [selectCompany] = useMutation(SELECT_COMPANY);
	const [selectBranch] = useMutation(SELECT_BRANCH);

	function handleLogout () {
		logUserOut();
		history.push('/login');
	}

	return (
		<HeaderContainer>
			<LogoContainer>
				<img src={mainLogo} alt='Flakery' />
			</LogoContainer>
			{loadingCompanies || loadingBranches ? <Loading /> :
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
				<SelectContainer>
					<Icon path={mdiSourceBranch} size='24' color='#D41450' />
					<FormControl fullWidth={false}>
						{(!selectedBranch || !branches.length) ? 'Nenhuma filial' : 
						<Select
							disableUnderline={true}
							value={selectedBranch || ''}
							onChange={(e)=>selectBranch({ variables: { id: e.target.value } })}
							inputProps={{
								name: 'Filial',
								id: 'Filial',
							}}>
							{
								branches.map(branch=>{
									return <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>;
								})
							}
						</Select>}
					</FormControl>
				</SelectContainer>
			</Fragment>}
			{loadingLoggedUser || !user ? <Loading /> :
			<RightSide>
				<LoggedUser>
					<Icon path={mdiAccountCircle} color='#999' size='24' />
					<span>{user.full_name} <small>({user.email})</small></span>
				</LoggedUser>
				<Fab onClick={handleLogout} variant='extended' size='medium' color='secondary'><Icon path={mdiLogout} size='20' color='#fff' /> Logout</Fab>
			</RightSide>}
		</HeaderContainer>
	)
}