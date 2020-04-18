import React, { useState, Fragment, useEffect, useRef } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button, CircularProgress, Chip, Avatar, Typography } from '@material-ui/core';
import { mdiPencil, mdiFilter, mdiLockReset } from '@mdi/js';
import Icon from '@mdi/react';
import moment from 'moment';
import { useSnackbar } from 'notistack';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, SidebarContainer, Sidebar } from '../../layout/components';

import { useSelectedCompany, useLoggedUserId } from '../../controller/hooks';
import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { getUserRoleLabel } from '../../utils/peoples';

import { GET_USERS, UPDATE_USER, SEND_NEW_PASSWORD_EMAIL } from '../../graphql/users';

const initialFilter = {
	showInactive: false,
	search: '',
}

function Page () {
	setPageTitle('Pessoas');
	const { url } = useRouteMatch();
	const { enqueueSnackbar } = useSnackbar();

	const loggedUserId = useLoggedUserId();

	const searchRef = useRef(null);
	const [filter, setFilter] = useState(initialFilter);
	const [pagination, setPagination] = useState({
		page: 0,
		rowsPerPage: 10,
	});

	const [loadingSendEmail, setLoadingSendEmail] = useState(false);
	const [sendNewPasswordEmail] = useMutation(SEND_NEW_PASSWORD_EMAIL);

	const handleSendNewPasswordEmail = (user) => () => {
		const userId = user.id;
		setLoadingSendEmail(userId)
		sendNewPasswordEmail({ variables: { userId } })
			.then(()=>{
				enqueueSnackbar(`Notificação enviada para ${user.fullName}`, { variant: 'success' })
			})
			.catch((err)=>{
				enqueueSnackbar(getErrors(err), { variant: 'error' })
			})
			.finally(()=>setLoadingSendEmail(false));
	}

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

	//carrega pessoas
	const {
		data: { countUsers = 0, users = [] } = {},
		loading: loadingUsersData,
		error,
		called,
	} = useQuery(GET_USERS, { variables: { filter, pagination } });

	const [setUserEnabled, { loading }] = useMutation(UPDATE_USER, { variables: { companyId: selectedCompany } });

	if (error) return <ErrorBlock error={getErrors(error)} />
	if (loadingUsersData && !called) return (<LoadingBlock />);

	return (
		<Fragment>
			<Content>
				{loadingUsersData ? <LoadingBlock /> :
					<Block>
						<BlockHeader>
							<BlockTitle>Pessoas</BlockTitle>
							<Button size='small' variant="contained" color='primary' to={`${url}/nova`} component={Link}>Adicionar</Button>{loading && <CircularProgress />}
							<NumberOfRows>{countUsers} pessoas</NumberOfRows>
						</BlockHeader>
						<Paper>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell style={{ width: 30, paddingLeft: 30 }}></TableCell>
										<TableCell><Typography variant='caption'>Nome</Typography></TableCell>
										<TableCell><Typography variant='caption'>Email</Typography></TableCell>
										<TableCell><Typography variant='caption'>Função</Typography></TableCell>
										<TableCell><Typography variant='caption'>Criada em</Typography></TableCell>
										<TableCell style={{ width: 140 }}><Typography variant='caption'>Ações</Typography></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{users.map(row => (
										<TableRow key={row.id}>
											<TableCell style={{ width: 30, paddingLeft: 30, paddingRight: 10 }}>
												<Avatar src={row.image} alt={row.fullName} />
											</TableCell>
											<TableCell><Typography variant='body2'>{row.fullName}</Typography></TableCell>
											<TableCell><a className='link' href={`mailto: ${row.email}`}><Typography variant='caption'>{row.email}</Typography></a></TableCell>
											<TableCell><Chip variant='outlined' label={getUserRoleLabel(row.role)} /></TableCell>
											<TableCell><Typography variant='body2'>{moment(row.createdAt).format('DD/MM/YY')}</Typography></TableCell>
											<TableCell>
												<div style={{ display: 'flex', alignItems: 'center' }}>
													{loadingSendEmail === row.id
														? <CircularProgress style={{ marginLeft: 14, marginRight: 14 }} size={20} color='primary' />
														: (
															<IconButton title='Enviar email para criação de nova senha' disabled={loadingSendEmail} component={Link} onClick={handleSendNewPasswordEmail(row)}>
																<Icon path={mdiLockReset} size={1} color='#aaa' />
															</IconButton>
														)}
													<IconButton disabled={loading} component={Link} to={(`${url}/alterar/${row.id}`)}>
														<Icon path={mdiPencil} size={1} color='#363E5E' />
													</IconButton>
													{row.id !== loggedUserId && row.role !== 'master' && (
														<Switch
															checked={row.active}
															onChange={()=>setUserEnabled({ variables: { id: row.id, data: { active: !row.active } } })}
															value="checkedB"
															disabled={loading}
															size='small'
															color='primary'
															inputProps={{ 'aria-label': 'primary checkbox' }}
														/>
													)}
												</div>
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
						<NumberOfRows>{countUsers} pessoas</NumberOfRows>
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