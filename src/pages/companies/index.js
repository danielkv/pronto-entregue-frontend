import React, { useState, Fragment, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button, CircularProgress, Chip, Avatar } from '@material-ui/core';
import { mdiPencil, mdiFilter, mdiBellRing } from '@mdi/js';
import Icon from '@mdi/react';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import numeral from 'numeral';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, SidebarContainer, Sidebar } from '../../layout/components';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';

import { LOGGED_USER_ID } from '../../graphql/authentication';
import { GET_COMPANIES, UPDATE_COMPANY, SEND_NEW_COMPANY_NOTIFICATION } from '../../graphql/companies';

const initialFilter = {
	showInactive: false,
	search: '',
}

function Page ({ match: { url } }) {
	setPageTitle('Empresas');

	const searchRef = useRef(null);
	const [loadingNewCompanyNotification, setLoadingNewCompanyNotification] = useState(false);
	const [filter, setFilter] = useState(initialFilter);
	const { enqueueSnackbar } = useSnackbar();
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
		data: { countCompanies = 0, companies = [] } = {},
		loading: loadingCompanies,
		error,
		called,
	} = useQuery(GET_COMPANIES, { variables: { id: loggedUserId, filter, pagination } });

	const [setCompanyEnabled, { loading }] = useMutation(UPDATE_COMPANY, { refetchQueries: [{ query: GET_COMPANIES, variables: { filter, pagination } }] });
	const [sendNewCompanyNotification] = useMutation(SEND_NEW_COMPANY_NOTIFICATION);

	const handleSendNewCompanyNotification = (companyId) => () => {
		setLoadingNewCompanyNotification(companyId);
		sendNewCompanyNotification({ variables: { companyId } })
			.then(()=>{
				enqueueSnackbar(`Notificação enviada para todos usuários`, { variant: 'success' })
			})
			.catch((err)=>{
				enqueueSnackbar(getErrors(err), { variant: 'error' })
			})
			.finally(()=>setLoadingNewCompanyNotification(false))
	}

	if (error) return <ErrorBlock error={getErrors(error)} />
	if (loadingCompanies && !called) return (<LoadingBlock />);

	return (
		<Fragment>
			<Content>
				{loadingCompanies ? <LoadingBlock /> :
					<Block>
						<BlockHeader>
							<BlockTitle>Empresas</BlockTitle>
							<Button size='small' variant="contained" color='primary' to={`${url}/novo`} component={Link}>Adicionar</Button>{loading && <CircularProgress />}
							<NumberOfRows>{countCompanies} empresas</NumberOfRows>
						</BlockHeader>
						<Paper>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell style={{ width: 30, paddingRight: 10 }}></TableCell>
										<TableCell>Empresa</TableCell>
										<TableCell>Ramo</TableCell>
										<TableCell>Faturamento último mês</TableCell>
										<TableCell>Criada em</TableCell>
										<TableCell style={{ width: 150 }}>Ações</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{companies.map(row => (
										<TableRow key={row.id}>
											<TableCell style={{ width: 30, paddingLeft: 40, paddingRight: 10 }}><Avatar alt={row.displayName} src={row.image} /></TableCell>
											<TableCell>{row.displayName}</TableCell>
											<TableCell><Chip variant='outlined' label={row.type.name} /></TableCell>
											<TableCell>{numeral(row.lastMonthRevenue).format('$0,0.00')}</TableCell>
											<TableCell>{moment(row.createdAt).format('DD/MM/YY')}</TableCell>
											<TableCell>
												<IconButton disabled={loadingNewCompanyNotification === row.id} component={Link} onClick={handleSendNewCompanyNotification(row.id)}>
													<Icon path={mdiBellRing} size={1} color='#363E5E' />
												</IconButton>
												<IconButton disabled={loading} component={Link} to={`${url}/alterar/${row.id}`}>
													<Icon path={mdiPencil} size={1} color='#363E5E' />
												</IconButton>
												<Switch
													disabled={loading}
													checked={row.active}
													onChange={()=>setCompanyEnabled({ variables: { id: row.id, data: { active: !row.active } } })}
													value="checkedB"
													size='small'
													color='primary'
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
						<NumberOfRows>{countCompanies} empresas</NumberOfRows>
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