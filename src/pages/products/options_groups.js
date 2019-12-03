import React, {useEffect, useRef} from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Icon from '@mdi/react';
import {mdiDrag, mdiDelete, mdiRadioboxMarked, mdiFormatListBulleted, mdiPlusCircle, mdiPencil, mdiAlertCircle} from '@mdi/js'
import {FieldArray } from 'formik';
import {TextField, Switch, FormControl, FormLabel,  MenuItem, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Table, TableBody, TableRow, TableCell, IconButton, Checkbox, FormControlLabel} from '@material-ui/core';
import { Droppable, Draggable} from 'react-beautiful-dnd';
import { isEqual } from 'lodash';

import {
	OptionsContainer,
	OptionHead,
	OptionColumn,
	OptionsInfo,
} from './options_styles';
import Options from './options';
import {createEmptyOption} from '../../utils';

function OptionGroup ({groups, group, groupIndex, setFieldValue, removeGroup, handleChange, errors, items, isSubmitting, sanitizeOptionsGroupsOrder, sanitizeOptionsOrder}) {
	const inputName = useRef(null);
	const editing = !!group.editing;
	
	useEffect(()=>{
		if (editing && inputName.current) {
			inputName.current.focus();
			inputName.current.select();
		}
	}, [editing]);

	const nameError = !!errors.options_groups && !!errors.options_groups[groupIndex] && !!errors.options_groups[groupIndex].name ? errors.options_groups[groupIndex].name : '';
	const minSelectError = !!errors.options_groups && !!errors.options_groups[groupIndex] && !!errors.options_groups[groupIndex].min_select ? errors.options_groups[groupIndex].min_select : '';
	const maxSelectError = !!errors.options_groups && !!errors.options_groups[groupIndex] && !!errors.options_groups[groupIndex].max_select ? errors.options_groups[groupIndex].max_select : '';
	const groupRestrained = group.groupRestrained && group.groupRestrained.id ? group.groupRestrained.id : '';
	const restrainedBy = group.restrainedBy && group.restrainedBy.id;
	
	const filteredGroups = groups.filter(g=>{
		if (!(group.groupRestrained && group.groupRestrained.id) && g.restrainedBy && g.restrainedBy.id) return false;
		if (g.groupRestrained && g.groupRestrained.id) return false;

		if (g.id !== group.id) {
			if (!group.restrainedBy || !group.restrainedBy.id) return true;
			if (parseInt(group.restrainedBy.id) !== parseInt(g.id)) return true;
		}
		return false;
	});

	return (
		<Draggable draggableId={`group.${groupIndex}.${group.id}`} index={groupIndex}>
			{(provided, snapshot)=>(
			<FieldArray name={`options_groups.${groupIndex}.options`}>
				{({insert, remove}) => (
					<ExpansionPanel {...provided.draggableProps} ref={provided.innerRef} key={group.id} square expanded={!!group.open} onChange={(e, value)=>{setFieldValue(`options_groups.${groupIndex}.open`, value)}}>
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
												>
													<ToggleButton disabled={isSubmitting || !!groupRestrained || !!restrainedBy} value="single" title="Única" aria-label="left aligned">
														<Icon path={mdiRadioboxMarked} size='16' color='#707070' />
													</ToggleButton>
													<ToggleButton disabled={isSubmitting || !!groupRestrained || !!restrainedBy} value="multi" title="Múltipla" aria-label="left aligned">
														<Icon path={mdiFormatListBulleted} size='16' color='#707070' />
													</ToggleButton>
												</ToggleButtonGroup>
											</FormControl>
										</TableCell>
										{group.type === 'single' &&
										<TableCell style={{width:150}}>
											<FormControlLabel
												onClick={(e)=>{e.stopPropagation();}}
												control={
													<Checkbox checked={group.min_select > 0}
														onClick={(e)=>{e.stopPropagation();}}
														disabled={isSubmitting || !!groupRestrained}
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
										{group.type === 'multi' &&
										<TableCell style={{width:150}}>
											<TextField
												label='Seleção mínima'
												name={`options_groups.${groupIndex}.min_select`}
												value={group.min_select}
												type='number'
												onClick={(e)=>{e.stopPropagation();}}
												onChange={(e)=>{
													let new_group = {
														...group,
														min_select: parseInt(e.target.value),
													}
													if (new_group.action === 'editable') new_group.action = 'update';
													setFieldValue(`options_groups.${groupIndex}`, new_group);
												}}
												error={!!minSelectError}
												helperText={minSelectError}
												disabled={isSubmitting}
												/>
										</TableCell>}
										{group.type === 'multi' && !restrainedBy &&
										<TableCell style={{width:150}}>
											<TextField
												label='Seleção máxima'
												name={`options_groups.${groupIndex}.max_select`}
												value={group.max_select}
												type='number'
												onClick={(e)=>{e.stopPropagation();}}
												onChange={(e)=>{
													let new_group = {
														...group,
														max_select: parseInt(e.target.value),
													}
													if (new_group.action === 'editable') new_group.action = 'update';
													setFieldValue(`options_groups.${groupIndex}`, new_group);
												}}
												error={!!maxSelectError}
												helperText={maxSelectError}
												disabled={isSubmitting}
												/>
										</TableCell>}
										{!!filteredGroups.length &&
										<TableCell style={{width:210}}>
											<TextField label='Restringir outra opção' select
												onClick={(e)=>{e.stopPropagation();}}
												disabled={isSubmitting}
												onChange={(e)=>{
													groups[groupIndex].groupRestrained = {id: e.target.value};
													if (group.action === 'editable') groups[groupIndex].action = 'update';
													
													if (groupRestrained && groupRestrained !== group.id) {
														let groupOtherIndex = groups.findIndex(row=>row.id === groupRestrained);
														groups[groupOtherIndex].restrainedBy = null;
													}
													if (e.target.value) {
														groups[groupIndex].min_select = 1;
														groups[groupIndex].max_select = 1;
														groups[groupIndex].type = 'single';

														let groupOtherIndex = groups.findIndex(row=>row.id === e.target.value);
														groups[groupOtherIndex].restrainedBy = {id: group.id};
														groups[groupOtherIndex].type = 'multi';
													}

													setFieldValue(`options_groups`, groups);
												}}
												value={groupRestrained}
												>
												<MenuItem value=''>-- Não restringir --</MenuItem>
												{filteredGroups.map(g=>{
													return (<MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)
												})}
											</TextField>
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
													group.options.unshift(createEmptyOption({editing:true, action:'create', id:Math.round(Math.random()*1000)}))
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

export default React.memo(OptionGroup, (prevPros, nextProps) => {
	return isEqual(prevPros, nextProps);
})