import React, {useRef, useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@mdi/react';
import {mdiDrag, mdiDelete, mdiInbox, mdiPencil } from '@mdi/js'
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
	const inputName = useRef(null);
	const editing = !!option.editing;
	
	useEffect(()=>{
		if (editing && inputName.current) {
			inputName.current.focus();
			inputName.current.select();
		}
	}, [editing]);

	return (
		<Draggable draggableId={`option.${optionIndex}.${groupIndex}.${option.id}`} index={optionIndex}>
			{(provided)=>(
				<OptionRow {...provided.draggableProps} ref={provided.innerRef}>
					<OptionColumn><div {...provided.dragHandleProps}><Icon path={mdiDrag} size='20' color='#BCBCBC' /></div></OptionColumn>
					<OptionColumn>
						{(option.editing) ?
							<CustomTextInput inputRef={inputName} onBlur={()=>{setFieldValue(`options_groups.${groupIndex}.options.${optionIndex}.editing`, false)}} value={option.name} onChange={(e)=>{setFieldValue(`options_groups.${groupIndex}.options.${optionIndex}.name`, e.target.value)}} />
							: <div>
								{option.name}
								<IconButton onClick={()=>{setFieldValue(`options_groups.${groupIndex}.options.${optionIndex}.editing`, true);}}>
									<Icon path={mdiPencil} size='14' color='#707070' />
								</IconButton>
							</div>
						}
					</OptionColumn>
					<OptionsInfo>
						<OptionColumn>
							<CustomTextInput value={option.price} onChange={(e)=>{setFieldValue(`options_groups.${groupIndex}.options.${optionIndex}.price`, e.target.value);}} InputProps={{startAdornment:<InputAdornment position="start">R$</InputAdornment>}} />
						</OptionColumn>
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
													{items.filter(item =>
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
							<IconButton onClick={()=>removeOption(optionIndex)}>
								<Icon path={mdiDelete } size='16' color='#707070' />
							</IconButton>}
						</OptionColumn>
					</OptionsInfo>
				</OptionRow>
			)}
		</Draggable>
	)
}