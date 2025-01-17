import React from 'react';

import DateFnsUtils from '@date-io/date-fns';
import { InputAdornment, TextField, Typography, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import brLocale from 'date-fns/locale/pt-BR';
import { useFormikContext } from 'formik';

import { FormRow, FieldControl } from '../../../layout/components';

import { createEmptySale } from '../../../utils/sale';
import { Container } from './styles';

const minPct = .05;

export default function Sale ({ closeModal }) {
	const { values: { price: productPrice, fromPrice, sale: { price, expiresAt, startsAt, action } }, errors, setFieldValue, handleChange, isSubmiting, setFieldError } = useFormikContext();

	async function handleSave () {
		setFieldError('sale', {});
		const finalProductPrice = productPrice || fromPrice;
		if (price) {
			const valuePct = finalProductPrice * minPct; // valor minimo para promoção
			if (finalProductPrice - price >= valuePct) {
				setFieldValue('sale.action', 'create');
				closeModal();
			} else {
				setFieldError('sale.price', `A porcetagem deve ser no mínimo ${minPct * 100}%`);
			}
		} else {
			setFieldError('sale.price', 'O valor da promoção é obrigatório');
		}
	}

	function handleCancel() {
		setFieldError('sale', {});
		setFieldValue('sale', createEmptySale({ action: action === 'editable' ? 'delete' : 'new_empty' }));
		closeModal();
	}

	return (
		<Container>
			<DialogTitle id="form-dialog-title">Configure abaixo os detalhes da promoção</DialogTitle>
			<DialogContent>
				<MuiPickersUtilsProvider utils={DateFnsUtils} locale={brLocale}>
					<FormRow>
						<FieldControl>
							<TextField
								value={price}
								disabled={isSubmiting}
								name='sale.price'
								type='number'
								inputProps={{ step: '0.01' }}
								onChange={handleChange}
								InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
								error={errors.sale && !!errors.sale.price}
								helperText={!!errors.sale && errors.sale.price}
							/>
						</FieldControl>
					</FormRow>
					<FormRow>
						<FieldControl>
							<DateTimePicker
								ampm={false}
								disablePast
								disabled={isSubmiting}
								hideTabs
								format='dd/MM/yyyy HH:mm'
								label="Inicia em"
								value={startsAt}
								onChange={(date)=>setFieldValue('sale.startsAt', date)}
								error={errors.sale && !!errors.startsAt}
								helperText={!!errors.sale && errors.sale.startsAt}
							/>
						</FieldControl>
					</FormRow>
					<FormRow>
						<FieldControl>
							<DateTimePicker
								ampm={false}
								disablePast
								hideTabs
								disabled={isSubmiting}
								format='dd/MM/yyyy HH:mm'
								label="Finaliza em"
								value={expiresAt}
								onChange={(date)=>setFieldValue('sale.expiresAt', date)}
								error={!!errors.sale && !!errors.sale.expiresAt}
								helperText={!!errors.sale && errors.sale.expiresAt}
							/>
						</FieldControl>
					</FormRow>
				</MuiPickersUtilsProvider>
			</DialogContent>
			<DialogActions>
				<Typography variant='caption'  style={{ textAlign: 'right' }}>A promoção poderá ficar inativa até ser publicada. Esse processo pode levar até 24h.</Typography>
				<Button variant='contained' onClick={handleCancel}>{action !== 'new_empty' ? 'Cancelar promoção' : 'Cancelar'}</Button>
				<Button variant='contained' onClick={handleSave} color='primary'>OK</Button>
			</DialogActions>
		</Container>
	);
}