import React, {useState, Fragment} from 'react';
import {Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button } from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiDrag , mdiPencil, mdiFilter} from '@mdi/js';
import {Link} from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

import {setPageTitle} from '../../utils';
import { ErrorBlock, LoadingBlock } from '../../layout/blocks';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, CircleNumber, SidebarContainer, Sidebar, ProductImage, Loading, DraggableCell} from '../../layout/components';
import { GET_SELECTED_BRANCH } from '../../graphql/branches';
import { GET_BRANCH_CATEGORIES, UPDATE_CATEGORY, UPDATE_CATEGORIES_ORDER } from '../../graphql/categories';

const sort = (a, b) => {
	if (a.order > b.order) return 1;
	else if (a.order < b.order) return -1;
	
	return 0;
}

function Page (props) {
	setPageTitle('Categorias');

	const {data:selectedBranchData, loading:loadingSelectedData} = useQuery(GET_SELECTED_BRANCH);
	
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	
	const [setCategoryEnabled, {loading}] = useMutation(UPDATE_CATEGORY);
	const [updateCategoriesOrder, {loading:loadingCategoriesOrder}] = useMutation(UPDATE_CATEGORIES_ORDER, {refetchQueries:[{query:GET_BRANCH_CATEGORIES, variables:{id:selectedBranchData.selectedBranch}}]});
	
	const {data:categoriesData, loading:loadingItemsData, error} = useQuery(GET_BRANCH_CATEGORIES, {variables:{id:selectedBranchData.selectedBranch}});

	//filter, order, pages
	let categories = [];
	if (categoriesData && categoriesData.branch.categories.length) {
		categories = categoriesData.branch.categories
		.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
		.sort(sort);
	}
	
	if (error) return <ErrorBlock error={error} />
	if (loadingSelectedData || loadingItemsData) return (<LoadingBlock />);

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result.map((row, index) => {row.order = index; return row;});
	};

	const onDragEnd = result => {
		if (!result.destination || result.destination.index === result.source.index) return;

		const new_order = reorder(categories, result.source.index, result.destination.index);

		const save_new_order = new_order.map((cat, index) => ({id: cat.id, order:index}));
		updateCategoriesOrder({variables:{data:save_new_order}});
	}

	return (
		<Fragment>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Categorias</BlockTitle>
						<Button size='small' variant="contained" color='secondary' to='/categorias/novo' component={Link}>Adicionar</Button> {(loading || loadingCategoriesOrder) && <Loading />}
						<NumberOfRows>{categories.length} categorias</NumberOfRows>
					</BlockHeader>
					<Paper>
						<Table style={{tableLayout:'auto', width:'100%'}}>
							<TableHead>
								<TableRow>
									<TableCell style={{width:30}}></TableCell>
									<TableCell style={{width:50}}></TableCell>
									<TableCell>Nome</TableCell>
									<TableCell style={{width:350}}>Produtos vinculados</TableCell>
									<TableCell style={{width:300}}>Criada em</TableCell>
									<TableCell style={{width:100}}>Ações</TableCell>
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
											<Draggable key={row.id} draggableId={row.id} index={index} style={{display: 'table'}}>
												{(provided)=>{
													const selected = row.id === snapshot.draggingFromThisWith;
													return(
												<TableRow
														
													selected={selected}
													innerRef={provided.innerRef}
													{...provided.draggableProps}
													>
													<DraggableCell selected={selected}><div {...provided.dragHandleProps}><Icon path={mdiDrag} size='20' color='#BCBCBC' /></div></DraggableCell>
													<DraggableCell selected={selected}><ProductImage src={row.image} /></DraggableCell>
													<DraggableCell selected={selected}>{row.name}</DraggableCell>
													<DraggableCell selected={selected}><CircleNumber>{row.products_qty}</CircleNumber></DraggableCell>
													<DraggableCell selected={selected}>{row.created_at}</DraggableCell>
													<DraggableCell selected={selected}>
														<IconButton disabled={loading} onClick={()=>{props.history.push(`/categorias/alterar/${row.id}`)}}>
															<Icon path={mdiPencil} size='18' color='#363E5E' />
														</IconButton>
														<Switch
															checked={row.active}
															disabled={loading}
															onChange={()=>setCategoryEnabled({variables:{id:row.id, data:{active:!row.active}}})}
															value="checkedB"
															size='small'
															color="secondary"
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
							count={categories.length}
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
					<NumberOfRows>{categories.length} categorias</NumberOfRows>
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