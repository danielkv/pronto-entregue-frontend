import React from 'react';

import DateFnsUtils from '@date-io/date-fns';
import { Paper, FormControlLabel, Switch, Button, FormLabel, FormControl, FormHelperText, Typography } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import brLocale from 'date-fns/locale/pt-BR';
import { Form, Field } from 'formik';


import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField } from '../../layout/components';

import { useLoggedUserRole } from '../../controller/hooks';
import { DropzoneBlock } from '../../layout/blocks';
import RestrictCompaniesBlock from './restrictCompaniesBlock';
import RestrictProductsBlock from './restrictProductsBlock';
import RestrictUsersBlock from './restrictUsersBlock';

export default function PageForm ({ values, setFieldValue, errors }) {
	const loggedUserRole = useLoggedUserRole();

	const {
		preview,
		active,
		acceptOtherCompaign,
		chargeCompany,
		type,
		valueType,

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
											<Switch size='small' color='primary' checked={active} onChange={()=>{setFieldValue('active', !active)}} value="includeDisabled" />
										}
										label="Ativo"
									/>
								</FieldControl>
							</FormRow>
							
							<FormRow>
								<FieldControl>
									<Button fullWidth type='submit' variant="contained" color='secondary'>Salvar</Button>
								</FieldControl>
							</FormRow>
						</BlockSeparator>
						<BlockSeparator>
							<FormRow>
								<FieldControl style={{ justifyContent: 'flex-end', paddingRight: 7 }}>
									<FormControlLabel
										labelPlacement='start'
										control={
											<Switch size='small' color='secondary' checked={acceptOtherCompaign} onChange={()=>{setFieldValue('acceptOtherCompaign', !acceptOtherCompaign)}} value="includeDisabled" />
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
												<Switch size='small' color='secondary' checked={chargeCompany} onChange={()=>{setFieldValue('chargeCompany', !chargeCompany)}} value="includeDisabled" />
											}
											label="Cobrar da(s) empresa(s)"
										/>
									</FieldControl>
								</FormRow>
							)}
							<FormRow>
								<FieldControl>
									<MuiPickersUtilsProvider utils={DateFnsUtils} locale={brLocale}>
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
									</MuiPickersUtilsProvider>
								</FieldControl>
							</FormRow>
							
						</BlockSeparator>
						<BlockSeparator>
							<FormRow>
								<FieldControl>
									<FormControl>
										<FormLabel>Tipo</FormLabel>
										<ToggleButtonGroup color='secondary' exclusive value={type} onChange={(_, newValue)=>{setFieldValue('type', newValue)}}>
											<ToggleButton value='cashback'>
												<Typography>Cashback</Typography>
											</ToggleButton>
											<ToggleButton value='discount'>
												<Typography>Desconto</Typography>
											</ToggleButton>
										</ToggleButtonGroup>
									</FormControl>
								</FieldControl>
							</FormRow>
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
									<Field component={tField} name='value' type='number' label='valor' />
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
		</Form>
	)
}