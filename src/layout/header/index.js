import React, { Fragment } from 'react';
import { FormControl, Select, MenuItem, Fab } from '@material-ui/core';
import Icon from '@mdi/react';
import { mdiStore, mdiSourceBranch, mdiLogout, mdiAccountCircle } from '@mdi/js';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {useHistory} from 'react-router-dom';

import {Loading} from '../components';
import {HeaderContainer, LogoContainer, SelectContainer, RightSide, LoggedUser} from './styles';
import mainLogo from '../../assets/images/logo.png';
import { GET_USER_COMPANIES, GET_SELECTED_COMPANY, SELECT_COMPANY} from '../../graphql/companies';
import { GET_SELECTED_BRANCH, SELECT_BRANCH, GET_COMPANY_BRANCHES} from '../../graphql/branches';
import { logUserOut } from '../../services/init';
import { LOGGED_USER } from '../../graphql/authentication';

export default function Header () {

	const history = useHistory();
	const {data:loggedUserData, loading:loadingLoggedUser} = useQuery(LOGGED_USER);

	const {data:companiesData, loading:loadingCompanies} = useQuery(GET_USER_COMPANIES);
	const {data:selectedCompanyData} = useQuery(GET_SELECTED_COMPANY);

	const {data:branchesData, loading:loadingBranches} = useQuery(GET_COMPANY_BRANCHES, {variables:{id:selectedCompanyData.selectedCompany}});
	const {data:selectedBranchData} = useQuery(GET_SELECTED_BRANCH);

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
						{(!selectedCompanyData || !companiesData || !companiesData.userCompanies.length) ? 'Nenhuma empresa' : 
						<Select
							disableUnderline={true}
							value={selectedCompanyData ? selectedCompanyData.selectedCompany : ''}
							onChange={(e)=>selectCompany({variables:{id:e.target.value}})}
							inputProps={{
								name: 'company',
								id: 'company',
							}}
						>	
							{
								companiesData.userCompanies.map(company=>{
									return <MenuItem key={company.id} value={company.id}>{company.display_name}</MenuItem>;
								})
							}
						</Select>}
					</FormControl>
				</SelectContainer>
				<SelectContainer>
					<Icon path={mdiSourceBranch} size='24' color='#D41450' />
					<FormControl fullWidth={false}>
						{(!selectedBranchData || !branchesData || !branchesData.company.branches.length) ? 'Nenhuma filial' : 
						<Select
							disableUnderline={true}
							value={selectedBranchData ? selectedBranchData.selectedBranch : ''}
							onChange={(e)=>selectBranch({variables:{id:e.target.value}})}
							inputProps={{
								name: 'Filial',
								id: 'Filial',
							}}>
							{
								branchesData.company.branches.map(branch=>{
									return <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>;
								})
							}
						</Select>}
					</FormControl>
				</SelectContainer>
			</Fragment>}
			{loadingLoggedUser || (!loggedUserData && !loggedUserData) ? <Loading /> :
			<RightSide>
				<LoggedUser>
					<Icon path={mdiAccountCircle} color='#999' size='24' />
					<span>{loggedUserData.me.full_name} <small>({loggedUserData.me.email})</small></span>
				</LoggedUser>
				<Fab onClick={handleLogout} variant='extended' size='medium' color='secondary'><Icon path={mdiLogout} size='20' color='#fff' /> Logout</Fab>
			</RightSide>}
		</HeaderContainer>
	)
}