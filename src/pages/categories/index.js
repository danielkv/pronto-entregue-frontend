import React, { useState, Fragment, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';

import { useMutation, useQuery } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button, CircularProgress, Avatar, Chip, Typography } from '@material-ui/core';
import { mdiDrag , mdiPencil, mdiFilter } from '@mdi/js';
import Icon from '@mdi/react';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, SidebarContainer, Sidebar, DraggableCell } from '../../layout/components';

import { useSelectedCompany } from '../../controller/hooks';
import { ErrorBlock, LoadingBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';

import { GET_COMPANY_CATEGORIES, UPDATE_CATEGORY, UPDATE_CATEGORIES_ORDER } from '../../graphql/categories';

const sort = (a, b) => {
	if (a.order > b.order) return 1;
	else if (a.order < b.order) return -1;
	
	return 0;
}

const initialFilter = {
	showInactive: false,
	search: '',
}

function Page ({ match: { url } }) {
	setPageTitle('Categorias');
	//const { url } = useRouteMatch();

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
	
	const selectedCompany = useSelectedCompany();

	const [setCategoryEnabled, { loading }] = useMutation(UPDATE_CATEGORY);
	const [updateCategoriesOrder, { loading: loadingCategoriesOrder }] = useMutation(UPDATE_CATEGORIES_ORDER, {
		refetchQueries: [{ query: GET_COMPANY_CATEGORIES, variables: { filter, pagination, id: selectedCompany } }]
	});
	
	const { data: { company: { countCategories = 0, categories = [] } = {} } = {}, loading: loadingCategories, error, called } = useQuery(GET_COMPANY_CATEGORIES, {
		variables: { filter, pagination, id: selectedCompany }
	});

	//temp order
	if (categories.length) categories.sort(sort);
	
	if (error) return <ErrorBlock error={getErrors(error)} />
	if (!called && loadingCategories) return (<LoadingBlock />);

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result.map((row, index) => {row.order = index; return row;});
	};

	const onDragEnd = result => {
		if (!result.destination || result.destination.index === result.source.index) return;

		const newOrder = reorder(categories, result.source.index, result.destination.index);

		const saveNewOrder = newOrder.map((cat, index) => ({ id: cat.id, order: index }));
		updateCategoriesOrder({ variables: { data: saveNewOrder } });
	}

	return (
		<Fragment>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Categorias</BlockTitle>
						<Button size='small' variant="contained" color='primary' to={`${url}/nova`} component={Link}>Adicionar</Button> {(loading || loadingCategoriesOrder) && <CircularProgress />}
						<NumberOfRows>{countCategories} categorias</NumberOfRows>
					</BlockHeader>
					<Paper>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell style={{ width: 30 }}></TableCell>
									<TableCell style={{ width: 50 }}></TableCell>
									<TableCell>Nome</TableCell>
									<TableCell style={{ width: 350 }}><Typography variant='caption'>Produtos vinculados</Typography></TableCell>
									<TableCell style={{ width: 100 }}><Typography variant='caption'>Ações</Typography></TableCell>
								</TableRow>
							</TableHead>
							<DragDropContext
								/* onDragStart
								onDragUpdate */
								onDragEnd={onDragEnd}
							>
								<Droppable droppableId='reorder'>
									{(provided, snapshot)=>(
										<TableBody
											innerRef={provided.innerRef}
											{...provided.droppableProps}
										>
											{categories.map((row, index) => (
												<Draggable key={row.id} draggableId={row.id} index={index} style={{ display: 'table' }}>
													{(provided)=>{
														const selected = row.id === snapshot.draggingFromThisWith;
														return(
															<TableRow
														
																selected={selected}
																innerRef={provided.innerRef}
																{...provided.draggableProps}
															>
																<DraggableCell selected={selected}><div {...provided.dragHandleProps}><Icon path={mdiDrag} size={1} color='#BCBCBC' /></div></DraggableCell>
																<DraggableCell selected={selected}><Avatar alt={row.name} src={row.image} /></DraggableCell>
																<DraggableCell selected={selected}><Typography variant='body2'>{row.name}</Typography></DraggableCell>
																<DraggableCell selected={selected}><Chip variant='outlined' label={row.countProducts} /></DraggableCell>
																<DraggableCell selected={selected}>
																	<IconButton disabled={loading} component={Link} to={`${url}/alterar/${row.id}`}>
																		<Icon path={mdiPencil} size={1} color='#363E5E' />
																	</IconButton>
																	<Switch
																		checked={row.active}
																		disabled={loading}
																		onChange={()=>setCategoryEnabled({ variables: { id: row.id, data: { active: !row.active } } })}
																		value="checkedB"
																		size='small'
																		color='primary'
																		inputProps={{ 'aria-label': 'primary checkbox' }}
																	/>
																</DraggableCell>
															</TableRow>)}}
												</Draggable>
											))}
											{provided.placeholder}
										</TableBody>)}
								</Droppable>
							</DragDropContext>
						</Table>
						<TablePagination
							component="div"
							backIconButtonProps={{
								'aria-label': 'previous page',
							}}
							nextIconButtonProps={{
								'aria-label': 'next page',
							}}
							count={countCategories}
							rowsPerPage={pagination.rowsPerPage}
							page={pagination.page}
							onChangePage={(e, newPage)=>{setPagination({ ...pagination, page: newPage })}}
							onChangeRowsPerPage={(e)=>{setPagination({ ...pagination, page: 0, rowsPerPage: e.target.value });}}
						/>
					</Paper>
					<NumberOfRows>{countCategories} categorias</NumberOfRows>
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