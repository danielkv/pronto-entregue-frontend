import React, { useRef, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { TextField, InputAdornment, IconButton, Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { mdiDrag, mdiDelete, mdiPencil } from '@mdi/js'
import Icon from '@mdi/react';
import { isEqual } from 'lodash';

import {
	OptionColumn,
	OptionsInfo,
	OptionRow,
} from './styles';

const CustomTextInput = withStyles({
	root: {
		'& .MuiInputBase-root': {
			backgroundColor: "#fff",
		}
	}
})(TextField);

function Option ({ group, option, groupIndex, optionIndex, setFieldValue, removeOption, errors, isSubmitting, groupRestrained }) {
	const inputName = useRef(null);
	const editing = !!option.editing;
	
	useEffect(()=>{
		if (editing && inputName.current) {
			inputName.current.focus();
			inputName.current.select();
		}
	}, [editing]);

	const nameError = !!errors.optionsGroups && !!errors.optionsGroups[groupIndex] && !!errors.optionsGroups[groupIndex].options && !!errors.optionsGroups[groupIndex].options[optionIndex] && !!errors.optionsGroups[groupIndex].options[optionIndex].name ? errors.optionsGroups[groupIndex].options[optionIndex].name : '';
	const priceError = !!errors.optionsGroups && !!errors.optionsGroups[groupIndex] && !!errors.optionsGroups[groupIndex].options && !!errors.optionsGroups[groupIndex].options[optionIndex] && !!errors.optionsGroups[groupIndex].options[optionIndex].price ? errors.optionsGroups[groupIndex].options[optionIndex].price : '';
	const maxSelectError = !!errors.optionsGroups && !!errors.optionsGroups[groupIndex] && !!errors.optionsGroups[groupIndex].options && !!errors.optionsGroups[groupIndex].options[optionIndex] && !!errors.optionsGroups[groupIndex].options[optionIndex].maxSelectRestrainOther ? errors.optionsGroups[groupIndex].options[optionIndex].maxSelectRestrainOther : '';

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
								onBlur={()=>{setFieldValue(`optionsGroups.${groupIndex}.options.${optionIndex}.editing`, false)}}
								onChange={(e)=>{
									let newOption = {
										...option,
										name: e.target.value,
									}
									if (option.action === 'editable') newOption.action = 'update';
									setFieldValue(`optionsGroups.${groupIndex}.options.${optionIndex}`, newOption);
									if (group.action === 'editable') setFieldValue(`optionsGroups.${groupIndex}.action`, 'update');
								}} />
							: <div>
								{option.name}
								<IconButton disabled={isSubmitting} onClick={()=>{setFieldValue(`optionsGroups.${groupIndex}.options.${optionIndex}.editing`, true);}}>
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
									let newOption = {
										...option,
										price: parseFloat(e.target.value.replace(',', '.')),
									}
									if (option.action === 'editable') newOption.action = 'update';
									setFieldValue(`optionsGroups.${groupIndex}.options.${optionIndex}`, newOption);
									if (group.action === 'editable') setFieldValue(`optionsGroups.${groupIndex}.action`, 'update');
								}}
								error={!!priceError}
								disabled={isSubmitting}
								helperText={priceError}
								InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
								inputProps={{ step: 0.01 }} />
						</OptionColumn>
						{!!groupRestrained && <OptionColumn>
							<CustomTextInput
								value={option.maxSelectRestrainOther}
								type='number'
								onChange={(e)=>{
									let newOption = {
										...option,
										maxSelectRestrainOther: e.target.value,
									}
									if (option.action === 'editable') newOption.action = 'update';
									setFieldValue(`optionsGroups.${groupIndex}.options.${optionIndex}`, newOption);
									if (group.action === 'editable') setFieldValue(`optionsGroups.${groupIndex}.action`, 'update');
								}}
								disabled={isSubmitting}
								error={!!maxSelectError}
								helperText={maxSelectError}
							/>
						</OptionColumn>}
						<OptionColumn style={{ width: 100 }}>
							<Switch
								checked={option.active}
								onChange={()=>{
									let newOption = {
										...option,
										active: !option.active,
									}
									if (option.action === 'editable') newOption.action = 'update';
									setFieldValue(`optionsGroups.${groupIndex}.options.${optionIndex}`, newOption)
									if (group.action === 'editable') setFieldValue(`optionsGroups.${groupIndex}.action`, 'update');
								}}
								value="checkedB"
								size='small'
							/>
							{(option.action === 'create' || option.action === 'new_empty') &&
							<IconButton onClick={()=>{
								if (group.action === 'editable') setFieldValue(`optionsGroups.${groupIndex}.action`, 'update');
								if (option.action === 'editable') setFieldValue(`optionsGroups.${groupIndex}.options.${optionIndex}.action`, 'remove');
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