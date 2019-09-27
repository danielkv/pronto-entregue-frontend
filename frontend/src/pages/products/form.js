import React, { Fragment } from 'react';
import gql from 'graphql-tag';
import {Paper, FormControlLabel, Switch, Button, FormLabel, FormControl, FormHelperText, TextField, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction} from '@material-ui/core';

import Icon from '@mdi/react';
import {mdiPlus, mdiBasket } from '@mdi/js'
import Downshift from "downshift";
import * as Yup from 'yup';
import { Formik, FieldArray, Form, Field} from 'formik';
import { DragDropContext, Droppable} from 'react-beautiful-dnd';

import ImagePlaceHolder from '../../assets/images/image_placeholder.png';
import {setPageTitle, createEmptyOptionGroup} from '../../utils';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField, Loading} from '../../layout/components';

import OptionsGroups from './options_groups';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { GET_SELECTED_COMPANY } from '../../graphql/companies';

const productSchema = Yup.object().shape({
	name: Yup.string().required('Obrigatório'),
	description: Yup.string().required('Obrigatório'),
	options_groups: Yup.array().of(Yup.object().shape({
		options: Yup.array().of(Yup.object().shape({
			price: Yup.number().required('Obrigatório')
		})),
	})),
});

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

		let [removed] = list[droppableSource].options.splice(result.source.index, 1);
		list[droppableDestination].options.splice(result.destination.index, 0, removed);

		list[droppableSource].options.map((row, index) => {row.order = index; return row;});
		list[droppableDestination].options.map((row, index) => {row.order = index; return row;});

		setFieldValue('options_groups', list);
	}
}

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

	const {data:selectedCompanyData, loading:loadingSelectedCompany} = useQuery(GET_SELECTED_COMPANY);
	const {data:itemsData, loading:loadingItems} = useQuery(GET_COMPANY_ITEMS, {variables:{id:selectedCompanyData.selectedCompany}});
	const items = itemsData ? itemsData.company.items : [];

	const [searchOptionsGroups, {data:groupsData, loading:loadingGroups}] = useLazyQuery(SEARCH_OPTIONS_GROUPS, {fetchPolicy:'no-cache'});
	const groups = groupsData ? groupsData.searchOptionsGroups : [];
	
	if (loadingSelectedCompany || loadingItems) return <Loading />;

	const handleSearchGroups = (search) => {
		searchOptionsGroups({variables:{search}});
	}

	return (
		<Formik
			validationSchema={productSchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={validateOnChange}
			validateOnBlur={false}
		>
			{({values:{active, options_groups}, setFieldValue, handleChange, isSubmitting, errors}) => (
			<Form>
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
						</Paper>
					</Block>
					<Block>
						<BlockHeader>
							<BlockTitle>Opções</BlockTitle>
						</BlockHeader>
						<Paper>
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
																groups.push(createEmptyOptionGroup({id:Math.round(Math.random()*1000), name:inputValue, action:'create'}));

															return (
																<div>
																	<TextField {...getInputProps()} />
																	{isOpen && (
																		<List {...getMenuProps()} className="dropdown">
																			{loadingGroups ?
																				<Loading />
																			:
																				groups.map((item, index) => {
																					let icon = item.action && item.action === 'create' ? mdiPlus : mdiBasket;
																					let text = item.action && item.action === 'create' ? inputValue : <span>{`${item.name} `}<small>{`(${item.options_qty})`}</small></span>;
																					let secondary = item.action && item.action === 'create' ? 'criar novo grupo' : `copiar de ${item.product.name} em ${item.product.category.branch.name}`;

																					return (<ListItem
																						className="dropdown-item"
																						selected={highlightedIndex === index}
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
																return <OptionsGroups key={group.id} {...props} />
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
											<img src={ImagePlaceHolder} alt='Clique para adicionar uma imagem' />
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