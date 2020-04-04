import React, { useEffect, useRef } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import { TextField, Switch, FormControl, FormLabel,  MenuItem, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Table, TableBody, TableRow, TableCell, IconButton, Checkbox, FormControlLabel } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { mdiDrag, mdiDelete, mdiRadioboxMarked, mdiFormatListBulleted, mdiPlusCircle, mdiPencil, mdiAlertCircle } from '@mdi/js'
import Icon from '@mdi/react';
import { FieldArray, useFormikContext } from 'formik';
import { isEqual } from 'lodash';

import { sanitizeOptionsOrder } from '../../../../utils/productOptions';
import { createEmptyOption } from '../../../../utils/products';
import Options from '../optionsGroupsList/options';
import {
	OptionsContainer,
	OptionHead,
	OptionColumn,
	OptionsInfo,
} from './styles';

function GroupItem ({ group, index: groupIndex, groupsHelpers }) {
	const { values: { optionsGroups }, errors, setFieldValue, isSubmitting } = useFormikContext();
	const inputName = useRef(null);
	const editing = !!group.editing;
	
	useEffect(()=>{
		if (editing && inputName.current) {
			inputName.current.focus();
			inputName.current.select();
		}
	}, [editing]);

	const nameError = !!errors.optionsGroups && !!errors.optionsGroups[groupIndex] && !!errors.optionsGroups[groupIndex].name ? errors.optionsGroups[groupIndex].name : '';
	const minSelectError = !!errors.optionsGroups && !!errors.optionsGroups[groupIndex] && !!errors.optionsGroups[groupIndex].minSelect ? errors.optionsGroups[groupIndex].minSelect : '';
	const maxSelectError = !!errors.optionsGroups && !!errors.optionsGroups[groupIndex] && !!errors.optionsGroups[groupIndex].maxSelect ? errors.optionsGroups[groupIndex].maxSelect : '';
	const groupRestrained = group.groupRestrained && group.groupRestrained.id ? group.groupRestrained.id : '';
	const restrainedBy = group.restrainedBy && group.restrainedBy.id;
	
	const filteredGroups = optionsGroups.filter(g=>{
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
			{(provided) => (
				<ExpansionPanel {...provided.draggableProps} ref={provided.innerRef} key={group.id} square expanded={!!group.open} onChange={(e, value)=>{setFieldValue(`optionsGroups.${groupIndex}.open`, value)}}>
					<ExpansionPanelSummary style={{ minHeight: 0, padding: 0 }}>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell style={{ width: 15 }}><div {...provided.dragHandleProps}><Icon path={mdiDrag} size={1} color='#BCBCBC' /></div></TableCell>
									<TableCell>
										{(group.editing || !group.name) ?
											<TextField
												inputRef={inputName}
												onClick={(e)=>e.stopPropagation()}
												onBlur={()=>{setFieldValue(`optionsGroups.${groupIndex}.editing`, false)}}
												value={group.name}
												error={!!nameError}
												helperText={nameError}
												onChange={(e)=>{
													let newGroup = {
														...group,
														name: e.target.value,
													}
													if (group.action === 'editable') newGroup.action = 'update';
													setFieldValue(`optionsGroups.${groupIndex}`, newGroup);
												}}
												disabled={isSubmitting} />
											: <span>
												{group.name}
												<IconButton disabled={isSubmitting} onClick={(e)=>{e.stopPropagation(); setFieldValue(`optionsGroups.${groupIndex}.editing`, true);}}>
													<Icon path={mdiPencil} size={1} color='#707070' />
												</IconButton>
											</span>
										}
										{
											!!errors.optionsGroups && !!errors.optionsGroups[groupIndex] &&
											<Icon path={mdiAlertCircle} color='#f44336' size={1} />
										}
									</TableCell>
									<TableCell  style={{ width: 280 }}>
										<FormControl>
											<TextField label='Seleção de preço' select
												onClick={(e)=>{e.stopPropagation();}}
												disabled={isSubmitting}
												onChange={(e)=>{
													let newGroup = {
														...group,
														priceType: e.target.value,
													}
													if (group.action === 'editable') newGroup.action = 'update';
													setFieldValue(`optionsGroups.${groupIndex}`, newGroup);
												}}
												value={group.priceType}
											>
												<MenuItem value='sum'>Somar opções selecionadas</MenuItem>
												<MenuItem value='higher'>Condiderar valor mais alto</MenuItem>
											</TextField>
										</FormControl>
									</TableCell>
									<TableCell  style={{ width: 70 }}>
										<FormControl>
											<FormLabel style={{ fontSize: 12, marginBottom: 10 }}>Tipo de seleção</FormLabel>
											<ToggleButtonGroup
												value={group.type}
												exclusive
												onChange={(e, value)=>{
													e.stopPropagation();
													let newGroup = {
														...group,
														type: value,
													}
													if (group.action === 'editable') newGroup.action = 'update';
													setFieldValue(`optionsGroups.${groupIndex}`, newGroup);
												}}
												aria-label="text alignment"
											>
												<ToggleButton disabled={isSubmitting || !!groupRestrained || !!restrainedBy} value="single" title="Única" aria-label="left aligned">
													<Icon path={mdiRadioboxMarked} size={1} color='#707070' />
												</ToggleButton>
												<ToggleButton disabled={isSubmitting || !!groupRestrained || !!restrainedBy} value="multi" title="Múltipla" aria-label="left aligned">
													<Icon path={mdiFormatListBulleted} size={1} color='#707070' />
												</ToggleButton>
											</ToggleButtonGroup>
										</FormControl>
									</TableCell>
									{group.type === 'single' &&
										<TableCell style={{ width: 150 }}>
											<FormControlLabel
												onClick={(e)=>{e.stopPropagation();}}
												control={
													<Checkbox checked={group.minSelect > 0}
														onClick={(e)=>{e.stopPropagation();}}
														disabled={isSubmitting || !!groupRestrained}
														value="checkedA"
														onChange={(e, newValue)=>{
															if (newValue) {
																setFieldValue(`optionsGroups.${groupIndex}`, {
																	...group,
																	action: group.action === 'editable' ? 'update' : group.action,
																	minSelect: 1,
																	maxSelect: 1,
																})
															} else {
																setFieldValue(`optionsGroups.${groupIndex}`, {
																	...group,
																	action: group.action === 'editable' ? 'update' : group.action,
																	minSelect: 0,
																	maxSelect: 1,
																})
															}
														}}
													/>
												}
												label="Obrigatório"
											/>
										</TableCell>}
									{group.type === 'multi' &&
										<TableCell style={{ width: 150 }}>
											<TextField
												label='Seleção mínima'
												name={`optionsGroups.${groupIndex}.minSelect`}
												value={group.minSelect}
												type='number'
												onClick={(e)=>{e.stopPropagation();}}
												onChange={(e)=>{
													let newGroup = {
														...group,
														minSelect: parseInt(e.target.value),
													}
													if (newGroup.action === 'editable') newGroup.action = 'update';
													setFieldValue(`optionsGroups.${groupIndex}`, newGroup);
												}}
												error={!!minSelectError}
												helperText={minSelectError}
												disabled={isSubmitting}
											/>
										</TableCell>}
									{group.type === 'multi' && !restrainedBy &&
										<TableCell style={{ width: 150 }}>
											<TextField
												label='Seleção máxima'
												name={`optionsGroups.${groupIndex}.maxSelect`}
												value={group.maxSelect}
												type='number'
												onClick={(e)=>{e.stopPropagation();}}
												onChange={(e)=>{
													let newGroup = {
														...group,
														maxSelect: parseInt(e.target.value),
													}
													if (newGroup.action === 'editable') newGroup.action = 'update';
													setFieldValue(`optionsGroups.${groupIndex}`, newGroup);
												}}
												error={!!maxSelectError}
												helperText={maxSelectError}
												disabled={isSubmitting}
											/>
										</TableCell>}
									{!!filteredGroups.length &&
										<TableCell style={{ width: 210 }}>
											<TextField label='Restringir outra opção' select
												onClick={(e)=>{e.stopPropagation();}}
												disabled={isSubmitting}
												onChange={(e)=>{
													optionsGroups[groupIndex].groupRestrained = { id: e.target.value };
													if (group.action === 'editable') optionsGroups[groupIndex].action = 'update';
													
													if (groupRestrained && groupRestrained !== group.id) {
														let groupOtherIndex = optionsGroups.findIndex(row=>row.id === groupRestrained);
														optionsGroups[groupOtherIndex].restrainedBy = null;
													}
													if (e.target.value) {
														optionsGroups[groupIndex].minSelect = 1;
														optionsGroups[groupIndex].maxSelect = 1;
														optionsGroups[groupIndex].type = 'single';

														let groupOtherIndex = optionsGroups.findIndex(row=>row.id === e.target.value);
														optionsGroups[groupOtherIndex].restrainedBy = { id: group.id };
														optionsGroups[groupOtherIndex].type = 'multi';
													}

													setFieldValue(`optionsGroups`, optionsGroups);
												}}
												value={groupRestrained}
											>
												<MenuItem value=''>-- Não restringir --</MenuItem>
												{filteredGroups.map(group=>{
													return (<MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>)
												})}
											</TextField>
										</TableCell>}
									<TableCell style={{ width: 130 }}>
										<Switch
											disabled={isSubmitting}
											checked={group.active}
											onClick={(e)=>{e.stopPropagation();}}
											onChange={()=>{
												let newGroup = {
													...group,
													active: !group.active,
												}
												if (group.action === 'editable') newGroup.action = 'update';
												setFieldValue(`optionsGroups.${groupIndex}`, newGroup);
											}}
											value="checkedB"
											size='small'
										/>
										<IconButton
											disabled={isSubmitting}
											onClick={(e)=>{
												e.stopPropagation();
												group.options.unshift(createEmptyOption({ editing: true, action: 'create', id: Math.round(Math.random()*1000) }))
												const newGroup = {
													...sanitizeOptionsOrder(group),
													open: true,
													action: group.action === 'editable' ? 'update' : group.action
												}
												setFieldValue(`optionsGroups.${groupIndex}`, newGroup);
											}}>
											<Icon path={mdiPlusCircle} size={.7} color='#363E5E' />
										</IconButton>
										{(group.action === 'new_empty' || group.action === 'create') &&
											<IconButton disabled={isSubmitting} onClick={(e)=>{e.stopPropagation(); if (group.action === 'editable') setFieldValue(`optionsGroups.${groupIndex}.action`, 'update'); groupsHelpers.remove(groupIndex)}}>
												<Icon path={mdiDelete} size={.7} color='#363E5E' />
											</IconButton>}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails style={{ padding: 0 }}>
						<FieldArray name={`optionsGroups.${groupIndex}.options`}>
							{(optionsHelpers) => (
								<OptionsContainer>
									<OptionHead>
										<OptionColumn className='spaceDraggable'>Nome</OptionColumn>
										<OptionsInfo>
											<OptionColumn>Preço</OptionColumn>
											{!!groupRestrained && <OptionColumn>Restrigir seleção</OptionColumn>}
											<OptionColumn style={{ width: 100 }}>Ações</OptionColumn>
										</OptionsInfo>
									</OptionHead>
									<Droppable droppableId={`optionGroup.${groupIndex}`} type='option'>
										{(provided)=>(
											<div ref={provided.innerRef} {...provided.droppableProps}>
												{group.options.map((option, index)=>{
													
													return <Options key={`${index}.${option.id}`} option={option} index={index} optionsHelpers={optionsHelpers} groupIndex={groupIndex} />
												})}
												{provided.placeholder}
											</div>
										)}
									</Droppable>
									
								</OptionsContainer>
							)}
						</FieldArray>
					</ExpansionPanelDetails>
				</ExpansionPanel>
			)}
		</Draggable>
	);
}

export default React.memo(GroupItem, (prevPros, nextProps) => {
	return isEqual(prevPros, nextProps);
})