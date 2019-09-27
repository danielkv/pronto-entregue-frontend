import React from 'react';
import numeral from 'numeral';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@mdi/react';
import {mdiDrag, mdiDelete, mdiInbox } from '@mdi/js'
import { Draggable} from 'react-beautiful-dnd';
import Downshift from "downshift";

import {TextField, InputAdornment, IconButton, Switch, ListItem, ListItemIcon, ListItemText, List} from '@material-ui/core';
import {
	OptionColumn,
	OptionsInfo,
	OptionRow,
} from './options_styles';

const CustomTextInput = withStyles({
	root : {
		'& .MuiInputBase-root' : {
			backgroundColor:"#fff",
		}
	}
})(TextField);

export default function Block ({option, groupIndex, optionIndex, setFieldValue, removeOption, items, erros}) {

	return (
		<Draggable draggableId={`option.${option.id}`} index={optionIndex}>
			{(provided, snapshot)=>(
				<OptionRow {...provided.draggableProps} ref={provided.innerRef}>
					<OptionColumn><div {...provided.dragHandleProps}><Icon path={mdiDrag} size='20' color='#BCBCBC' /></div></OptionColumn>
					<OptionColumn>{option.name}</OptionColumn>
					<OptionsInfo>
						<OptionColumn><CustomTextInput value={numeral(option.price).format('0,0.00')} InputProps={{startAdornment:<InputAdornment position="start">R$</InputAdornment>}} /></OptionColumn>
						<OptionColumn>
							<Downshift
								onChange={(selected)=>{setFieldValue(`options_groups.${groupIndex}.options.${optionIndex}.item`, selected)}}
								itemToString={(item => item ? item.name : '')}
								
								initialSelectedItem={option.item ? items.find(item=>item.id===option.item.id) : {}}
							>
								{({
									getInputProps,
									getItemProps,
									isOpen,
									inputValue,
									highlightedIndex,
								})=>{
									return (
										<div>
											<CustomTextInput {...getInputProps()} />
											{isOpen && (
												<List dense={true} className="dropdown">
													{items
														.filter(
															item =>
																!inputValue ||
																item.name.toLowerCase().includes(inputValue.toLowerCase())
															)
															.map((item, index) => (
																<ListItem
																	className="dropdown-item"
																	selected={highlightedIndex === index}
																	{...getItemProps({ key: item.id, index, item })}
																	>
																		<ListItemIcon><Icon path={mdiInbox} color='#707070' size='20' /></ListItemIcon>
																		<ListItemText>{item.name}</ListItemText>
																</ListItem>
															))}
												</List>
											)}
										</div>
									)
								}}
							</Downshift>
						</OptionColumn>
						<OptionColumn style={{width:100}}>
							<Switch
								checked={option.active}
								onChange={()=>{setFieldValue(`options_groups.${groupIndex}.options.${optionIndex}.active`, !option.active)}}
								value="checkedB"
								size='small'
							/>
							{(option.action === 'create' || option.action === 'new_empty') &&
							<IconButton onClick={()=>removeOption()}>
								<Icon path={mdiDelete } size='16' color='#707070' />
							</IconButton>}
						</OptionColumn>
					</OptionsInfo>
				</OptionRow>
			)}
		</Draggable>
	)
}