import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';


import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, FormControlLabel, Switch, Button, FormLabel, FormControl, FormHelperText, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, InputAdornment, Chip, CircularProgress, Typography } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { mdiFormatListChecks, mdiCheckDecagram, mdiPencil } from '@mdi/js'
import Icon from '@mdi/react';
import { Form, Field, ErrorMessage } from 'formik';
import { isEmpty } from 'lodash';
import { useSnackbar } from 'notistack';
import numeral from 'numeral';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField } from '../../layout/components';

import { useLoggedUserRole, useSelectedCompany } from '../../controller/hooks';
import { DropzoneBlock, LoadingBlock } from '../../layout/blocks';
import { errorObjectsToArray } from '../../utils/error';
import { createEmptySale } from '../../utils/sale';
import OptionsBlock from './optionsBlock';
import Sale from './sale';

import { GET_COMPANY_CATEGORIES } from '../../graphql/categories';
import { REMOVE_SALE } from '../../graphql/products';

export default function PageForm ({ values: { sale, active, campaigns, price, fromPrice, minDeliveryTime, scheduleEnabled, type, preview, category }, setFieldValue, handleChange, isValidating, isSubmitting, errors }) {
	const history = useHistory();
	const [errorDialog, setErrorDialog] = useState(false);
	const loggedUserRole = useLoggedUserRole();
	const { url } = useRouteMatch();
	const dashboardUrl = '/' + url.substr(1).split('/')[0];
	const { enqueueSnackbar } = useSnackbar();

	// sale
	const [openSale, setOpenSale] = useState(false);
	const [removeSale, { loading: loadingRemoveSale }] = useMutation(REMOVE_SALE, { variables: { id: sale && sale.id ? sale.id : null } });

	function handleOpenSale() {
		if (!price) return enqueueSnackbar('Você não pode criar uma promoção para um produto com preço vazio ou zero', { variant: 'warning' });
		setOpenSale(true)
	}

	function handleRemoveSale() {
		removeSale()
			.then(()=>{
				setFieldValue('sale', createEmptySale());
			})
	}
	function handleCloseSale() {
		setOpenSale(false);
	}
	
	const selectedCompany = useSelectedCompany();
	const { data: { company: { categories = [] } = {} } = {}, loading: loadingcategories } = useQuery(GET_COMPANY_CATEGORIES, { variables: { id: selectedCompany } });

	// errors
	function handleCloseDialog() {
		setErrorDialog(false)
	}
	useEffect(()=>{
		if (isValidating && !isEmpty(errors)) setErrorDialog(true);
	}, [isValidating, errors])
	
	function handleDropFile(acceptedFiles) {
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
							<FieldControl style={{ flex: .1 }}>
								<Field component={tField} name='sku' label='#SKU' />
							</FieldControl>
							<FieldControl>
								<Field component={tField} name='name' label='Nome do produto' />
							</FieldControl>
							<FieldControl>
								<TextField select value={category.id} label='Categoria' name='category.id' onChange={handleChange}>
									{!!categories.length && categories.map(categoryItem=>(
										<MenuItem key={categoryItem.id} value={categoryItem.id}>{categoryItem.name}</MenuItem>
									))}
								</TextField>
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<Field component={tField} name='description' label='Descrição' />
							</FieldControl>
						</FormRow>
						<FormRow style={{ alignItems: 'flex-start' }}>
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
								<TextField
									type='number'
									value={fromPrice}
									label='A partir de'
									name='fromPrice'
									onChange={handleChange}
									disabled={isSubmitting}
									error={!!errors.fromPrice}
									helperText={errors.fromPrice ? errors.fromPrice : 'Esse valor será mostrado quando o produto for exibido em lista no app'}
									InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
									inputProps={{ step: 0.01 }} />
							</FieldControl>
						</FormRow>
						{Boolean(campaigns && campaigns.length) && <FormRow>
							<FieldControl style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
								<FormLabel>Campanhas vinculadas</FormLabel>
								<div style={{ display: 'block' }}>
									{campaigns.map((campaign, index) => {
										const onDelete = (campaign.masterOnly && loggedUserRole === 'master') || !campaign.masterOnly ? ()=>history.push(`${dashboardUrl}/campanhas/alterar/${campaign.id}`) : null;
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
							{sale && sale.id
								? (
									<>
										<FormRow>
											<FieldControl>
												<FormControl>
													<Button onClick={handleRemoveSale} variant='contained'>
														{loadingRemoveSale
															? <CircularProgress />
															: 'Cancelar promoção'}
													</Button>
													<FormHelperText>Não é possível alterar o produto com uma promoção ativa. Lembre-se que apertando o botão acima, você cancela a promoção imadiatamente.</FormHelperText>
												</FormControl>
											</FieldControl>
										</FormRow>
										<FormRow>
											<FieldControl>
												<FormControl>
													<Typography>{`Valor da promoção: ${numeral(sale.price).format('$0,00.00')}`}</Typography>
													<Typography variant='caption'>{`Inicia em: ${sale.startsAt.format('DD/MM/YY HH:mm')}`}</Typography>
													<Typography variant='caption'>{`Termina em: ${sale.expiresAt.format('DD/MM/YY HH:mm')}`}</Typography>
												</FormControl>
											</FieldControl>
										</FormRow>
									</>
								)
								: (
									<>
										<FormRow>
											<FieldControl>
												<Button fullWidth type='submit' variant="contained" disabled={isSubmitting} color='primary'>Salvar</Button>
											</FieldControl>
										</FormRow>
										<FormRow>
											<FieldControl>
												<Button
													fullWidth
													variant={sale.action !== 'new_empty' ? "contained" : 'outlined'}
													color='primary'
													onClick={handleOpenSale}
													disabled={sale.active}
												>
													{sale.action !== 'new_empty' ? 'Modificar promoção' : 'Criar Promoção'}
												</Button>
											</FieldControl>
										</FormRow>
									</>
								)}
						</BlockSeparator>
						<BlockSeparator>
							<FormRow>
								<FieldControl style={{ justifyContent: 'flex-end', paddingRight: 7 }}>
									<FormControlLabel
										labelPlacement='start'
										control={
											<Switch size='small' color='primary' checked={scheduleEnabled} onChange={()=>{setFieldValue('scheduleEnabled', !scheduleEnabled)}} value="includeDisabled" />
										}
										label="Habilitar encomendas"
									/>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<FormControl>
										<TextField
											type='number'
											value={minDeliveryTime}
											label='Tempo mínimo para entrega'
											name='minDeliveryTime'
											onChange={handleChange}
											disabled={isSubmitting || !scheduleEnabled}
											error={!!errors.minDeliveryTime}
											helperText={errors.minDeliveryTime ? errors.minDeliveryTime : 'Em horas'}
										/>
									</FormControl>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<FormControl>
										<FormLabel>Tipo de seleção</FormLabel>
										<ToggleButtonGroup
											value={type}
											exclusive
											name='type'
											onChange={(e, value)=>{
												if (value) setFieldValue('type', value);
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
										<DropzoneBlock preview={preview} onDrop={handleDropFile} />
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
					<ul>
						{errorObjectsToArray(errors).map((err, index) => (<li key={index}>{err}</li>))}
					</ul>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="primary"autoFocus>Ok</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={openSale}
			>
				<Sale closeModal={handleCloseSale} />
			</Dialog>
		</Form>
	)
}