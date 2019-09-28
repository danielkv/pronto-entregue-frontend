import React, { Fragment, useState } from 'react';
import gql from 'graphql-tag';
import {Paper, FormControlLabel, Switch, Button, FormLabel, FormControl, FormHelperText, TextField, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, MenuItem, InputAdornment} from '@material-ui/core';

import Icon from '@mdi/react';
import {mdiPlus, mdiBasket } from '@mdi/js'
import Downshift from "downshift";
import * as Yup from 'yup';
import { Formik, FieldArray, Form, Field, ErrorMessage} from 'formik';
import { DragDropContext, Droppable} from 'react-beautiful-dnd';

import {setPageTitle, createEmptyOptionsGroup} from '../../utils';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField, Loading} from '../../layout/components';

import OptionsGroups from './options_groups';
import { useQuery, useApolloClient ,useLazyQuery } from '@apollo/react-hooks';
import { GET_SELECTED_COMPANY } from '../../graphql/companies';
import { LOAD_OPTION_GROUP } from '../../graphql/products';
import { DropzoneBlock } from '../../layout/blocks';
import { GET_SELECTED_BRANCH } from '../../graphql/branches';
import { GET_BRANCH_CATEGORIES } from '../../graphql/categories';

const productSchema = Yup.object().shape({
	name: Yup.string().required('Obrigatório'),
	price: Yup.number().required('Obrigatório'),
	description: Yup.string().required('Obrigatório'),
	options_groups: Yup.array().of(Yup.object().shape({
		options: Yup.array().of(Yup.object().shape({
			price: Yup.number().required('Obrigatório')
		})),
	})),
});

const GET_COMPANY_ITEMS = gql`
	query ($id:ID!) {
		company (id:$id) {
			id
			items {
				id
				name
			}
		}
	}
`;

const SEARCH_OPTIONS_GROUPS = gql`
	query ($search:String!) {
		searchOptionsGroups(search: $search) {
			id
			name
			options_qty
			product {
				id
				name
				category {
					id
					name
					branch {
						id
						name
					}
				}
			}
		}
	}
`;

