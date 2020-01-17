import React, { useState, Fragment, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button } from '@material-ui/core';
import { mdiStore, mdiPencil, mdiFilter } from '@mdi/js';
import Icon from '@mdi/react';
import numeral from 'numeral';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, SidebarContainer, Sidebar, Loading } from '../../layout/components';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';

import { LOGGED_USER_ID } from '../../graphql/authentication';
import { GET_USER_COMPANIES, UPDATE_COMPANY } from '../../graphql/companies';


const initialFilter = {
	showInactive: false,
	search: '',
}

function Page (props) {
	setPageTitle('Empresas');

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

	const { data: { loggedUserId } } = useQuery(LOGGED_USER_ID);
	const {
		data: { user: { countCompanies = 0, companies = [] } = {} } = {},
		loading: loadingCompanies,
		error,
		called,
	} = useQuery(GET_USER_COMPANIES, { variables: { id: loggedUserId, filter, pagination } });

	const [setCompanyEnabled, { loading }] = useMutation(UPDATE_COMPANY, { refetchQueries: [{ query: GET_USER_COMPANIES, variables: { id: loggedUserId, filter, pagination } }] });

	if (error) return <ErrorBlock error={getErrors(error)} />
	if (loadingCompanies && !called) return (<LoadingBlock />);

	return (
		<Fragment>
			<Content>
				{loadingCompanies ? <LoadingBlock /> :
					<Block>
						<BlockHeader>
							<BlockTitle>Empresas</BlockTitle>
							<Button size='small' variant="contained" color='secondary' to='/empresas/novo' component={Link}>Adicionar</Button>{loading && <Loading />}
							<NumberOfRows>{countCompanies} empresas</NumberOfRows>
						</BlockHeader>
						<Paper>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell style={{ width: 30, paddingRight: 10 }}></TableCell>
										<TableCell>Empresa</TableCell>
										<TableCell>Faturamento último mês</TableCell>
										{/* <TableCell>Número de filiais</TableCell> */}
										<TableCell>Criada em</TableCell>
										<TableCell style={{ width: 100 }}>Ações</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{companies.map(row => (
										<TableRow key={row.id}>
											<TableCell style={{ width: 30, paddingLeft: 40, paddingRight: 10 }}><Icon path={mdiStore} size='20' color='#BCBCBC' /></TableCell>
											<TableCell>{row.name}</TableCell>
											<TableCell>{numeral(row.last_month_revenue).format('$0,0.00')}</TableCell>
											<TableCell>{row.createdAt}</TableCell>
											<TableCell>
												<IconButton disabled={loading} onClick={()=>{props.history.push(`/empresas/alterar/${row.id}`)}}>
													<Icon path={mdiPencil} size='18' color='#363E5E' />
												</IconButton>
												<Switch
													disabled={loading}
													checked={row.active}
													onChange={()=>setCompanyEnabled({ variables: { id: row.id, data: { active: !row.active } } })}
													value="checkedB"
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
								count={countCompanies}
								rowsPerPage={pagination.rowsPerPage}
								page={pagination.page}
								onChangePage={(e, newPage)=>{setPagination({ ...pagination, page: newPage })}}
								onChangeRowsPerPage={(e)=>{setPagination({ ...pagination, page: 0, rowsPerPage: e.target.value });}}
							/>
						</Paper>
						<NumberOfRows>{companies.length} empresas</NumberOfRows>
					</Block>}
			</Content>
			<SidebarContainer>
				<Block>
					<BlockHeader>
						<BlockTitle><Icon path={mdiFilter} size='18' color='#D41450' /> Filtros</BlockTitle>
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
										<ButtonGroup fullWidth>
											<Button type='reset' onClick={clearFilterForm} color='primary'>Limpar</Button>
											<Button type='submit' variant="contained" color='primary'>Aplicar</Button>
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