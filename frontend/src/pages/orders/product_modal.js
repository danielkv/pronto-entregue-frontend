import React, {useState, useEffect} from 'react';
import {Modal, Fade, InputAdornment, TextField, Button, ButtonGroup, Checkbox, FormHelperText, FormControlLabel, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Table, TableBody, TableRow, TableCell, Radio} from '@material-ui/core';
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

export default function ProductModal ({prod, open, onClose, onSave}) {
	const [product, setProduct] = useState(null);

	const handleClose = ()=> {
		setProduct(null);
		onClose();
	}

	const handleOptionCheckboxSelect = (groupIndex, optionIndex) => (e) =>{
		let newProd = {...product};
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

	useEffect(()=>{
		if (prod)
			setProduct(cloneDeep(prod));
	}, [prod]);

	return (
		<Modal style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} open={open} onClose={handleClose}>
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
							{product.options_groups.map((group, groupIndex)=>(
							<ExpansionPanel key={`${group.id}.${groupIndex}`} square expanded={open} /* onChange={()=>setOpen(!open)} */>
								<ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header">
									{group.name}
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
																checked={!!option.selected}
																onChange={handleOptionRadioSelect(groupIndex, optionIndex)}
																/>
															:
															<Checkbox
																value={option.name}
																checked={!!option.selected}
																onChange={handleOptionCheckboxSelect(groupIndex, optionIndex)}
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
							</ExpansionPanel>))}
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
										<Button onClick={()=>{handleClose();}} color='secondary'>Cancelar</Button>
										<Button onClick={()=>{onSave(product); handleClose();}} variant="contained" color='secondary'>Salvar</Button>
									</ButtonGroup>
								</FieldControl>
							</FormRow>
							<FormRow>
								
							</FormRow>
						</BlockSeparator>
					</Block>}
				</ModalPaper>
			</Fade>
		</Modal>
	);
}