import React, {useState} from 'react';
import numeral from 'numeral';
import {Modal, Fade, InputAdornment, TextField, Button, ButtonGroup, Checkbox, Radio, FormHelperText, FormControlLabel, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Table, TableBody, TableRow, TableCell} from '@material-ui/core';

import {ModalPaper, ModalHeader, ProductTitle, ProductAmount, ProductImage, ProductInfo } from './modal_styles';
import { FormRow, FieldControl, Block, BlockSeparator } from '../../layout/components';
import { withStyles } from '@material-ui/core/styles';

const CustomTextInput = withStyles({
	root : {
		'& .MuiInputBase-root' : {
			backgroundColor:"#fff",
		}
	}
})(TextField);

export default function ProductModal (props) {
	const [open, setOpen] = useState(true);

	return (
		<Modal style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} open={props.open} onClose={props.onClose}>
			<Fade in={props.open}>
				<ModalPaper>
					<Block style={{margin:0}}>
						<BlockSeparator>
							<ModalHeader>
								<ProductImage src='https://www.turismoouropreto.com/wp-content/uploads/culin%C3%A1ria-mineira.jpg' />
								<ProductInfo>
									<ProductTitle>Hamburguer de Siri</ProductTitle>
									<ProductAmount>{numeral(15.60).format('$0,0.00')}</ProductAmount>
								</ProductInfo>
							</ModalHeader>
							<FormRow>
								<FieldControl>
									<TextField label='Observações' />
								</FieldControl>
							</FormRow>
						</BlockSeparator>
						<BlockSeparator>
							<ExpansionPanel square expanded={open} onChange={()=>setOpen(!open)}>
								<ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header">
									Extras
								</ExpansionPanelSummary>
								<ExpansionPanelDetails style={{padding:0}}>
									<Table>
										<TableBody>
											<TableRow>
												<TableCell>
													<FormControlLabel control={<Checkbox value='bacon' />} label='Bacon Extra' />
												</TableCell>
												<TableCell style={{width:130}}>
													<CustomTextInput value={numeral(1.5).format('0,0.00')} InputProps={{startAdornment:<InputAdornment position="start">R$</InputAdornment>}} />
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</ExpansionPanelDetails>
							</ExpansionPanel>
						</BlockSeparator>
						<BlockSeparator>
							<FormRow>
								<FieldControl>
									<ButtonGroup>
										<Button color='secondary'>Cancelar</Button>
										<Button variant="contained" color='secondary'>Salvar</Button>
									</ButtonGroup>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<FormHelperText>
										Salvar irá recalcular todos os valores definidos nessa janela
									</FormHelperText>
								</FieldControl>
							</FormRow>
						</BlockSeparator>
					</Block>
				</ModalPaper>
			</Fade>
		</Modal>
	);
}