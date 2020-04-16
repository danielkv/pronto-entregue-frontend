import React, { useState, useCallback } from 'react'
import { DragDropContext } from 'react-beautiful-dnd';


import { useLazyQuery, useApolloClient } from '@apollo/react-hooks';
import { CircularProgress, Paper, FormControl, TextField, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, FormHelperText, Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions } from '@material-ui/core';
import { mdiPlus, mdiBasket } from '@mdi/js';
import Icon from '@mdi/react';
import Downshift from 'downshift';
import { FieldArray, useFormikContext } from 'formik';
import { uniqueId } from 'lodash';

import { Block, BlockHeader, BlockTitle, BlockSeparator, FormRow, FieldControl } from '../../../layout/components';

import { getErrors } from '../../../utils/error';
import { sanitizeOptionsOrder } from '../../../utils/productOptions';
import { createEmptyOptionsGroup } from '../../../utils/products';
import OptionsGroupsList from './optionsGroupsList';

import { SEARCH_OPTIONS_GROUPS, LOAD_OPTION_GROUP } from '../../../graphql/products';

export default function OptionsBlock() {
	const { values: { optionsGroups }, setFieldValue } = useFormikContext();
	const [loadingCopy, setLoadingCopy] = useState(false);
	const client = useApolloClient();
	const [dragAlertOpen, setDragAlertOpen] = useState(false);
	const [searchOptionsGroups, { data: { searchOptionsGroups: groups = [] } = {}, loading: loadingGroups }] = useLazyQuery(SEARCH_OPTIONS_GROUPS, { fetchPolicy: 'no-cache' });

	const sanitizeOptionsGroupsOrder = useCallback((groups) => {
		return groups.map((row, index) => {
			row.order = index;
			if (row.action==='editable') row.action = 'update';
			return row;
		})
	}, [])

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
				console.error(getErrors(e));
			})
			.finally(()=>{
				setLoadingCopy(false);
			})
	}

	return (
		<Block>
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
			<BlockHeader>
				<BlockTitle>Opções</BlockTitle>
				{loadingCopy && <CircularProgress />}
			</BlockHeader>
			<Paper style={{ overflow: 'visible' }}>
				<FieldArray  name={`optionsGroups`}>
					{() => (
						<>
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<FormControl>
											<Downshift
												onChange={async (selected)=>{
													if (selected.action !== 'create') {
														selected = await getCopiedOptionGroup(selected);
													}
													const list = Array.from(optionsGroups);
													list.unshift({ ...selected, id: uniqueId('temp_') });
													setFieldValue('optionsGroups', sanitizeOptionsGroupsOrder(list));
												}}
												itemToString={(item => item ? item.name : '')}
												onInputValueChange={(value)=>{searchOptionsGroups({ variables: { search: value } })}}
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
														groups.push(createEmptyOptionsGroup({ id: uniqueId('temp_'), name: inputValue, action: 'create' }));

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
																			{...getItemProps({ key: group.id, index, group, item: group })}
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
									<OptionsGroupsList />
								</DragDropContext>
							</BlockSeparator>
						</>
					)}
				</FieldArray>
			</Paper>
		</Block>
	)
}
