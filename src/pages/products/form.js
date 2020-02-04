import React, { Fragment, useState, useCallback, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useHistory } from 'react-router-dom';

import { useQuery, useApolloClient ,useLazyQuery } from '@apollo/react-hooks';
import { Paper, FormControlLabel, Switch, Button, FormLabel, FormControl, FormHelperText, TextField, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, MenuItem, InputAdornment, CircularProgress, Chip } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { mdiPlus, mdiBasket, mdiFormatListChecks, mdiCheckDecagram, mdiPencil } from '@mdi/js'
import Icon from '@mdi/react';
import Downshift from "downshift";
import { FieldArray, Form, Field, ErrorMessage } from 'formik';
import { isEmpty } from 'lodash';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField } from '../../layout/components';

import { useLoggedUserRole, useSelectedCompany } from '../../controller/hooks';
import { DropzoneBlock, LoadingBlock } from '../../layout/blocks';
import { errorObjectsToArray } from '../../utils/error';
import { createEmptyOptionsGroup } from '../../utils/products';
import OptionsGroups from './optionsGroups';

import { GET_COMPANY_CATEGORIES } from '../../graphql/categories';
import { LOAD_OPTION_GROUP, SEARCH_OPTIONS_GROUPS } from '../../graphql/products';

export default function PageForm ({ values: { active, featured, campaigns, price, type, preview, category, optionsGroups }, setFieldValue, handleChange, isValidating, isSubmitting, errors }) {
	const history = useHistory();
	const [errorDialog, setErrorDialog] = useState(false);
	const loggedUserRole = useLoggedUserRole();

	const [loadingCopy, setLoadingCopy] = useState(false);
	const [dragAlertOpen, setDragAlertOpen] = useState(false);
	
	const selectedCompany = useSelectedCompany();
	const { data: { company: { categories = [] } = {} } = {}, loading: loadingcategories } = useQuery(GET_COMPANY_CATEGORIES, { variables: { id: selectedCompany } });

	const [searchOptionsGroups, { data: groupsData, loading: loadingGroups }] = useLazyQuery(SEARCH_OPTIONS_GROUPS, { fetchPolicy: 'no-cache' });
	const groups = groupsData ? groupsData.searchOptionsGroups : [];
	const client = useApolloClient();

	// errors
	function handleCloseDialog() {
		setErrorDialog(false)
	}
	useEffect(()=>{
		if (isValidating && !isEmpty(errors)) setErrorDialog(true);
	}, [isValidating, errors])
	
	const sanitizeOptionsGroupsOrder = useCallback((groups) => {
		return groups.map((row, index) => {
			row.order = index;
			if (row.action==='editable') row.action = 'update';
			return row;
		})
	}, [])
	
	const sanitizeOptionsOrder = useCallback((group) => {
		group.options.map((row, index) => {
			row.order = index;
			if (row.action==='editable') row.action = 'update';
			return row;
		});
		if (group.action === 'editable') group.action = 'update';
		return group;
	}, []);
	
	const onDragEnd = (groups, setFieldValue) => (result)=>{
		if (!result.destination || result.destination.index === result.source.index) return;
		
		const list = Array.from(groups);
		
		if (result.type === 'group') {
			let [removed] = list.splice(result.source.index, 1);
			list.splice(result.destination.index, 0, removed);
			
			setFieldValue('optionsGroups', sanitizeOptionsGroupsOrder(list));
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
			
			setFieldValue('optionsGroups', list);
		}
	}
	
	const handleSearchGroups = (search) => {
		searchOptionsGroups({ variables: { search } });
	}
	
	const getCopiedOptionGroup = (group) => {
		setLoadingCopy(true);
		return client.query({ query: LOAD_OPTION_GROUP, variables: { id: group.id } })
			.then(({ data: { optionsGroup } })=>{
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

	const handleChangeCallback = useCallback(handleChange, []);

	if (loadingcategories) return <LoadingBlock />;
	
	return (
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
						<BlockTitle>Produto</BlockTitle>
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
									type='number'
									value={price}
									label='Preço'
									name='price'
									onChange={handleChange}
									disabled={isSubmitting}
									error={!!errors.price}
									helperText={!!errors.price && errors.price}
									InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
									inputProps={{ step: 0.01 }} />
							</FieldControl>
							<FieldControl>
								<TextField select value={category.id} label='Categoria' name='category.id' onChange={handleChange}>
									{!!categories.length && categories.map(categoryItem=>(
										<MenuItem key={categoryItem.id} value={categoryItem.id}>{categoryItem.name}</MenuItem>
									))}
								</TextField>
							</FieldControl>
						</FormRow>
						{!!campaigns.length && <FormRow>
							<FieldControl style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
								<FormLabel>Campanhas vinculadas</FormLabel>
								<div style={{ display: 'block' }}>
									{campaigns.map((campaign, index) => {
										const onDelete = (campaign.masterOnly && loggedUserRole === 'master') || !campaign.masterOnly ? ()=>history.push(`/campanhas/alterar/${campaign.id}`) : null;
										return <Chip color='primary' key={index} label={campaign.name} deleteIcon={<Icon path={mdiPencil} size={1} color='#ccc' />} onDelete={onDelete} />
									})}
								</div>
							</FieldControl>
						</FormRow>}
					</Paper>
				</Block>
				<Block>
					<BlockHeader>
						<BlockTitle>Opções</BlockTitle>
						{loadingCopy && <CircularProgress />}
					</BlockHeader>
					<Paper style={{ overflow: 'visible' }}>
						<FieldArray  name={`optionsGroups`}>
							{() => (
								<Fragment>
									<BlockSeparator>
										<FormRow>
											<FieldControl>
												<FormControl>
													<Downshift
														onChange={async (selected)=>{
															if (selected.action !== 'create') {
																// eslint-disable-next-line no-param-reassign
																selected = await getCopiedOptionGroup(selected);
															}
															const list = Array.from(optionsGroups);
															list.unshift({ ...selected, id: Math.round(Math.random()*1000) });
															setFieldValue('optionsGroups', sanitizeOptionsGroupsOrder(list));
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
																groups.push(createEmptyOptionsGroup({ id: Math.round(Math.random()*1000), name: inputValue, action: 'create' }));

															return (
																<div>
																	<TextField disabled={loadingCopy} {...getInputProps()} />
																	{isOpen && (
																		<List {...getMenuProps()} className="dropdown">
																			{loadingGroups && <div style={{ padding: 20 }}><CircularProgress /></div>}
																		
																			{groups.map((group, index) => {
																				let icon = group.action && group.action === 'create' ? mdiPlus : mdiBasket;
																				let text = group.action && group.action === 'create' ? inputValue : <span>{`${group.name} `}<small>{`(${group.countOptions})`}</small></span>;
																				let secondary = group.action && group.action === 'create' ? 'criar novo grupo' : `copiar de ${group.product.name}`;

																				return (<ListItem
																					className="dropdown-item"
																					selected={highlightedIndex === index}
																					key={group.id}
																					{...getItemProps({ key: group.id, index, group })}
																				>
																					<ListItemIcon><Icon path={icon} color='#707070' size={1} /></ListItemIcon>
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
										<DragDropContext onDragEnd={onDragEnd(optionsGroups, setFieldValue)}>
											<Droppable droppableId={`groups`} type='group'>
												{(provided)=>(
													
													<div {...provided.droppableProps} ref={provided.innerRef}>
														{optionsGroups.map((group, groupIndex)=>{
															const props = {
																groups: optionsGroups,
																group,
																sanitizeOptionsGroupsOrder,
																sanitizeOptionsOrder,
																groupIndex,
																/* insertGroup:insert,
																removeGroup:remove, */
																isSubmitting,

																setFieldValue,
																handleChangeCallback,
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
								<FieldControl style={{ justifyContent: 'flex-end', paddingRight: 7 }}>
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
								<FieldControl style={{ justifyContent: 'flex-end', paddingRight: 7 }}>
									<FormControlLabel
										labelPlacement='start'
										control={
											<Switch size='small' color='secondary' checked={featured} onChange={()=>{setFieldValue('featured', !featured)}} value="includeDisabled" />
										}
										label="Destaque"
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
										<FormLabel>Tipo de seleção</FormLabel>
										<ToggleButtonGroup
											value={type}
											exclusive
											name='type'
											onChange={(e, value)=>{
												setFieldValue('type', value);
											}}
											aria-label="text alignment"
										>
											<ToggleButton disabled={isSubmitting} value="inline" title="Normal" aria-label="left aligned">
												<Icon path={mdiCheckDecagram} size={1} color='#707070' />
											</ToggleButton>
											<ToggleButton disabled={isSubmitting} value="panel" title="Painel" aria-label="left aligned">
												<Icon path={mdiFormatListChecks} size={1} color='#707070' />
											</ToggleButton>
										</ToggleButtonGroup>
									</FormControl>
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
			<Dialog
				open={errorDialog && !isEmpty(errors)}
				onClose={handleCloseDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">Hmm! Parece que seu formulário tem alguns erros</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						<ul>
							{errorObjectsToArray(errors).map((err, index) => (<li key={index}>{err}</li>))}
						</ul>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="primary"autoFocus>Ok</Button>
				</DialogActions>
			</Dialog>
		</Form>
	)
}