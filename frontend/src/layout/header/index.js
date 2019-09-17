import React from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import Icon from '@mdi/react';
import { mdiStore, mdiSourceBranch  } from '@mdi/js';
import {useQuery, useMutation} from '@apollo/react-hooks';

import {HeaderContainer, LogoContainer, SelectContainer} from './styles';
import mainLogo from '../../assets/images/logo.png';
import { GET_USER_COMPANIES, GET_SELECTED_COMPANY, SELECT_COMPANY} from '../../graphql/companies';
import { GET_SELECTED_BRANCH, SELECT_BRANCH, GET_USER_BRANCHES} from '../../graphql/branches';

export default function Header () {

	const {data:companiesData} = useQuery(GET_USER_COMPANIES);
	const {data:selectedCompanyData} = useQuery(GET_SELECTED_COMPANY);
	const {data:branchesData} = useQuery(GET_USER_BRANCHES);
	const {data:selectedBranchData} = useQuery(GET_SELECTED_BRANCH);

	const [selectCompany] = useMutation(SELECT_COMPANY);
	const [selectBranch] = useMutation(SELECT_BRANCH);

	return (
		<HeaderContainer>
			<LogoContainer>
				<img src={mainLogo} alt='Flakery' />
			</LogoContainer>
			
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
					{(!selectedBranchData || !branchesData || !branchesData.userBranches.length) ? 'Nenhuma filial' : 
					<Select
						disableUnderline={true}
						value={selectedBranchData ? selectedBranchData.selectedBranch : ''}
						onChange={(e)=>selectBranch({variables:{id:e.target.value}})}
						inputProps={{
							name: 'Filial',
							id: 'Filial',
						}}>
						{
							branchesData.userBranches.map(branch=>{
								return <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>;
							})
						}
					</Select>}
				</FormControl>
			</SelectContainer>
		</HeaderContainer>
	)
}