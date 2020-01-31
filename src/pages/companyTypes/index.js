import React, { useState, Fragment, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useMutation, useQuery } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button, CircularProgress, Chip, Avatar } from '@material-ui/core';
import { mdiPencil, mdiFilter } from '@mdi/js';
import Icon from '@mdi/react';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, SidebarContainer, Sidebar, DraggableCell } from '../../layout/components';

import { ErrorBlock, LoadingBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';

import { GET_COMPANY_TYPES, UPDATE_COMPANY_TYPE } from '../../graphql/companyTypes';

const initialFilter = {
	showInactive: false,
	search: '',
}

function Page (props) {
	setPageTitle('Categorias');

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
	
	const [updateCompanyType, { loading: loadingUpdating }] = useMutation(UPDATE_COMPANY_TYPE);
	
	const { data: { countCompanyTypes = 0, companyTypes = [] } = {}, loading: loadingCompanyTypes, error, called } = useQuery(GET_COMPANY_TYPES, {
		variables: { filter, pagination }
	});
	
	if (error) return <ErrorBlock error={getErrors(error)} />
	if (!called && loadingCompanyTypes) return (<LoadingBlock />);

	return (
		<Fragment>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Ramos de ativodade</BlockTitle>
						<Button size='small' variant="contained" color='secondary' to='/ramos/novo' component={Link}>Adicionar</Button> {loadingUpdating && <CircularProgress />}
						<NumberOfRows>{countCompanyTypes} ramos de atividade</NumberOfRows>
					</BlockHeader>
					<Paper>
						<Table style={{ tableLayout: 'auto', width: '100%' }}>
							<TableHead>
								<TableRow>
									<TableCell style={{ width: 50 }}></TableCell>
									<TableCell>Nome</TableCell>
									<TableCell >Empresas</TableCell>
									<TableCell style={{ width: 100 }}>Ações</TableCell>
								</TableRow>
							</TableHead>
							
							<TableBody>
								{companyTypes.map((row, index) => (
									<TableRow
										key={index}
									>
										<DraggableCell><Avatar src={row.image} /></DraggableCell>
										<DraggableCell>{row.name}</DraggableCell>
										<DraggableCell><Chip variant='outlined' label={row.countCompanies} /></DraggableCell>
										<DraggableCell>
											<IconButton disabled={loadingUpdating} onClick={()=>{props.history.push(`/ramos/alterar/${row.id}`)}}>
												<Icon path={mdiPencil} size={1} color='#363E5E' />
											</IconButton>
											<Switch
												checked={row.active}
												disabled={loadingUpdating}
												onChange={()=>updateCompanyType({ variables: { id: row.id, data: { active: !row.active } } })}
												value="checkedB"
												size='small'
												color="secondary"
												inputProps={{ 'aria-label': 'primary checkbox' }}
											/>
										</DraggableCell>
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
							count={countCompanyTypes}
							rowsPerPage={pagination.rowsPerPage}
							page={pagination.page}
							onChangePage={(e, newPage)=>{setPagination({ ...pagination, page: newPage })}}
							onChangeRowsPerPage={(e)=>{setPagination({ ...pagination, page: 0, rowsPerPage: e.target.value });}}
						/>
					</Paper>
					<NumberOfRows>{countCompanyTypes} ramos de atividade</NumberOfRows>
				</Block>
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