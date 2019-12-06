import React, { useState, Fragment, useRef, useEffect } from 'react';
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

const initialFilter = {
	showInactive: false,
	search: '',
}

function Page (props) {
	setPageTitle('Estoque');
	
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
	const clearFilterForm = (e) => {
		setFilter(initialFilter);
	}

	const {data: { selectedCompany }, loading:loadingSelectedData } = useQuery(GET_SELECTED_COMPANY);
	const { 
		data: { company: { countItems = 0, items = [] } = {} } = {},
		loading:loadingItems,
		error,
		called,
	} = useQuery(GET_COMPANY_ITEMS, {
		variables: {
			id: selectedCompany,
			filter,
			pagination,
		},
	});
	
	const [setItemEnabled, {loading}] = useMutation(UPDATE_ITEM);
	
	if (error) return <ErrorBlock error={error} />
	if (loadingSelectedData || (loadingItems && !called)) return (<LoadingBlock />);

	return (
		<Fragment>
			<Content>
				{loadingItems ? <LoadingBlock /> :
				<Block>
					<BlockHeader>
						<BlockTitle>Estoque</BlockTitle>
						<Button size='small' variant="contained" color='secondary' to='/estoque/novo' component={Link}>Adicionar</Button> {loading && <Loading />}
						<NumberOfRows>{countItems} itens</NumberOfRows>
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
								{items.map(row => (
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
							count={countItems}
							
							backIconButtonProps={{
								'aria-label': 'previous page',
							}}
							nextIconButtonProps={{
								'aria-label': 'next page',
							}}
							rowsPerPage={pagination.rowsPerPage}
							page={pagination.page}
							onChangePage={(e, newPage)=>{setPagination({ ...pagination, page: newPage })}}
							onChangeRowsPerPage={(e)=>{setPagination({...pagination, page: 0, rowsPerPage: e.target.value });}}
							/>
					</Paper>
					<NumberOfRows>{countItems} itens</NumberOfRows>
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
											<Button
												type='submit'
												variant="contained"
												color='primary'
											>Aplicar</Button>
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