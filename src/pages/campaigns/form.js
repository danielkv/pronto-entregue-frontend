import React, { useState, useEffect } from 'react';

import DateFnsUtils from '@date-io/date-fns';
import { Paper, FormControlLabel, Switch, Button, FormLabel, FormControl, FormHelperText, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import brLocale from 'date-fns/locale/pt-BR';
import { Form, Field } from 'formik';
import { isEmpty } from 'lodash';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField } from '../../layout/components';

import { useLoggedUserRole } from '../../controller/hooks';
import { DropzoneBlock } from '../../layout/blocks';
import { errorObjectsToArray } from '../../utils/error';
import RestrictCompaniesBlock from './restrictCompaniesBlock';
import RestrictProductsBlock from './restrictProductsBlock';
import RestrictUsersBlock from './restrictUsersBlock';

export default function PageForm ({ values, setFieldValue, errors, isValidating, isSubmitting }) {
	const loggedUserRole = useLoggedUserRole();
	const [errorDialog, setErrorDialog] = useState(false);

	const {
		preview,
		active,
		acceptOtherCampaign,
		chargeCompany,
		valueType,

		startsAt,
		expiresAt,
	} = values;

	const handleDropFile = (setFieldValue) => (acceptedFiles) => {
		if (Array.isArray(acceptedFiles)) {
			const file = acceptedFiles[0];
			const preview = URL.createObjectURL(file);
			setFieldValue('preview', preview);
			setFieldValue('file', file);
		}
	}

	function handleCloseDialog() {
		setErrorDialog(false)
	}
	useEffect(()=>{
		if (isValidating && !isEmpty(errors)) setErrorDialog(true);
	}, [isValidating, errors])
	
	return (
		<Form>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Campanha</BlockTitle>
					</BlockHeader>
					<Paper>
						<FormRow>
							<FieldControl>
								<Field component={tField} name='name' label='Nome da campanha' />
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<Field component={tField} name='description' label='Descrição' />
							</FieldControl>
						</FormRow>
					</Paper>
				</Block>
				
				{loggedUserRole === 'master' && <RestrictCompaniesBlock />}
				<RestrictProductsBlock />
				{loggedUserRole === 'master' && <RestrictUsersBlock />}

			</Content>
			<SidebarContainer>
				<Block>
					<BlockHeader>
						<BlockTitle>Configuração</BlockTitle>
					</BlockHeader>
					<Sidebar>
						<BlockSeparator>
							<FormRow>
								<FieldControl style={{ justifyContent: 'flex-end', paddingRight: 7 }}>
									<FormControlLabel
										labelPlacement='start'
										control={
											<Switch size='small' checked={active} onChange={()=>{setFieldValue('active', !active)}} value="includeDisabled" />
										}
										label="Ativo"
									/>
								</FieldControl>
							</FormRow>
							
							<FormRow>
								<FieldControl>
									<Button fullWidth type='submit' variant="contained" disabled={isSubmitting} color='primary'>Salvar</Button>
								</FieldControl>
							</FormRow>
						</BlockSeparator>
						<BlockSeparator>
							<FormRow>
								<FieldControl style={{ justifyContent: 'flex-end', paddingRight: 7 }}>
									<FormControlLabel
										labelPlacement='start'
										control={
											<Switch size='small' color='primary' checked={acceptOtherCampaign} onChange={()=>{setFieldValue('acceptOtherCampaign', !acceptOtherCampaign)}} value="includeDisabled" />
										}
										label="Aceita outra campanha"
									/>
								</FieldControl>
							</FormRow>
							{loggedUserRole === 'master' && (
								<FormRow>
									<FieldControl style={{ justifyContent: 'flex-end', paddingRight: 7 }}>
										<FormControlLabel
											labelPlacement='start'
											control={
												<Switch size='small' color='primary' checked={chargeCompany} onChange={()=>{setFieldValue('chargeCompany', !chargeCompany)}} value="includeDisabled" />
											}
											label="Cobrar da(s) empresa(s)"
										/>
									</FieldControl>
								</FormRow>
							)}
							<MuiPickersUtilsProvider utils={DateFnsUtils} locale={brLocale}>
								<FormRow>
									<FieldControl>
										<DateTimePicker
											ampm={false}
											disablePast
											hideTabs
											format='dd/MM/yyyy HH:mm'
											label="Inicia em"
											value={startsAt}
											onChange={(date)=>setFieldValue('startsAt', date)}
											error={!!errors.startsAt}
											helperText={!!errors.startsAt && errors.startsAt}
										/>
									</FieldControl>
								</FormRow>
								<FormRow>
									<FieldControl>
										<DateTimePicker
											ampm={false}
											disablePast
											hideTabs
											format='dd/MM/yyyy HH:mm'
											label="Expira em"
											value={expiresAt}
											onChange={(date)=>setFieldValue('expiresAt', date)}
											error={!!errors.expiresAt}
											helperText={!!errors.expiresAt && errors.expiresAt}
										/>
									</FieldControl>
								</FormRow>
							</MuiPickersUtilsProvider>
						</BlockSeparator>
						<BlockSeparator>
							<FormRow>
								<FieldControl>
									<FormControl>
										<FormLabel>Tipo de valor</FormLabel>
										<ToggleButtonGroup exclusive value={valueType} onChange={(_, newValue)=>{setFieldValue('valueType', newValue)}}>
											<ToggleButton value='percentage'>
												<Typography>Porcentagem</Typography>
											</ToggleButton>
											<ToggleButton value='value'>
												<Typography>Valor</Typography>
											</ToggleButton>
										</ToggleButtonGroup>
									</FormControl>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<Field component={tField} name='value' type='number' label='Valor' />
								</FieldControl>
							</FormRow>
						</BlockSeparator>
						<BlockSeparator>
							<FormRow>
								<FieldControl>
									<FormControl>
										<FormLabel>Imagem</FormLabel>
										<DropzoneBlock preview={preview} onDrop={handleDropFile(setFieldValue)} />
										{!!errors.file && <FormHelperText error>{errors.file}</FormHelperText>}
									</FormControl>
								</FieldControl>
							</FormRow>
						</BlockSeparator>
					</Sidebar>
				</Block>
			</SidebarContainer>
			<Dialog
				open={errorDialog && !isEmpty(errors)}
				onClose={handleCloseDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">Hmm! Parece que seu formulário tem alguns erros</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						<ul>
							{errorObjectsToArray(errors).map((err, index) => (<li key={index}>{err}</li>))}
						</ul>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="primary"autoFocus>Ok</Button>
				</DialogActions>
			</Dialog>
		</Form>
	)
}