import React, { useState } from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import Icon from '@mdi/react';
import { mdiStore, mdiSourceBranch  } from '@mdi/js';

import {HeaderContainer, LogoContainer, SelectContainer} from './styles';
import mainLogo from '../../assets/images/logo.png';

export default function Header () {
	const [company, setCompany] = useState('');
	const [branch, setBranch] = useState('');

	function selectCompany(event) {	
		setCompany(event.target.value);
	}
	function selectBranch(event) {	
		setBranch(event.target.value);
	}

	return (
		<HeaderContainer>
			<LogoContainer>
				<img src={mainLogo} alt='Flakery' />
			</LogoContainer>
			
			<SelectContainer>
				<Icon path={mdiStore} size='24' color='#D41450' />
				<FormControl>
					<Select
						value={company}
						onChange={selectCompany}
						inputProps={{
							name: 'company',
							id: 'company',
						}}
						>
						<MenuItem value='Empresa 1'>Empresa 1</MenuItem>
						<MenuItem value='Empresa 2'>Empresa 2</MenuItem>
						<MenuItem value='Empresa 3'>Empresa 3</MenuItem>
					</Select>
				</FormControl>
			</SelectContainer>
			<SelectContainer>
				<Icon path={mdiSourceBranch} size='24' color='#D41450' />
				<FormControl>
					<Select
						value={branch}
						onChange={selectBranch}
						inputProps={{
							name: 'Filial',
							id: 'Filial',
						}}>
						<MenuItem value='Filial 1'>Filial 1</MenuItem>
						<MenuItem value='Filial 2'>Filial 2</MenuItem>
						<MenuItem value='Filial 3'>Filial 3</MenuItem>
					</Select>
				</FormControl>
			</SelectContainer>
		</HeaderContainer>
	)
}