import React, {useState, Fragment, useEffect, useRef} from 'react';
import {Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button } from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiStore, mdiPencil, mdiFilter} from '@mdi/js';
import {Link} from 'react-router-dom';
import numeral from 'numeral';
import { useQuery, useMutation } from '@apollo/react-hooks';

import {setPageTitle} from '../../utils';
import {LoadingBlock, ErrorBlock} from '../../layout/blocks';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, SidebarContainer, Sidebar, Loading} from '../../layout/components';

import { GET_USER_COMPANIES, UPDATE_COMPANY} from '../../graphql/companies';
import { LOGGED_USER_ID } from '../../graphql/authentication';

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
		setPagination((pagination)=>({ ...pagination, page: 0 }));
	}, [filter])

	const { data: { loggedUserId }} = useQuery(LOGGED_USER_ID);
	const {
		data: { user: { companies = [] } = {} } = {},
		loading: loadingCompaniesData,
		error
	} = useQuery(GET_USER_COMPANIES, { variables: { id: loggedUserId, filter, pagination } });

	const [setCompanyEnabled, { loading }] = useMutation(UPDATE_COMPANY);

	if (error) return <ErrorBlock error={error} />
	if (loadingCompaniesData) return (<LoadingBlock />);

	return (
		<Fragment>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Empresas</BlockTitle>
						<Button size='small' variant="contained" color='secondary' to='/empresas/novo' component={Link}>Adicionar</Button>{loading && <Loading />}
						<NumberOfRows>{companies.length} empresas</NumberOfRows>
					</BlockHeader>
					<Paper>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell style={{width:30, paddingRight:10}}></TableCell>
									<TableCell>Empresa</TableCell>
									<TableCell>Faturamento último mês</TableCell>
									{/* <TableCell>Número de filiais</TableCell> */}
									<TableCell>Criada em</TableCell>
									<TableCell style={{width:100}}>Ações</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{companies.map(row => (
									<TableRow key={row.id}>
										<TableCell style={{width:30, paddingLeft:40, paddingRight:10}}><Icon path={mdiStore} size='20' color='#BCBCBC' /></TableCell>
										<TableCell>{row.name}</TableCell>
										<TableCell>{numeral(row.last_month_revenue).format('$0,0.00')}</TableCell>
										{/* <TableCell><CircleNumber>{row.branches.length}</CircleNumber></TableCell> */}
										<TableCell>{row.createdAt}</TableCell>
										<TableCell>
											<IconButton disabled={loading} onClick={()=>{props.history.push(`/empresas/alterar/${row.id}`)}}>
												<Icon path={mdiPencil} size='18' color='#363E5E' />
											</IconButton>
											<Switch
												disabled={loading}
												checked={row.active}
												onChange={()=>setCompanyEnabled({variables:{id:row.id, data:{active:!row.active}}})}
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
							count={companies.length}
							backIconButtonProps={{
								'aria-label': 'previous page',
							}}
							nextIconButtonProps={{
								'aria-label': 'next page',
							}}
							rowsPerPage={pagination.rowsPerPage}
							page={pagination.page}
							onChangePage={(e, newPage)=>{setPagination({ ...pagination, page: newPage })}}
							onChangeRowsPerPage={(e)=>{setPagination({...pagination, rowsPerPage: e.target.value });}}
							/>
					</Paper>
					<NumberOfRows>{companies.length} empresas</NumberOfRows>
				</Block>
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
						<form noValidate>
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<TextField
											label='Buscar'
											onChange={(event)=>{}}
											inputRef={searchRef}
											/>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<ButtonGroup fullWidth>
											<Button color='primary'>Limpar</Button>
											<Button variant="contained" color='primary'>Aplicar</Button>
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