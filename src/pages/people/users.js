import React, { useState, Fragment, useEffect, useRef } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableRow, TableCell, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button, Checkbox, FormControl, FormLabel , FormGroup, CircularProgress, Avatar } from '@material-ui/core';
import { mdiFilter } from '@mdi/js';
import Icon from '@mdi/react';
import moment from 'moment';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, SidebarContainer, Sidebar } from '../../layout/components';

import { useSelectedCompany } from '../../controller/hooks';
import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';

import { GET_COMPANY_USERS, UPDATE_USER } from '../../graphql/users';

const initialFilter = {
	showInactive: false,
	search: '',
}

function Page () {
	setPageTitle('Usuários');

	const searchRef = useRef(null);
	const [filter, setFilter] = useState(initialFilter);
	const [pagination, setPagination] = useState({
		page: 0,
		rowsPerPage: 10,
	});

	useEffect(()=>{
		setPagination((pagination) => ({ ...pagination, page: 0 }));
	}, [filter]);

	const submitFilterForm = (e) => {
		e.preventDefault();

		setFilter({
			...filter,
			search: searchRef.current.value
		})
	}
	const clearFilterForm = () => {
		setFilter(initialFilter);
	}

	//carrega empresa selecionada
	const selectedCompany = useSelectedCompany();

	//carrega usuários
	const {
		data: { company: { countUsers = 0, users = [] } = {} } = {},
		loading: loadingUsersData,
		error,
		called,
	} = useQuery(GET_COMPANY_USERS, { variables: { id: selectedCompany, filter, pagination } });

	const [setUserEnabled, { loading }] = useMutation(UPDATE_USER, { variables: { companyId: selectedCompany } });

	if (error) return <ErrorBlock error={getErrors(error)} />
	if (loadingUsersData && !called) return (<LoadingBlock />);

	return (
		<Fragment>
			<Content>
				{loadingUsersData ? <LoadingBlock /> :
					<Block>
						<BlockHeader>
							<BlockTitle>Usuários</BlockTitle>
							{loading && <CircularProgress />}
							<NumberOfRows>{countUsers} usuários</NumberOfRows>
						</BlockHeader>
						<Paper>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell style={{ width: 30, paddingLeft: 30 }}></TableCell>
										<TableCell>Nome</TableCell>
										<TableCell>Criada em</TableCell>
										<TableCell style={{ width: 100 }}>Ações</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{users.map(row => (
										<TableRow key={row.id}>
											<TableCell style={{ width: 30, paddingLeft: 30, paddingRight: 10 }}>
												<Avatar src={row.image} />
											</TableCell>
											<TableCell>{row.fullName}</TableCell>
											<TableCell>{moment(row.createdAt).format('DD/MM/YY')}</TableCell>
											<TableCell>
												<Switch
													checked={row.active}
													onChange={()=>setUserEnabled({ variables: { id: row.id, data: { active: !row.active } } })}
													value="checkedB"
													disabled={loading}
													size='small'
													color="secondary"
													inputProps={{ 'aria-label': 'primary checkbox' }}
												/>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							<TablePagination
								component="div"
								backIconButtonProps={{
									'aria-label': 'previous page',
								}}
								nextIconButtonProps={{
									'aria-label': 'next page',
								}}
								count={countUsers}
								rowsPerPage={pagination.rowsPerPage}
								page={pagination.page}
								onChangePage={(e, newPage)=>{setPagination({ ...pagination, page: newPage })}}
								onChangeRowsPerPage={(e)=>{setPagination({ ...pagination, page: 0, rowsPerPage: e.target.value });}}
							/>
						</Paper>
						<NumberOfRows>{countUsers} usuários</NumberOfRows>
					</Block>}
			</Content>
			<SidebarContainer>
				<Block>
					<BlockHeader>
						<BlockTitle><Icon path={mdiFilter} size={1} color='#D41450' /> Filtros</BlockTitle>
						<FormControlLabel
							control={
								<Switch
									size='small'
									color='primary'
									checked={filter.showInactive}
									onChange={()=>setFilter({ ...filter, showInactive: !filter.showInactive })}
									value={filter.showInactive}
								/>
							}
							label="Incluir inativos"
						/>
					</BlockHeader>
					<Sidebar>
						<form noValidate onSubmit={submitFilterForm}>
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<TextField
											label='Buscar'
											inputRef={searchRef}
										/>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<FormControl component="fieldset">
											<FormLabel component="legend">Função</FormLabel>
											<FormGroup>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="waiting" />}
													label="Administrador"
												/>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="preparing" />}
													label="Gerente de filiais"
												/>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="delivering" />}
													label="Gerente"
												/>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="delivered" />}
													label="Vendedor"
												/>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="canceled" />}
													label="Consumidor"
												/>
											</FormGroup>
										</FormControl>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<ButtonGroup fullWidth>
											<Button type='reset' onClick={clearFilterForm} color='primary'>Limpar</Button>
											<Button variant="contained" type='submit' color='primary'>Aplicar</Button>
										</ButtonGroup>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
						</form>
					</Sidebar>
				</Block>
			</SidebarContainer>
		</Fragment>
	)
}

export default Page;