import React, {useState, Fragment} from 'react';
import {Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button } from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiStore, mdiPencil, mdiFilter} from '@mdi/js';
import {Link} from 'react-router-dom';
import numeral from 'numeral'
import { useQuery, useMutation} from '@apollo/react-hooks';

import {setPageTitle} from '../../utils';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, SidebarContainer, Sidebar, Loading} from '../../layout/components';
import {LoadingBlock, ErrorBlock} from '../../layout/blocks';
import { GET_SELECTED_COMPANY } from '../../graphql/companies';
import { GET_COMPANY_BRANCHES, UPDATE_BRANCH } from '../../graphql/branches';

function Page (props) {
	setPageTitle('Filiais');

	const [showInactive, setShowInactive] = useState(false);
	const { data: { selectedCompany }, loading: loadingSelectedData } = useQuery(GET_SELECTED_COMPANY);

	const { data: { company: { branches = [] } = {} } = {}, loading: loadingBranchesData, error } = useQuery(GET_COMPANY_BRANCHES, {
		variables:{
			id: selectedCompany,
			filter: { showInactive },
		},
	});

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	
	const [setBranchEnabled, { loading }] = useMutation(UPDATE_BRANCH);
	
	if (error) return <ErrorBlock error={error} />
	if (loadingSelectedData || loadingBranchesData) return (<LoadingBlock />);

	return (
		<Fragment>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Filiais</BlockTitle>
						<Button size='small' variant="contained" color='secondary' to='/filiais/novo' component={Link}>Adicionar</Button>{loading && <Loading />}
						<NumberOfRows>{branches.length} filiais</NumberOfRows>
					</BlockHeader>
					<Paper>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell style={{width:30, paddingRight:10}}></TableCell>
									<TableCell>Empresa</TableCell>
									<TableCell>Faturamento último mês</TableCell>
									{/* <TableCell>Número de pedidos</TableCell> */}
									<TableCell>Criada em</TableCell>
									<TableCell style={{width:100}}>Ações</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{branches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
									<TableRow key={row.name}>
										<TableCell style={{width:30, paddingLeft:40, paddingRight:10}}><Icon path={mdiStore} size='20' color='#BCBCBC' /></TableCell>
										<TableCell>{row.name}</TableCell>
										<TableCell>{numeral(row.revenue).format('$0,0.00')}</TableCell>
										<TableCell>{row.createdAt}</TableCell>
										<TableCell>
											<IconButton disabled={loading} onClick={()=>{props.history.push(`/filiais/alterar/${row.id}`)}}>
												<Icon path={mdiPencil} size='18' color='#363E5E' />
											</IconButton>
											<Switch
												checked={row.active}
												disabled={loading}
												onChange={()=>setBranchEnabled({variables:{id:row.id, data:{active:!row.active}}})}
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
							count={branches.length}
							rowsPerPage={rowsPerPage}
							page={page}
							backIconButtonProps={{
								'aria-label': 'previous page',
							}}
							nextIconButtonProps={{
								'aria-label': 'next page',
							}}
							onChangePage={(e, newPage)=>{setPage(newPage)}}
							onChangeRowsPerPage={(e)=>{setRowsPerPage(e.target.value); setPage(0);}}
							/>
					</Paper>
					<NumberOfRows>{branches.length} filiais</NumberOfRows>
				</Block>
			</Content>
			<SidebarContainer>
				<Block>
					<BlockHeader>
						<BlockTitle><Icon path={mdiFilter} size='18' color='#D41450' /> Filtros</BlockTitle>
						<FormControlLabel
							control={
								<Switch size='small' color='primary' checked={showInactive} onChange={()=>setShowInactive(!showInactive)} value={showInactive} />
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