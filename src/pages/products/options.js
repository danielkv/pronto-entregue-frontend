import React, {useRef, useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@mdi/react';
import {mdiDrag, mdiDelete, mdiInbox, mdiPencil, mdiBorderNoneVariant } from '@mdi/js'
import { Draggable} from 'react-beautiful-dnd';
import Downshift from "downshift";
import { isEqual } from 'lodash';

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

function Option ({group, option, groupIndex, optionIndex, setFieldValue, removeOption, items, errors, isSubmitting, groupRestrained}) {
	const inputName = useRef(null);
	const editing = !!option.editing;
	
	useEffect(()=>{
		if (editing && inputName.current) {
			inputName.current.focus();
			inputName.current.select();
		}
	}, [editing]);

	const nameError = !!errors.options_groups && !!errors.options_groups[groupIndex] && !!errors.options_groups[groupIndex].options && !!errors.options_groups[groupIndex].options[optionIndex] && !!errors.options_groups[groupIndex].options[optionIndex].name ? errors.options_groups[groupIndex].options[optionIndex].name : '';
	const priceError = !!errors.options_groups && !!errors.options_groups[groupIndex] && !!errors.options_groups[groupIndex].options && !!errors.options_groups[groupIndex].options[optionIndex] && !!errors.options_groups[groupIndex].options[optionIndex].price ? errors.options_groups[groupIndex].options[optionIndex].price : '';
	const maxSelectError = !!errors.options_groups && !!errors.options_groups[groupIndex] && !!errors.options_groups[groupIndex].options && !!errors.options_groups[groupIndex].options[optionIndex] && !!errors.options_groups[groupIndex].options[optionIndex].max_select_restrain_other ? errors.options_groups[groupIndex].options[optionIndex].max_select_restrain_other : '';

	return (
		<Draggable draggableId={`option.${optionIndex}.${groupIndex}.${option.id}`} index={optionIndex}>
			{(provided)=>(
				<OptionRow {...provided.draggableProps} ref={provided.innerRef}>
					<OptionColumn><div {...provided.dragHandleProps}><Icon path={mdiDrag} size='20' color='#BCBCBC' /></div></OptionColumn>
					<OptionColumn>
						{(option.editing || !option.name) ?
							<CustomTextInput
								disabled={isSubmitting}
								inputRef={inputName}
								value={option.name}
								error={!!nameError}
								helperText={nameError}
								onBlur={()=>{setFieldValue(`options_groups.${groupIndex}.options.${optionIndex}.editing`, false)}}
								onChange={(e)=>{
									let new_option = {
										...option,
										name: e.target.value,
									}
									if (option.action === 'editable') new_option.action = 'update';
									setFieldValue(`options_groups.${groupIndex}.options.${optionIndex}`, new_option);
									if (group.action === 'editable') setFieldValue(`options_groups.${groupIndex}.action`, 'update');
								}} />
							: <div>
								{option.name}
								<IconButton disabled={isSubmitting} onClick={()=>{setFieldValue(`options_groups.${groupIndex}.options.${optionIndex}.editing`, true);}}>
									<Icon path={mdiPencil} size='14' color='#707070' />
								</IconButton>
							</div>
						}
					</OptionColumn>
					<OptionsInfo>
						<OptionColumn>
							<CustomTextInput
								value={option.price}
								type='number'
								onChange={(e)=>{
									let new_option = {
										...option,
										price: parseFloat(e.target.value.replace(',', '.')),
									}
									if (option.action === 'editable') new_option.action = 'update';
									setFieldValue(`options_groups.${groupIndex}.options.${optionIndex}`, new_option);
									if (group.action === 'editable') setFieldValue(`options_groups.${groupIndex}.action`, 'update');
								}}
								error={!!priceError}
								disabled={isSubmitting}
								helperText={priceError}
								InputProps={{startAdornment:<InputAdornment position="start">R$</InputAdornment>}}
								inputProps={{step:0.01}} />
						</OptionColumn>
						<OptionColumn>
							<Downshift
								onChange={(selected)=>{
									let new_option = {
										...option,
										item: selected,
									}
									if (option.action === 'editable') new_option.action = 'update';
									setFieldValue(`options_groups.${groupIndex}.options.${optionIndex}`, new_option)
									if (group.action === 'editable') setFieldValue(`options_groups.${groupIndex}.action`, 'update');
								}}
								itemToString={(item => item ? item.name : '')}
								initialSelectedItem={option.item ? items.find(item=>item.id===option.item.id) : items[0]}
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
											<CustomTextInput disabled={isSubmitting} {...getInputProps()} />
											{isOpen && (
												<List dense={true} className="dropdown">
													{items.filter(item =>
														item.id === 'none' ||
														!inputValue ||
														item.name.toLowerCase().includes(inputValue.toLowerCase())
													)
													.map((item, index) => (
														<ListItem
															className="dropdown-item"
															selected={highlightedIndex === index}
															{...getItemProps({ key: item.id, index, item })}
															>
																<ListItemIcon><Icon path={item.id === 'none' ? mdiBorderNoneVariant : mdiInbox} color='#707070' size='20' /></ListItemIcon>
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
						{!!groupRestrained && <OptionColumn>
							<CustomTextInput
								value={option.max_select_restrain_other}
								type='number'
								onChange={(e)=>{
									let new_option = {
										...option,
										max_select_restrain_other: e.target.value,
									}
									if (option.action === 'editable') new_option.action = 'update';
									setFieldValue(`options_groups.${groupIndex}.options.${optionIndex}`, new_option);
									if (group.action === 'editable') setFieldValue(`options_groups.${groupIndex}.action`, 'update');
								}}
								disabled={isSubmitting}
								error={!!maxSelectError}
								helperText={maxSelectError}
								/>
						</OptionColumn>}
						<OptionColumn style={{width:100}}>
							<Switch
								checked={option.active}
								onChange={()=>{
									let new_option = {
										...option,
										active: !option.active,
									}
									if (option.action === 'editable') new_option.action = 'update';
									setFieldValue(`options_groups.${groupIndex}.options.${optionIndex}`, new_option)
									if (group.action === 'editable') setFieldValue(`options_groups.${groupIndex}.action`, 'update');
								}}
								value="checkedB"
								size='small'
							/>
							{(option.action === 'create' || option.action === 'new_empty') &&
							<IconButton onClick={()=>{
								if (group.action === 'editable') setFieldValue(`options_groups.${groupIndex}.action`, 'update');
								if (option.action === 'editable') setFieldValue(`options_groups.${groupIndex}.options.${optionIndex}.action`, 'remove');
								removeOption(optionIndex)}
								}>
								<Icon path={mdiDelete } size='16' color='#707070' />
							</IconButton>}
						</OptionColumn>
					</OptionsInfo>
				</OptionRow>
			)}
		</Draggable>
	)
}

export default React.memo(Option, (prevPros, nextProps) => {
	return isEqual(prevPros, nextProps);
})