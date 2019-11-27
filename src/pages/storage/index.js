import React, {useState, Fragment} from 'react';
import {Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button } from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiInbox , mdiPencil, mdiFilter} from '@mdi/js';
import {Link} from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';

import {setPageTitle} from '../../utils';
import {LoadingBlock, ErrorBlock} from '../../layout/blocks';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, SidebarContainer, Sidebar, Loading} from '../../layout/components';
import { GET_SELECTED_COMPANY } from '../../graphql/companies';
import { GET_COMPANY_ITEMS, UPDATE_ITEM } from '../../graphql/items';

function Page (props) {
	setPageTitle('Estoque');

	const {data:selectedCompanyData, loading:loadingSelectedData} = useQuery(GET_SELECTED_COMPANY);

	const {data:itemsData, loading:loadingItemsData, error} = useQuery(GET_COMPANY_ITEMS, {variables:{id:selectedCompanyData.selectedCompany}});
	const items = itemsData && itemsData.company.items.length ? itemsData.company.items : [];

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	
	const [setItemEnabled, {loading}] = useMutation(UPDATE_ITEM);
	
	if (error) return <ErrorBlock error={error} />
	if (loadingSelectedData || loadingItemsData) return (<LoadingBlock />);

	return (
		<Fragment>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Estoque</BlockTitle>
						<Button size='small' variant="contained" color='secondary' to='/estoque/novo' component={Link}>Adicionar</Button> {loading && <Loading />}
						<NumberOfRows>{items.length} itens</NumberOfRows>
					</BlockHeader>
					<Paper>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell style={{width:30, paddingRight:10}}></TableCell>
									<TableCell>Nome</TableCell>
									<TableCell style={{width:130}}>Criada em</TableCell>
									<TableCell style={{width:100}}>Ações</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
									<TableRow key={row.name}>
										<TableCell style={{width:30, paddingLeft:40, paddingRight:10}}><Icon path={mdiInbox} size='20' color='#BCBCBC' /></TableCell>
										<TableCell>{row.name}</TableCell>
										<TableCell>{row.createdAt}</TableCell>
										<TableCell>
											<IconButton onClick={()=>{props.history.push(`/estoque/alterar/${row.id}`)}}>
												<Icon path={mdiPencil} size='18' color='#363E5E' />
											</IconButton>
											<Switch
												checked={row.active}
												disabled={loading}
												onChange={()=>setItemEnabled({variables:{id:row.id, data:{active:!row.active}}})}
												value="checkedB"
												size='small'
												color="secondary"
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<TablePagination
							component="div"
							count={items.length}
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
					<NumberOfRows>{items.length} itens</NumberOfRows>
				</Block>
			</Content>
			<SidebarContainer>
				<Block>
					<BlockHeader>
						<BlockTitle><Icon path={mdiFilter} size='18' color='#D41450' /> Filtros</BlockTitle>
						<FormControlLabel
							control={
								<Switch size='small' color='primary' checked={false} onChange={()=>{}} value="includeDisabled" />
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