import React, {useEffect, useRef} from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Icon from '@mdi/react';
import {mdiDrag, mdiDelete, mdiRadioboxMarked, mdiFormatListBulleted, mdiPlusCircle, mdiPencil} from '@mdi/js'
import {FieldArray, Field } from 'formik';
import {TextField, Switch, FormControl, FormLabel,  MenuItem, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Table, TableBody, TableRow, TableCell, IconButton} from '@material-ui/core';
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

export default function Block ({groups, group, groupIndex, setFieldValue, removeGroup, handleChange, errors, items}) {
	const inputName = useRef(null);
	const editing = !!group.editing;
	
	useEffect(()=>{
		if (editing && inputName.current) {
			inputName.current.focus();
			inputName.current.select();
		}
	}, [editing]);

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
										{(group.editing) ?
											<TextField inputRef={inputName} onClick={(e)=>e.stopPropagation()} onBlur={()=>{setFieldValue(`options_groups.${groupIndex}.editing`, false)}} value={group.name} onChange={(e)=>{setFieldValue(`options_groups.${groupIndex}.name`, e.target.value)}} />
											: <div>
												{group.name}
												<IconButton onClick={(e)=>{e.stopPropagation(); setFieldValue(`options_groups.${groupIndex}.editing`, true);}}>
													<Icon path={mdiPencil} size='14' color='#707070' />
												</IconButton>
											</div>
										}
										</TableCell>
										<TableCell  style={{width:70}}>
											<FormControl>
												<FormLabel style={{fontSize:12, marginBottom:10}}>Tipo de seleção</FormLabel>
												<ToggleButtonGroup
													value={group.type}
													exclusive
													onChange={(e, value)=>{e.stopPropagation(); setFieldValue(`options_groups.${groupIndex}.type`, value);}}
													aria-label="text alignment"
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
										<TableCell style={{width:210}}>
											{groups.length > 1 &&
											<TextField label='Restrito por outra opção' select
												onClick={(e)=>{e.stopPropagation();}}
												onChange={(e)=>{setFieldValue(`options_groups.${groupIndex}.max_select_restrained_by`, e.target.value)}}
												value={group.max_select_restrained_by ? group.max_select_restrained_by : ''}
												>
												<MenuItem value=''>-- Não restringir --</MenuItem>
												{groups.filter(g=>g.id !== group.id).map(g=>{
													return (<MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)
												})}
											</TextField>}
										</TableCell>
										<TableCell style={{width:150}}>
											<Field type='number' component={tField} name={`options_groups.${groupIndex}.min_select`} label='Seleção mínima' />
										</TableCell>
										<TableCell style={{width:150}}>
											<Field type='number' component={tField} name={`options_groups.${groupIndex}.max_select`} label='Seleção máxima' />
										</TableCell>
										<TableCell style={{width:120}}>
											<Switch
												checked={group.active}
												onClick={(e)=>{e.stopPropagation();}}
												onChange={(e)=>{setFieldValue(`options_groups.${groupIndex}.active`, !group.active);}}
												value="checkedB"
												size='small'
											/>
											<IconButton onClick={(e)=>{e.stopPropagation(); setFieldValue(`options_groups.${groupIndex}.open`, true); insert(0, createEmptyOption({editing:true}))}}>
												<Icon path={mdiPlusCircle} size='16' color='#363E5E' />
											</IconButton>
											{(group.action === 'new_empty' || group.action === 'create') &&
											<IconButton onClick={(e)=>{e.stopPropagation(); removeGroup(groupIndex)}}>
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
										<OptionColumn style={{width:100}}>Ações</OptionColumn>
									</OptionsInfo>
								</OptionHead>
							
										<Droppable droppableId={`optionGroup.${groupIndex}`} type='option'>
											{(provided, snapshot)=>(
												<div ref={provided.innerRef} {...provided.droppableProps}>
													{group.options.map((option, optionIndex)=>{
														const props = {
															option,
															groupIndex,
															optionIndex,
															insertOption:insert,
															removeOption:remove,
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