import React, { useRef } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { TextField, InputAdornment, IconButton, Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { mdiDrag, mdiDelete, mdiDeleteRestore } from '@mdi/js'
import Icon from '@mdi/react';
import { useFormikContext } from 'formik';
import { isEqual, cloneDeep } from 'lodash';

import {
	OptionColumn,
	OptionRow,
} from './styles';

const CustomTextInput = withStyles({
	root: {
		'& .MuiInputBase-root': {
			backgroundColor: "transparent",
			fontSize: 14,
		},
		'& .MuiInput-input': {
			paddingLeft: 0,
			backgroundColor: "transparent",
			border: '1px solid transparent',
			transition: 'padding .1s ease-in-out',
			
		},
		'& .MuiInput-input:hover': {
			paddingLeft: 18,
			borderColor: '#ccc',
		},
		'& .MuiInput-input:focus, & .MuiInput-input[value=""]': {
			paddingLeft: 18,
			borderColor: 'transparent',
			backgroundColor: "#fff",
		}
		
		
	}
})(TextField);

function Option ({ option, index: optionIndex, groupIndex }) {
	const inputName = useRef(null);
	const isRemoveAction = ['remove', 'remove_new'].includes(option.action);

	const { values: { optionsGroups }, errors, isSubmitting, setFieldValue } = useFormikContext();
	const group = optionsGroups[groupIndex];
	const groupRestrained = group.groupRestrained && group.groupRestrained.id ? group.groupRestrained.id : '';

	const nameError = !!errors.optionsGroups && !!errors.optionsGroups[groupIndex] && !!errors.optionsGroups[groupIndex].options && !!errors.optionsGroups[groupIndex].options[optionIndex] && !!errors.optionsGroups[groupIndex].options[optionIndex].name ? errors.optionsGroups[groupIndex].options[optionIndex].name : '';
	const descriptionError = !!errors.optionsGroups && !!errors.optionsGroups[groupIndex] && !!errors.optionsGroups[groupIndex].options && !!errors.optionsGroups[groupIndex].options[optionIndex] && !!errors.optionsGroups[groupIndex].options[optionIndex].description ? errors.optionsGroups[groupIndex].options[optionIndex].description : '';
	const priceError = !!errors.optionsGroups && !!errors.optionsGroups[groupIndex] && !!errors.optionsGroups[groupIndex].options && !!errors.optionsGroups[groupIndex].options[optionIndex] && !!errors.optionsGroups[groupIndex].options[optionIndex].price ? errors.optionsGroups[groupIndex].options[optionIndex].price : '';
	const maxSelectError = !!errors.optionsGroups && !!errors.optionsGroups[groupIndex] && !!errors.optionsGroups[groupIndex].options && !!errors.optionsGroups[groupIndex].options[optionIndex] && !!errors.optionsGroups[groupIndex].options[optionIndex].maxSelectRestrainOther ? errors.optionsGroups[groupIndex].options[optionIndex].maxSelectRestrainOther : '';

	function handleRemoveOption () {
		const newGroup = cloneDeep(optionsGroups[groupIndex]);
		const restoreAction = option.restoreAction || option.action;
		newGroup.action = 'update';

		if (isRemoveAction) {
			newGroup.options[optionIndex].action = restoreAction;
			delete newGroup.options[optionIndex].restoreAction;
		} else {
			newGroup.options[optionIndex].action = option.action === 'new_empty' ? 'remove_new' : 'remove';
			newGroup.options[optionIndex].restoreAction = restoreAction;
		}

		setFieldValue(`optionsGroups.${groupIndex}`, newGroup);
	}

	return (
		<Draggable draggableId={`option.${optionIndex}.${groupIndex}.${option.id}`} index={optionIndex}>
			{(provided)=>(
				<OptionRow {...provided.draggableProps} style={{ backgroundColor: isRemoveAction ? '#ffdfdf' : 'transparent' }} ref={provided.innerRef}>
					<OptionColumn><div {...provided.dragHandleProps}><Icon path={mdiDrag} size={1} color='#BCBCBC' /></div></OptionColumn>
					<OptionColumn>
						
						<CustomTextInput
							disabled={isSubmitting || isRemoveAction}
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
							
					</OptionColumn>
					<OptionColumn style={{ flex: 1 }}>
						<CustomTextInput
							disabled={isSubmitting || isRemoveAction}
							value={option.description}
							error={!!descriptionError}
							helperText={descriptionError}
							onBlur={()=>{setFieldValue(`optionsGroups.${groupIndex}.options.${optionIndex}.editing`, false)}}
							onChange={(e) => {
								let newOption = {
									...option,
									description: e.target.value,
								}
								if (option.action === 'editable') newOption.action = 'update';
								setFieldValue(`optionsGroups.${groupIndex}.options.${optionIndex}`, newOption);
								if (group.action === 'editable') setFieldValue(`optionsGroups.${groupIndex}.action`, 'update');
							}} />
					</OptionColumn>
					<OptionColumn style={{ width: 150 }}>
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
							disabled={isSubmitting || isRemoveAction}
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
							disabled={isSubmitting || isRemoveAction}
							error={!!maxSelectError}
							helperText={maxSelectError}
						/>
					</OptionColumn>}
					<OptionColumn style={{ width: 100 }}>
						<Switch
							checked={option.active}
							disabled={isSubmitting || isRemoveAction}
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
						<IconButton onClick={handleRemoveOption}>
							<Icon path={isRemoveAction ? mdiDeleteRestore : mdiDelete } size={.9} color={isRemoveAction ? '#dd3300' : '#707070'} />
						</IconButton>
					</OptionColumn>
				</OptionRow>
			)}
		</Draggable>
	)
}

export default React.memo(Option, (prevPros, nextProps) => {
	return isEqual(prevPros, nextProps);
})