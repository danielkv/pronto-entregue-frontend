import React, { useState, useEffect } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import { Modal, Fade, InputAdornment, TextField, Button, ButtonGroup, Checkbox, FormHelperText, FormControlLabel, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Table, TableBody, TableRow, TableCell, Radio, Typography, IconButton, Avatar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { mdiPlusCircleOutline, mdiMinusCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { cloneDeep } from 'lodash';

import { FormRow, FieldControl, Block, BlockSeparator } from '../../../../layout/components';

import { ModalPaper, ModalHeader, ProductTitle, ProductPrice, ProductInfo, QuantityContainer } from './styles';

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

export default function ProductModal ({ prod, open, onClose, onSave, onCancel }) {
	const [product, setProduct] = useState(null);
	const [errors, setErrors] = useState(null);

	const { url } = useRouteMatch();
	const dashboardUrl = '/' + url.substr(1).split('/')[0];

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

	const handleOptionCheckboxSelect = (groupIndex, optionIndex, maxSelect) => (e) =>{
		let newProd = { ...product };
		if (e.target.checked) {
			const selectedOptions = countSelectedOptions(newProd.optionsGroups[groupIndex]);
			if (maxSelect > 0 && selectedOptions >= maxSelect) return alert(`Você pode selecionar apenas ${maxSelect} ${maxSelect > 1 ? 'opções' : 'opção'}`)
		}
		newProd.optionsGroups[groupIndex].options[optionIndex].selected = e.target.checked;
		if (newProd.action === 'editable') newProd.action = 'update';
		setProduct(newProd);
	}

	const handleOptionRadioSelect = (groupIndex, optionIndex) => () => {
		const newProd = { ...product };
		const newStatus = !newProd.optionsGroups[groupIndex].options[optionIndex].selected;

		newProd.optionsGroups[groupIndex].options = newProd.optionsGroups[groupIndex].options.map((row, index)=>{
			if (index !== optionIndex) row.selected = false;
			return row;
		});

		newProd.optionsGroups[groupIndex].options[optionIndex].selected = newStatus;
		if (newProd.action === 'editable') newProd.action = 'update';
		setProduct(newProd);
	}

	const countSelectedOptions = (group) => {
		return group.options.filter(row=>row.selected).length;
	}

	const isRestrainingOptionSelected = (sourceGroup) => {
		let restrainingGroup = product.optionsGroups.find(row=>row.groupRelated.id === sourceGroup.restrainedBy.id);
		if (restrainingGroup) return restrainingGroup.options.find(row=>row.selected);

		return false;
	}

	const getGroupMaxSelect = (group) => {
		let maxSelect = group.maxSelect;
		if (group.restrainedBy && group.restrainedBy.id) {
			let restrainingOption = isRestrainingOptionSelected(group);
			if (restrainingOption) maxSelect = restrainingOption.maxSelectRestrainOther;
		}
		return maxSelect;
	}

	const getGroupInitalMessage = (group) => {
		let message;
		const maxSelect = getGroupMaxSelect(group);
		const minSelect = group.minSelect;

		if (group.type === 'single') {
			message = (minSelect >= 1) ? 'Selecione 1 opção' : '';
		} else {
			message = maxSelect > 0 ? `Selecione até ${maxSelect} ${maxSelect > 1 ? 'opções' : 'opção'}` : 'Selecione as opções';
		}

		return message;
	}

	const validateGroup = (group) => {
		const maxSelect = getGroupMaxSelect(group);
		const minSelect = group.minSelect;
		const selectedOptions = countSelectedOptions(group);
		if (selectedOptions < group.minSelect) {
			return `Você deve selecionar no mínimo ${minSelect} ${minSelect > 1 ? 'opções' : 'opção'}`;
		}
		if (maxSelect > 0 && selectedOptions > maxSelect) {
			return `Você deve selecionar no máximo ${maxSelect} ${maxSelect > 1 ? 'opções' : 'opção'}`;
		}

		return false;
	}

	const validateAllBeforeSave = () => {
		let errors = {}
		const verifying = product.optionsGroups.every((group, index)=>{
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
		<Modal style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} scroll='body' onBackdropClick={handleCancel} open={open} onClose={close}>
			<Fade in={open}>
				<ModalPaper>
					{!!product &&
					<Block style={{ margin: 0 }}>
						<BlockSeparator>
							<ModalHeader>
								<Link to={`${dashboardUrl}/produtos/alterar/${product.productRelated.id}`}>
									<Avatar style={{ width: 110, height: 110 }} alt={product.name} src={product.image} />
								</Link>
								<ProductInfo>
									<ProductTitle>
										<div>{product.name}</div>
										<QuantityContainer>
											<IconButton onClick={()=>{if (product.quantity > 1) setProduct({ ...product, quantity: product.quantity-1, action: product.action === 'editable' ? 'update' : product.action })}}>
												<Icon path={mdiMinusCircleOutline} size={1} />
											</IconButton>
											<div>{product.quantity}</div>
											<IconButton onClick={()=>{setProduct({ ...product, quantity: product.quantity+1, action: product.action === 'editable' ? 'update' : product.action })}}>
												<Icon path={mdiPlusCircleOutline} size={1} />
											</IconButton>
										</QuantityContainer>
									</ProductTitle>
									<ProductPrice>
										<TextField
											type='number'
											InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
											inputProps={{ step: '0.01' }}
											value={product.price}
											onChange={(e)=>{
												let newProd = { ...product };
												newProd.price = parseFloat(e.target.value.replace(',', '.'));
												if (newProd.action === 'editable') newProd.action = 'update';
												setProduct(newProd);
											}}
										/>
									</ProductPrice>
								</ProductInfo>
							</ModalHeader>
							<FormRow>
								<FieldControl>
									<TextField
										label='Observações'
										value={product.message}
										multiline
										onChange={(e)=>{
											setProduct({ ...product, message: e.target.value });
										}}
									/>
								</FieldControl>
							</FormRow>
						</BlockSeparator>
						<BlockSeparator style={{ maxHeight: 400, overflowY: 'auto' }}>
							{product.optionsGroups.map((group, groupIndex)=>{
								let disabled = false;
								let maxSelect = getGroupMaxSelect(group);
								let maxSelectMsg = getGroupInitalMessage(group);
								let error = errors && errors[groupIndex] ? errors[groupIndex] : false;

								if (group.restrainedBy && group.restrainedBy.id && !isRestrainingOptionSelected(group)) {
									disabled = true;
									maxSelectMsg = `Selecione o ${group.restrainedBy.name}`;
								}

								if (error) maxSelectMsg = error;
								
								return (<ExpansionPanel key={`${group.id}.${groupIndex}`} square expanded={open} /* onChange={()=>setOpen(!open)} */>
									<ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header">
										<Typography>{group.name}</Typography>
										<FormHelperText error={!!error} style={{ marginLeft: 'auto' }}>
											{maxSelectMsg}
										</FormHelperText>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails style={{ padding: 0 }}>
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
																			onClick={(e)=>{
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
																				handleOptionCheckboxSelect(groupIndex, optionIndex, maxSelect)(e);
																			}}
																		/>
																}
																label={option.name}
															/>
															<Typography variant='caption'>{option.description}</Typography>
														</TableCell>
														<TableCell style={{ width: 130 }}>
															<CustomTextInput
																type='number'
																InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
																inputProps={{ step: '0.01' }}
																value={option.price}
																onChange={(e)=>{
																	let newProd = { ...product };
																	newProd.optionsGroups[groupIndex].options[optionIndex].price = parseFloat(e.target.value.replace(',', '.'));
																	if (newProd.action === 'editable') newProd.action = 'update';
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
								<FieldControl style={{ flex: .7 }}>
									<FormHelperText>
										Salvar irá recalcular todos os valores definidos nessa janela
									</FormHelperText>
								</FieldControl>
								<FieldControl style={{ flex: .3 }}>
									<ButtonGroup style={{ marginLeft: 'auto' }}>
										<Button onClick={handleCancel} color='primary'>Cancelar</Button>
										<Button onClick={handleSave} variant="contained" color='primary'>Salvar</Button>
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