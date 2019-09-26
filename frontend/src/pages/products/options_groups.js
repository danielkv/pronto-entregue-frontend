import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Icon from '@mdi/react';
import {mdiDrag, mdiDelete, mdiRadioboxMarked, mdiFormatListBulleted } from '@mdi/js'
import {FieldArray, Field } from 'formik';
import {TextField, Switch, FormControl, FormLabel,  MenuItem, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Table, TableBody, TableRow, TableCell, TableHead, IconButton} from '@material-ui/core';

import Options from './options';
import { tField } from '../../layout/components';

export default function Block ({groups, group, groupIndex, setFieldValue, handleChange, errors}) {
	return (
		<ExpansionPanel key={group.id} square expanded={true} onChange={()=>{}}>
			<ExpansionPanelSummary style={{minHeight:0, padding:0}}>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell style={{width:15}}><Icon path={mdiDrag} size='20' color='#BCBCBC' /></TableCell>
							<TableCell>{group.name}</TableCell>
							<TableCell  style={{width:70}}>
								<FormControl>
									<FormLabel style={{fontSize:12, marginBottom:10}}>Tipo de seleção</FormLabel>
									<ToggleButtonGroup
										value={group.type}
										exclusive
										onChange={(e, value)=>{setFieldValue(`options_groups.${groupIndex}.type`, value);}}
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
								<TextField label='Restrito por outra opção' select value={group.max_select_restrained_by ? group.max_select_restrained_by.id : ''}>
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
							<TableCell style={{width:100}}>
								<Switch
									checked={group.active}
									onChange={()=>{setFieldValue(`options_groups.${groupIndex}.active`, !group.active);}}
									value="checkedB"
									size='small'
								/>
								<IconButton>
									<Icon path={mdiDelete} size='16' color='#363E5E' />
								</IconButton>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</ExpansionPanelSummary>
			<ExpansionPanelDetails style={{padding:0}}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell style={{width:15}}></TableCell>
							<TableCell>Nome</TableCell>
							<TableCell style={{width:70}}>Preço</TableCell>
							<TableCell style={{width:70}}>Vincular a item do estoque</TableCell>
							<TableCell style={{width:100}}>Ações</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<FieldArray name={`options_groups.${groupIndex}.options`}>
						{({insert, remove}) => (
							group.options.map((option, optionIndex)=>{
								const props = {
									option,
									groupIndex,
									optionIndex,
									insertOption:insert,
									removeOption:remove,

									errors,
									setFieldValue,
									handleChange
								}

								return <Options {...props} key={option.id} />
							})
						)}
						</FieldArray>
					</TableBody>
				</Table>
			</ExpansionPanelDetails>
		</ExpansionPanel>
	);
}