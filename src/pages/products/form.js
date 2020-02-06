import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useQuery } from '@apollo/react-hooks';
import { Paper, FormControlLabel, Switch, Button, FormLabel, FormControl, FormHelperText, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, MenuItem, InputAdornment, Chip } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { mdiFormatListChecks, mdiCheckDecagram, mdiPencil } from '@mdi/js'
import Icon from '@mdi/react';
import { Form, Field, ErrorMessage } from 'formik';
import { isEmpty } from 'lodash';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField } from '../../layout/components';

import { useLoggedUserRole, useSelectedCompany } from '../../controller/hooks';
import { DropzoneBlock, LoadingBlock } from '../../layout/blocks';
import { errorObjectsToArray } from '../../utils/error';
import OptionsBlock from './optionsBlock';

import { GET_COMPANY_CATEGORIES } from '../../graphql/categories';

export default function PageForm ({ values: { active, featured, campaigns, price, type, preview, category }, setFieldValue, handleChange, isValidating, isSubmitting, errors }) {
	const history = useHistory();
	const [errorDialog, setErrorDialog] = useState(false);
	const loggedUserRole = useLoggedUserRole();
	
	const selectedCompany = useSelectedCompany();
	const { data: { company: { categories = [] } = {} } = {}, loading: loadingcategories } = useQuery(GET_COMPANY_CATEGORIES, { variables: { id: selectedCompany } });

	// errors
	function handleCloseDialog() {
		setErrorDialog(false)
	}
	useEffect(()=>{
		if (isValidating && !isEmpty(errors)) setErrorDialog(true);
	}, [isValidating, errors])
	
	const handleDropFile = (setFieldValue) => (acceptedFiles) => {
		if (Array.isArray(acceptedFiles)) {
			const file = acceptedFiles[0];
			const preview = URL.createObjectURL(file);
			setFieldValue('preview', preview);
			setFieldValue('file', file);
		}
	}

	if (loadingcategories) return <LoadingBlock />;
	
	return (
		<Form>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Produto</BlockTitle>
					</BlockHeader>
					<Paper>
						<FormRow>
							<FieldControl>
								<Field component={tField} name='name' label='Nome do produto' />
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<Field component={tField} name='description' label='Descrição' />
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<TextField
									type='number'
									value={price}
									label='Preço'
									name='price'
									onChange={handleChange}
									disabled={isSubmitting}
									error={!!errors.price}
									helperText={!!errors.price && errors.price}
									InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
									inputProps={{ step: 0.01 }} />
							</FieldControl>
							<FieldControl>
								<TextField select value={category.id} label='Categoria' name='category.id' onChange={handleChange}>
									{!!categories.length && categories.map(categoryItem=>(
										<MenuItem key={categoryItem.id} value={categoryItem.id}>{categoryItem.name}</MenuItem>
									))}
								</TextField>
							</FieldControl>
						</FormRow>
						{!!campaigns.length && <FormRow>
							<FieldControl style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
								<FormLabel>Campanhas vinculadas</FormLabel>
								<div style={{ display: 'block' }}>
									{campaigns.map((campaign, index) => {
										const onDelete = (campaign.masterOnly && loggedUserRole === 'master') || !campaign.masterOnly ? ()=>history.push(`/campanhas/alterar/${campaign.id}`) : null;
										return <Chip color='primary' key={index} label={campaign.name} deleteIcon={<Icon path={mdiPencil} size={1} color='#ccc' />} onDelete={onDelete} />
									})}
								</div>
							</FieldControl>
						</FormRow>}
					</Paper>
				</Block>
				<OptionsBlock />
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
								<FieldControl style={{ justifyContent: 'flex-end', paddingRight: 7 }}>
									<FormControlLabel
										labelPlacement='start'
										control={
											<Switch size='small' color='secondary' checked={featured} onChange={()=>{setFieldValue('featured', !featured)}} value="includeDisabled" />
										}
										label="Destaque"
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
								<FieldControl>
									<FormControl>
										<FormLabel>Tipo de seleção</FormLabel>
										<ToggleButtonGroup
											value={type}
											exclusive
											name='type'
											onChange={(e, value)=>{
												setFieldValue('type', value);
											}}
											aria-label="text alignment"
										>
											<ToggleButton disabled={isSubmitting} value="inline" title="Normal" aria-label="left aligned">
												<Icon path={mdiCheckDecagram} size={1} color='#707070' />
											</ToggleButton>
											<ToggleButton disabled={isSubmitting} value="panel" title="Painel" aria-label="left aligned">
												<Icon path={mdiFormatListChecks} size={1} color='#707070' />
											</ToggleButton>
										</ToggleButtonGroup>
									</FormControl>
								</FieldControl>
							</FormRow>
						</BlockSeparator>
						<BlockSeparator>
							<FormRow>
								<FieldControl>
									<FormControl>
										<FormLabel>Imagem</FormLabel>
										<DropzoneBlock preview={preview} onDrop={handleDropFile(setFieldValue)} />
										<FormHelperText error><ErrorMessage name="file" /></FormHelperText>
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