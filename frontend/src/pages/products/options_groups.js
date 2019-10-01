import React, {useEffect, useRef} from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Icon from '@mdi/react';
import {mdiDrag, mdiDelete, mdiRadioboxMarked, mdiFormatListBulleted, mdiPlusCircle, mdiPencil, mdiAlertCircle} from '@mdi/js'
import {FieldArray, Field } from 'formik';
import {TextField, Switch, FormControl, FormLabel,  MenuItem, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Table, TableBody, TableRow, TableCell, IconButton, Checkbox, FormControlLabel} from '@material-ui/core';
import { Droppable, Draggable} from 'react-beautiful-dnd';

import {
	OptionsContainer,
	OptionHead,
	OptionColumn,
	OptionsInfo,
} from './options_styles';
import Options from './options';
import {createEmptyOption} from '../../utils';
import { tField } from '../../layout/components';

export default function Block ({groups, group, groupIndex, setFieldValue, removeGroup, handleChange, errors, items, isSubmitting, sanitizeOptionsGroupsOrder, sanitizeOptionsOrder}) {
	const inputName = useRef(null);
	const editing = !!group.editing;
	
	useEffect(()=>{
		if (editing && inputName.current) {
			inputName.current.focus();
			inputName.current.select();
		}
	}, [editing]);

	const nameError = !!errors.options_groups && !!errors.options_groups[groupIndex] && !!errors.options_groups[groupIndex].name ? errors.options_groups[groupIndex].name : '';
	const groupRestrained = group.groupRestrained && group.groupRestrained.id ? group.groupRestrained.id : '';
	const restrainedBy = group.restrainedBy && group.restrainedBy.id;

	return (
		<Draggable draggableId={`group.${groupIndex}.${group.id}`} index={groupIndex}>
			{(provided, snapshot)=>(
			<FieldArray name={`options_groups.${groupIndex}.options`}>
				{({insert, remove}) => (
					<ExpansionPanel {...provided.draggableProps} ref={provided.innerRef} key={group.id} square expanded={group.open} onChange={(e, value)=>{setFieldValue(`options_groups.${groupIndex}.open`, value)}}>
						<ExpansionPanelSummary style={{minHeight:0, padding:0}}>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell style={{width:15}}><div {...provided.dragHandleProps}><Icon path={mdiDrag} size='20' color='#BCBCBC' /></div></TableCell>
										<TableCell>
										{(group.editing || !group.name) ?
											<TextField
												inputRef={inputName}
												onClick={(e)=>e.stopPropagation()}
												onBlur={()=>{setFieldValue(`options_groups.${groupIndex}.editing`, false)}}
												value={group.name}
												error={!!nameError}
												helperText={nameError}
												onChange={(e)=>{
													let new_group = {
														...group,
														name: e.target.value,
													}
													if (group.action === 'editable') new_group.action = 'update';
													setFieldValue(`options_groups.${groupIndex}`, new_group);
												}}
												disabled={isSubmitting} />
											: <span>
												{group.name}
												<IconButton disabled={isSubmitting} onClick={(e)=>{e.stopPropagation(); setFieldValue(`options_groups.${groupIndex}.editing`, true);}}>
													<Icon path={mdiPencil} size='14' color='#707070' />
												</IconButton>
											</span>
										}
										{
											!!errors.options_groups && !!errors.options_groups[groupIndex] &&
											<Icon path={mdiAlertCircle} color='#f44336' size='18' />
										}
										</TableCell>
										<TableCell  style={{width:70}}>
											<FormControl>
												<FormLabel style={{fontSize:12, marginBottom:10}}>Tipo de seleção</FormLabel>
												<ToggleButtonGroup
													value={group.type}
													exclusive
													onChange={(e, value)=>{
														e.stopPropagation();
														let new_group = {
															...group,
															type: value,
														}
														if (group.action === 'editable') new_group.action = 'update';
														setFieldValue(`options_groups.${groupIndex}`, new_group);
													}}
													aria-label="text alignment"
													disabled={isSubmitting}
												>
													<ToggleButton value="single" title="Única" aria-label="left aligned">
														<Icon path={mdiRadioboxMarked} size='16' color='#707070' />
													</ToggleButton>
													<ToggleButton value="multiple" title="Múltipla" aria-label="left aligned">
														<Icon path={mdiFormatListBulleted} size='16' color='#707070' />
													</ToggleButton>
												</ToggleButtonGroup>
											</FormControl>
										</TableCell>
										{groups.length > 1 &&
										<TableCell style={{width:210}}>
											<TextField label='Restringir outra opção' select
												onClick={(e)=>{e.stopPropagation();}}
												disabled={isSubmitting}
												onChange={(e)=>{
													let new_group = {
														...group,
														groupRestrained: {
															id: e.target.value
														}
													}
													if (group.action === 'editable') new_group.action = 'update';
													setFieldValue(`options_groups.${groupIndex}`, new_group);
												}}
												value={groupRestrained}
												>
												<MenuItem value=''>-- Não restringir --</MenuItem>
												{groups.filter(g=>g.id !== group.id).map(g=>{
													return (<MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)
												})}
											</TextField>
										</TableCell>}
										{group.type === 'multiple' &&
										<TableCell style={{width:150}}>
											<Field type='number' onChange={()=>{if (group.action === 'editable') setFieldValue(`options_groups.${groupIndex}.action`, 'update');}} component={tField} name={`options_groups.${groupIndex}.min_select`} label='Seleção mínima' />
										</TableCell>}
										{group.type === 'multiple' && !restrainedBy &&
										<TableCell style={{width:150}}>
											<Field type='number' onChange={()=>{if (group.action === 'editable') setFieldValue(`options_groups.${groupIndex}.action`, 'update');}} component={tField} name={`options_groups.${groupIndex}.max_select`} label='Seleção máxima' />
										</TableCell>}
										{group.type === 'single' &&
										<TableCell style={{width:150}}>
											<FormControlLabel
												onClick={(e)=>{e.stopPropagation();}}
												control={
													<Checkbox checked={group.min_select > 0}
														onClick={(e)=>{e.stopPropagation();}}
														value="checkedA"
														onChange={(e, newValue)=>{
															if (newValue) {
																setFieldValue(`options_groups.${groupIndex}`, {
																	...group,
																	action : group.action === 'editable' ? 'update' : group.action,
																	min_select : 1,
																	max_select : 1,
																})
															} else {
																setFieldValue(`options_groups.${groupIndex}`, {
																	...group,
																	action : group.action === 'editable' ? 'update' : group.action,
																	min_select : 0,
																	max_select : 1,
																})
															}
														}} 
														/>
												}
												label="Obrigatório"
											/>
										</TableCell>}
										<TableCell style={{width:120}}>
											<Switch
												disabled={isSubmitting}
												checked={group.active}
												onClick={(e)=>{e.stopPropagation();}}
												onChange={(e)=>{
													let new_group = {
														...group,
														active: !group.active,
													}
													if (group.action === 'editable') new_group.action = 'update';
													setFieldValue(`options_groups.${groupIndex}`, new_group);
												}}
												value="checkedB"
												size='small'
											/>
											<IconButton
												disabled={isSubmitting}
												onClick={(e)=>{
													e.stopPropagation();
													group.options.unshift(createEmptyOption({editing:true, action:'create'}))
													const new_group = {
														...sanitizeOptionsOrder(group),
														open:true,
														action: group.action === 'editable' ? 'update' : group.action
													}
													setFieldValue(`options_groups.${groupIndex}`, new_group);
													}}>
												<Icon path={mdiPlusCircle} size='16' color='#363E5E' />
											</IconButton>
											{(group.action === 'new_empty' || group.action === 'create') &&
											<IconButton disabled={isSubmitting} onClick={(e)=>{e.stopPropagation(); if (group.action === 'editable') setFieldValue(`options_groups.${groupIndex}.action`, 'update'); removeGroup(groupIndex)}}>
												<Icon path={mdiDelete} size='16' color='#363E5E' />
											</IconButton>}
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails style={{padding:0}}>
							<OptionsContainer>
								<OptionHead>
									<OptionColumn className='spaceDraggable'>Nome</OptionColumn>
									<OptionsInfo>
										<OptionColumn>Preço</OptionColumn>
										<OptionColumn>Vincular a item de estoque</OptionColumn>
										{!!groupRestrained && <OptionColumn>Restrigir seleção</OptionColumn>}
										<OptionColumn style={{width:100}}>Ações</OptionColumn>
									</OptionsInfo>
								</OptionHead>
										<Droppable droppableId={`optionGroup.${groupIndex}`} type='option'>
											{(provided, snapshot)=>(
												<div ref={provided.innerRef} {...provided.droppableProps}>
													{group.options.map((option, optionIndex)=>{
														const props = {
															option,
															group, 
															sanitizeOptionsGroupsOrder,
															sanitizeOptionsOrder,
															groupRestrained,
															groupIndex,
															optionIndex,
															insertOption:insert,
															removeOption:remove,
															isSubmitting,
															items,

															errors,
															setFieldValue,
															handleChange
														}

														return <Options
															{...props}
															key={`${groupIndex}.${optionIndex}.${option.id}`} />
													})}
													{provided.placeholder}
												</div>
											)}
										</Droppable>
									
							</OptionsContainer>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				)}
			</FieldArray>
			)}
		</Draggable>
	);
}