export default function PageForm ({initialValues, onSubmit, pageTitle, validateOnChange}) {
	setPageTitle('Novo produto');

	const [loadingCopy, setLoadingCopy] = useState(false);
	const [dragAlertOpen, setDragAlertOpen] = useState(false);
	
	const {data:selectedBranchData, loading:loadingSelectedData} = useQuery(GET_SELECTED_BRANCH);
	const {data:categoriesData, loading:loadingcategoriesData} = useQuery(GET_BRANCH_CATEGORIES, {variables:{id:selectedBranchData.selectedBranch}});

	const {data:selectedCompanyData, loading:loadingSelectedCompany} = useQuery(GET_SELECTED_COMPANY);
	const {data:itemsData, loading:loadingItems} = useQuery(GET_COMPANY_ITEMS, {variables:{id:selectedCompanyData.selectedCompany}});
	const items = itemsData ? itemsData.company.items : [];

	const [searchOptionsGroups, {data:groupsData, loading:loadingGroups}] = useLazyQuery(SEARCH_OPTIONS_GROUPS, {fetchPolicy:'no-cache'});
	const groups = groupsData ? groupsData.searchOptionsGroups : [];
	const client = useApolloClient();
	
	if (loadingSelectedCompany || loadingItems || loadingcategoriesData || loadingSelectedData) return <Loading />;

	const onDragEnd = (groups, setFieldValue) => (result)=>{
		if (!result.destination || result.destination.index === result.source.index) return;
	
		const list = Array.from(groups);
	
		if (result.type === 'group') {
			let [removed] = list.splice(result.source.index, 1);
			list.splice(result.destination.index, 0, removed);
	
			setFieldValue('options_groups', list.map((row, index) => {row.order = index; return row;}));
		}
	
		if (result.type === 'option') {
			let droppableSource = result.source.droppableId.split('.')[1];
			let droppableDestination = result.destination.droppableId.split('.')[1];

			let draggableId = result.draggableId.split('.')[3];

			if (droppableSource !== droppableDestination && list[droppableDestination].options.find(row=>row.id===draggableId)) {
				setDragAlertOpen(true);
				return;
			}
	
			let [removed] = list[droppableSource].options.splice(result.source.index, 1);
			list[droppableDestination].options.splice(result.destination.index, 0, removed);
	
			list[droppableSource].options.map((row, index) => {row.order = index; return row;});
			list[droppableDestination].options.map((row, index) => {row.order = index; return row;});
	
			setFieldValue('options_groups', list);
		}
	}

	const handleSearchGroups = (search) => {
		searchOptionsGroups({variables:{search}});
	}

	const handleCopyOptionGroup = (group, insert) => {
		setLoadingCopy(true);
		client.query({query:LOAD_OPTION_GROUP, variables:{id:group.id}})
		.then(({data:{optionsGroup}})=>{
			insert(0, optionsGroup);
		})
		.catch(e=>{
			console.error(e);
		})
		.finally(()=>{
			setLoadingCopy(false);
		})
	}

	const handleDropFile = (setFieldValue) => (acceptedFiles) => {
		if ( Array.isArray(acceptedFiles)) {
			const file = acceptedFiles[0];
			const preview = URL.createObjectURL(file);
			setFieldValue('preview', preview);
			setFieldValue('file', file);
		}
	}

	return (
		<Formik
			validationSchema={productSchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={validateOnChange}
			validateOnBlur={false}
		>
			{({values:{active, preview, category, options_groups}, setFieldValue, handleChange, isSubmitting, errors}) => (
			<Form>
				<Dialog
					open={dragAlertOpen}
					onClose={()=>setDragAlertOpen(false)}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">Você não pode soltar esse item aqui</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							Essa opção já está dentro desse grupo, tente criar uma nova.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={()=>setDragAlertOpen(false)} color="primary" autoFocus>
							Ok
						</Button>
					</DialogActions>
				</Dialog>
				<Content>
					<Block>
						<BlockHeader>
							<BlockTitle>{pageTitle}</BlockTitle>
						</BlockHeader>
						<Paper>
							<FormRow>
								<FieldControl>
									<Field component={tField} name='name' label='Nome do produto' />
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<Field component={tField} name='description' label='Descrição' />
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<TextField name='price' type='number' onChange={handleChange} error={!!errors.price} helperText={!!errors.price && errors.price} label='Preço' InputProps={{startAdornment:<InputAdornment position="start">R$</InputAdornment>}} />
								</FieldControl>
								<FieldControl>
									<TextField select value={category.id} label='Categoria' name='category.id' onChange={handleChange}>
										{categoriesData && categoriesData.branch.categories.map(category_item=>(
											<MenuItem key={category_item.id} value={category_item.id}>{category_item.name}</MenuItem>
										))}
									</TextField>
								</FieldControl>
							</FormRow>
						</Paper>
					</Block>
					<Block>
						<BlockHeader>
							<BlockTitle>Opções</BlockTitle>
							{loadingCopy && <Loading />}
						</BlockHeader>
						<Paper style={{overflow:'visible'}}>
							<FieldArray  name={`options_groups`}>
								{({insert, remove}) => (
									<Fragment>
										<BlockSeparator>
											<FormRow>
												<FieldControl>
													<FormControl>
													<Downshift
														onChange={(selected, {reset, clearSelection})=>{
															if (selected.action === 'create') {
																insert(0, selected);
															} else {
																handleCopyOptionGroup(selected, insert);
															}
														}}
														itemToString={(item => item ? item.name : '')}
														onInputValueChange={(value)=>{handleSearchGroups(value)}}
													>
														{({
															getInputProps,
															getItemProps,
															getMenuProps,
															isOpen,
															inputValue,
															highlightedIndex,
														})=>{
															if (inputValue && (!groups.length || !groups[groups.length-1].action))
																groups.push(createEmptyOptionsGroup({id:Math.round(Math.random()*1000), name:inputValue, action:'create'}));

															return (
																<div>
																	<TextField disabled={loadingCopy} {...getInputProps()} />
																	{isOpen && (
																		<List {...getMenuProps()} className="dropdown">
																			{loadingGroups && <div style={{padding:20}}><Loading /></div>}
																			
																			{groups.map((item, index) => {
																				let icon = item.action && item.action === 'create' ? mdiPlus : mdiBasket;
																				let text = item.action && item.action === 'create' ? inputValue : <span>{`${item.name} `}<small>{`(${item.options_qty})`}</small></span>;
																				let secondary = item.action && item.action === 'create' ? 'criar novo grupo' : `copiar de ${item.product.name} em ${item.product.category.branch.name}`;

																				return (<ListItem
																					className="dropdown-item"
																					selected={highlightedIndex === index}
																					key={item.id}
																					{...getItemProps({ key: item.id, index, item })}
																					>
																						<ListItemIcon><Icon path={icon} color='#707070' size='22' /></ListItemIcon>
																						<ListItemText>{text}</ListItemText>
																						<ListItemSecondaryAction><small>{secondary}</small></ListItemSecondaryAction>
																					</ListItem>)
																			})}
																		</List>
																	)}
																</div>
															)
														}}
													</Downshift>
														<FormHelperText>Crie um grupo novo ou copie um grupo já existente</FormHelperText>
													</FormControl>
												</FieldControl>
											</FormRow>
										</BlockSeparator>
										<BlockSeparator>
											<DragDropContext onDragEnd={onDragEnd(options_groups, setFieldValue)}>
												<Droppable droppableId={`groups`} type='group'>
													{(provided, snapshot)=>(
														
														<div {...provided.droppableProps} ref={provided.innerRef}>
															{options_groups.map((group, groupIndex)=>{
																const props = {
																	groups: options_groups,
																	group,
																	groupIndex,
																	insertGroup:insert,
																	removeGroup:remove,
																	items,

																	setFieldValue,
																	handleChange,
																	errors
																}
																return <OptionsGroups key={`${group.id}.${groupIndex}`} {...props} />
															})}
															{provided.placeholder}
														</div>
															
													)}
												</Droppable>
											</DragDropContext>
										</BlockSeparator>
									</Fragment>
								)}
							</FieldArray>
						</Paper>
					</Block>
				</Content>
				<SidebarContainer>
					<Block>
						<BlockHeader>
							<BlockTitle>Configuração</BlockTitle>
						</BlockHeader>
						<Sidebar>
							<BlockSeparator>
								<FormRow>
									<FieldControl style={{justifyContent:'flex-end', paddingRight:7}}>
										<FormControlLabel
											labelPlacement='start'
											control={
												<Switch size='small' color='primary' checked={active} onChange={()=>{setFieldValue('active', !active)}} value="includeDisabled" />
											}
											label="Ativo"
										/>
									</FieldControl>
								</FormRow>
								<FormRow>
									<FieldControl>
										<Button fullWidth type='submit' variant="contained" color='secondary'>Salvar</Button>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<FormControl>
											<FormLabel>Imagem</FormLabel> 
											<DropzoneBlock preview={preview} onDrop={handleDropFile(setFieldValue)} />
											<FormHelperText error><ErrorMessage name="file" /></FormHelperText>
										</FormControl>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
						</Sidebar>
					</Block>
				</SidebarContainer>
			</Form>)}
		</Formik>
	)
}