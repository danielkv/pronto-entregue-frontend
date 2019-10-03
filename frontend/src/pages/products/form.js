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

const FILE_SIZE = 500 * 1024;

export default function PageForm ({initialValues, onSubmit, pageTitle, validateOnChange, edit}) {
	setPageTitle('Novo produto');

	const productSchema = Yup.object().shape({
		name: Yup.string().required('Obrigatório'),
		price: Yup.number().required('Obrigatório'),
		description: Yup.string().required('Obrigatório'),
		file: Yup.lazy(value => {
			if (!edit) {
				return Yup.mixed().required('Selecione uma imagem')
				.test('fileSize', 'Essa imagem é muito grande. Máximo 500kb', value => value && value.size <= FILE_SIZE)
			}
			
			return Yup.mixed().notRequired();
		}),
		options_groups: Yup.array().of(Yup.object().shape({
			name: Yup.string().required('Obrigatório'),
			options: Yup.array().of(Yup.object().shape({
				name: Yup.string().required('Obrigatório'),
				price: Yup.number().required('Obrigatório'),
			})),
		})),
	});

	const [loadingCopy, setLoadingCopy] = useState(false);
	const [dragAlertOpen, setDragAlertOpen] = useState(false);
	
	const {data:selectedBranchData, loading:loadingSelectedData} = useQuery(GET_SELECTED_BRANCH);
	const {data:categoriesData, loading:loadingcategoriesData} = useQuery(GET_BRANCH_CATEGORIES, {variables:{id:selectedBranchData.selectedBranch}});

	const {data:selectedCompanyData, loading:loadingSelectedCompany} = useQuery(GET_SELECTED_COMPANY);
	const {data:itemsData, loading:loadingItems} = useQuery(GET_COMPANY_ITEMS, {variables:{id:selectedCompanyData.selectedCompany}});
	let items = [];
	if (itemsData) {
		items = itemsData.company.items;
		if (!items.length || items[0].id !== 'none') items.unshift({id:'none', name:'Sem vínculo'})
	}

	const [searchOptionsGroups, {data:groupsData, loading:loadingGroups}] = useLazyQuery(SEARCH_OPTIONS_GROUPS, {fetchPolicy:'no-cache'});
	const groups = groupsData ? groupsData.searchOptionsGroups : [];
	const client = useApolloClient();
	
	if (loadingSelectedCompany || loadingItems || loadingcategoriesData || loadingSelectedData) return <Loading />;

	const sanitizeOptionsGroupsOrder = (groups) => {
		return groups.map((row, index) => {
			row.order = index;
			if (row.action==='editable') row.action = 'update';
			return row;
		})
	}

	const sanitizeOptionsOrder = (group) => {
		group.options.map((row, index) => {
			row.order = index;
			if (row.action==='editable') row.action = 'update';
			return row;
		});
		if (group.action === 'editable') group.action = 'update';
		return group;
	}

	const onDragEnd = (groups, setFieldValue) => (result)=>{
		if (!result.destination || result.destination.index === result.source.index) return;
	
		const list = Array.from(groups);
	
		if (result.type === 'group') {
			let [removed] = list.splice(result.source.index, 1);
			list.splice(result.destination.index, 0, removed);
			
			setFieldValue('options_groups', sanitizeOptionsGroupsOrder(list));
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
			
			list[droppableSource] = sanitizeOptionsOrder(list[droppableSource]);
			list[droppableDestination] = sanitizeOptionsOrder(list[droppableDestination]);
	
			setFieldValue('options_groups', list);
		}
	}

	const handleSearchGroups = (search) => {
		searchOptionsGroups({variables:{search}});
	}

	const getCopiedOptionGroup = (group) => {
		setLoadingCopy(true);
		return client.query({query:LOAD_OPTION_GROUP, variables:{id:group.id}})
		.then(({data:{optionsGroup}})=>{
			delete optionsGroup.id;
			optionsGroup.action = 'create';
			optionsGroup.options = optionsGroup.options.map(row =>{
				delete row.id;
				row.action='create';
				return row
			});
			return optionsGroup;
		})
		.catch(e=>{
			console.error(e);
		})
		.finally(()=>{
			setLoadingCopy(false);
		})
	}

	const handleDropFile = (setFieldValue) => (acceptedFiles) => {
		if (Array.isArray(acceptedFiles)) {
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
			{({values:{active, price, preview, category, options_groups}, values, setFieldValue, handleChange, isSubmitting, errors}) => {
			return (<Form>
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
									<TextField
										name='price'
										type='number'
										value={price}
										label='Preço'
										onChange={handleChange}
										disabled={isSubmitting}
										error={!!errors.price}
										helperText={!!errors.price && errors.price}
										InputProps={{startAdornment:<InputAdornment position="start">R$</InputAdornment>}}
										inputProps={{step:0.01}} />
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
														onChange={async (selected, {reset, clearSelection})=>{
															if (selected.action !== 'create') {
																selected = await getCopiedOptionGroup(selected);
															}
															const list = Array.from(options_groups);
															list.unshift({...selected, id:Math.round(Math.random()*1000)});
															setFieldValue('options_groups', sanitizeOptionsGroupsOrder(list));
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
																	sanitizeOptionsGroupsOrder,
																	sanitizeOptionsOrder,
																	groupIndex,
																	insertGroup:insert,
																	removeGroup:remove,
																	isSubmitting,
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
			</Form>)}}
		</Formik>
	)
}