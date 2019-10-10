import React, {useState, useEffect} from 'react';
import {Modal, Fade, InputAdornment, TextField, Button, ButtonGroup, Checkbox, FormHelperText, FormControlLabel, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Table, TableBody, TableRow, TableCell, Radio, Typography} from '@material-ui/core';
import {cloneDeep} from 'lodash';

import {ModalPaper, ModalHeader, ProductTitle, ProductPrice, ProductImage, ProductInfo } from './modal_styles';
import { FormRow, FieldControl, Block, BlockSeparator } from '../../layout/components';
import { withStyles } from '@material-ui/core/styles';

const CustomTextInput = withStyles({
	root : {
		'& .MuiInputBase-root' : {
			backgroundColor:"#fff",
		}
	}
})(TextField);

export default function ProductModal ({prod, open, onClose, onSave, onCancel}) {
	const [product, setProduct] = useState(null);
	const [errors, setErrors] = useState(null);

	const handleCancel = ()=> {
		if (onCancel && typeof onCancel === 'function') onCancel();
		close();
	}

	const close = ()=> {
		setProduct(null);
		setErrors(null);
		onClose();
	}
	const handleSave = () => {
		if (validateAllBeforeSave()) {
			onSave(product);
			close();
		}
	}

	const handleOptionCheckboxSelect = (groupIndex, optionIndex, max_select) => (e) =>{
		let newProd = {...product};
		if (e.target.checked) {
			const selectedOptions = countSelectedOptions(newProd.options_groups[groupIndex]);
			if (selectedOptions >= max_select) return alert(`Você pode selecionar apenas ${max_select} ${max_select > 1 ? 'opções' : 'opção'}`)
		}
		newProd.options_groups[groupIndex].options[optionIndex].selected = e.target.checked;
		setProduct(newProd);
	}

	const handleOptionRadioSelect = (groupIndex, optionIndex) => (e) =>{
		let newProd = {...product};
		newProd.options_groups[groupIndex].options = newProd.options_groups[groupIndex].options.map(row=>{
			row.selected = false;
			return row;
		});
		newProd.options_groups[groupIndex].options[optionIndex].selected = e.target.checked;
		setProduct(newProd);
	}

	const countSelectedOptions = (group) => {
		return group.options.filter(row=>row.selected).length;
	}

	const isRestrainingOptionSelected = (sourceGroup) => {
		let restrainingGroup = product.options_groups.find(row=>row.id===sourceGroup.restrainedBy.id);
		if (restrainingGroup) return restrainingGroup.options.find(row=>row.selected);

		return false;
	}

	const getGroupMaxSelect = (group) => {
		let max_select = group.max_select;
		if (group.restrainedBy && group.restrainedBy.id) {
			let restrainingOption = isRestrainingOptionSelected(group);
			if (restrainingOption) max_select = restrainingOption.max_select_restrain_other;
		}
		return max_select;
	}

	const getGroupInitalMessage = (group) => {
		let message;
		const max_select = getGroupMaxSelect(group);
		const min_select = group.min_select;

		if (group.type === 'single') {
			message = (min_select >= 1) ? 'Selecione 1 opção' : '';
		} else {
			message = `Selecione até ${max_select} ${max_select > 1 ? 'opções' : 'opção'}`;
		}

		return message;
	}

	const validateGroup = (group) => {
		const max_select = getGroupMaxSelect(group);
		const min_select = group.min_select;
		const selected_options = countSelectedOptions(group);
		if (selected_options < group.min_select) {
			return `Você deve selecionar no mínimo ${min_select} ${min_select > 1 ? 'opções' : 'opção'}`;
		}
		if (selected_options > max_select) {
			return `Você deve selecionar no máximo ${max_select} ${max_select > 1 ? 'opções' : 'opção'}`;
		}

		return false;
	}

	const validateAllBeforeSave = () => {
		let errors = {}
		const verifying = product.options_groups.every((group, index)=>{
			let validation = validateGroup(group);
			if (validation) errors[index] = validation;
			return !validation;
		});
		setErrors(errors);

		return verifying;
	}

	useEffect(()=>{
		if (prod)
			setProduct(cloneDeep(prod));
	}, [prod]);

	return (
		<Modal style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} open={open} onClose={close}>
			<Fade in={open}>
				<ModalPaper>
				{!!product &&
					<Block style={{margin:0}}>
						<BlockSeparator>
							<ModalHeader>
								<ProductImage src={product.image} />
								<ProductInfo>
									<ProductTitle>{product.name}</ProductTitle>
									<ProductPrice>
										<TextField
											type='number'
											InputProps={{startAdornment:<InputAdornment position="start">R$</InputAdornment>}}
											inputProps={{step:'0.01'}}
											value={product.price}
											onChange={(e)=>{
												let newProd = {...product};
												newProd.price = parseFloat(e.target.value.replace(',', '.'));
												setProduct(newProd);
											}}
											/>
									</ProductPrice>
								</ProductInfo>
							</ModalHeader>
							<FormRow>
								<FieldControl>
									<TextField label='Observações' value={product.message} />
								</FieldControl>
							</FormRow>
						</BlockSeparator>
						<BlockSeparator style={{maxHeight:400, overflowY:'auto'}}>
							{product.options_groups.map((group, groupIndex)=>{
								let disabled = false;
								let max_select = getGroupMaxSelect(group);
								let max_select_msg = getGroupInitalMessage(group);
								let error = errors && errors[groupIndex] ? errors[groupIndex] : false;

								if (group.restrainedBy && group.restrainedBy.id && !isRestrainingOptionSelected(group)) {
									disabled = true;
									max_select_msg = `Selecione o ${group.restrainedBy.name}`;
								}

								if (!!error) max_select_msg = error;
								
							return (<ExpansionPanel key={`${group.id}.${groupIndex}`} square expanded={open} /* onChange={()=>setOpen(!open)} */>
								<ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header">
									<Typography>{group.name}</Typography>
									<FormHelperText error={!!error} style={{marginLeft:'auto'}}>
										{max_select_msg}
									</FormHelperText>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails style={{padding:0}}>
									<Table>
										<TableBody>
										{group.options.map((option, optionIndex)=>(
											<TableRow key={`${option.id}.${optionIndex}`}>
												<TableCell>
													<FormControlLabel
														control={
															group.type === 'single' ?
															<Radio
																value={option.name}
																checked={option.selected}
																onChange={(e)=>{
																	if (disabled) {
																		alert(`Você deve primeiro selecionar ${group.restrainedBy.name}`);
																		return;
																	}
																	handleOptionRadioSelect(groupIndex, optionIndex)(e);
																}}
																/>
															:
															<Checkbox
																value={option.name}
																checked={option.selected}
																onChange={(e)=>{
																	if (disabled) {
																		alert(`Você deve primeiro selecionar ${group.restrainedBy.name}`);
																		return;
																	}
																	handleOptionCheckboxSelect(groupIndex, optionIndex, max_select)(e);
																}}
																/>
														}
														label={option.name}
														/>
												</TableCell>
												<TableCell style={{width:130}}>
													<CustomTextInput
														type='number'
														InputProps={{startAdornment:<InputAdornment position="start">R$</InputAdornment>}}
														inputProps={{step:'0.01'}}
														value={option.price}
														onChange={(e)=>{
															let newProd = {...product};
															newProd.options_groups[groupIndex].options[optionIndex].price = parseFloat(e.target.value.replace(',', '.'));
															setProduct(newProd);
														}}
														/>
												</TableCell>
											</TableRow>))}
										</TableBody>
									</Table>
								</ExpansionPanelDetails>
							</ExpansionPanel>)})}
						</BlockSeparator>
						<BlockSeparator>
							<FormRow>
								<FieldControl style={{flex:.7}}>
									<FormHelperText>
										Salvar irá recalcular todos os valores definidos nessa janela
									</FormHelperText>
								</FieldControl>
								<FieldControl style={{flex:.3}}>
									<ButtonGroup style={{marginLeft:'auto'}}>
										<Button onClick={handleCancel} color='secondary'>Cancelar</Button>
										<Button onClick={handleSave} variant="contained" color='secondary'>Salvar</Button>
									</ButtonGroup>
								</FieldControl>
							</FormRow>
						</BlockSeparator>
					</Block>}
				</ModalPaper>
			</Fade>
		</Modal>
	);
}