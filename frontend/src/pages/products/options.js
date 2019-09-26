import React from 'react';
import numeral from 'numeral';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@mdi/react';
import {mdiDrag, mdiDelete } from '@mdi/js'

import {TextField, MenuItem, InputAdornment,  TableRow, TableCell, IconButton, Switch} from '@material-ui/core';

const CustomTextInput = withStyles({
	root : {
		'& .MuiInputBase-root' : {
			backgroundColor:"#fff",
		}
	}
})(TextField);

export default function Block ({option, groupIndex, optionIndex, setFieldValue, removeOption, erros}) {
	return (		
		<TableRow>
			<TableCell><Icon path={mdiDrag} size='20' color='#BCBCBC' /> </TableCell>
			<TableCell>{option.name}</TableCell>
			<TableCell>
				<CustomTextInput value={numeral(option.price).format('0,0.00')} InputProps={{startAdornment:<InputAdornment position="start">R$</InputAdornment>}} />
			</TableCell>
			<TableCell>
				{/* <CustomTextInput select>
					<MenuItem value='1'>Item 1</MenuItem>
					<MenuItem value='2'>Item 2</MenuItem>
					<MenuItem value='3'>Item 3</MenuItem>
				</CustomTextInput> */}
			</TableCell>
			<TableCell>
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
			</TableCell>
		</TableRow>
	)
}