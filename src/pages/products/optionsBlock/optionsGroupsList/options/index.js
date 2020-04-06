import React, { useRef } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { TextField, InputAdornment, IconButton, Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { mdiDrag, mdiDelete } from '@mdi/js'
import Icon from '@mdi/react';
import { useFormikContext } from 'formik';
import { isEqual } from 'lodash';

import {
	OptionColumn,
	OptionsInfo,
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

function Option ({ option, index: optionIndex, groupIndex, optionsHelpers }) {
	const inputName = useRef(null);

	const { values: { optionsGroups }, errors, isSubmitting, setFieldValue } = useFormikContext();
	const group = optionsGroups[groupIndex];
	const groupRestrained = group.groupRestrained && group.groupRestrained.id ? group.groupRestrained.id : '';

	const nameError = !!errors.optionsGroups && !!errors.optionsGroups[groupIndex] && !!errors.optionsGroups[groupIndex].options && !!errors.optionsGroups[groupIndex].options[optionIndex] && !!errors.optionsGroups[groupIndex].options[optionIndex].name ? errors.optionsGroups[groupIndex].options[optionIndex].name : '';
	const descriptionError = !!errors.optionsGroups && !!errors.optionsGroups[groupIndex] && !!errors.optionsGroups[groupIndex].options && !!errors.optionsGroups[groupIndex].options[optionIndex] && !!errors.optionsGroups[groupIndex].options[optionIndex].description ? errors.optionsGroups[groupIndex].options[optionIndex].description : '';
	const priceError = !!errors.optionsGroups && !!errors.optionsGroups[groupIndex] && !!errors.optionsGroups[groupIndex].options && !!errors.optionsGroups[groupIndex].options[optionIndex] && !!errors.optionsGroups[groupIndex].options[optionIndex].price ? errors.optionsGroups[groupIndex].options[optionIndex].price : '';
	const maxSelectError = !!errors.optionsGroups && !!errors.optionsGroups[groupIndex] && !!errors.optionsGroups[groupIndex].options && !!errors.optionsGroups[groupIndex].options[optionIndex] && !!errors.optionsGroups[groupIndex].options[optionIndex].maxSelectRestrainOther ? errors.optionsGroups[groupIndex].options[optionIndex].maxSelectRestrainOther : '';

	return (
		<Draggable draggableId={`option.${optionIndex}.${groupIndex}.${option.id}`} index={optionIndex}>
			{(provided)=>(
				<OptionRow {...provided.draggableProps} ref={provided.innerRef}>
					<OptionColumn><div {...provided.dragHandleProps}><Icon path={mdiDrag} size={1} color='#BCBCBC' /></div></OptionColumn>
					<OptionColumn>
						
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
							
					</OptionColumn>
					<OptionColumn style={{ flex: 1 }}>
						<CustomTextInput
							disabled={isSubmitting}
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
								optionsHelpers.remove(optionIndex)}
							}>
								<Icon path={mdiDelete } size={.7} color='#707070' />
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