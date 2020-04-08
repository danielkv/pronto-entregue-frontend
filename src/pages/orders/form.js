import React, { useState, useEffect } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, InputAdornment, TextField, FormControl, Button, MenuItem, FormHelperText, List, ListItemIcon, ListItemText, ListItemSecondaryAction, ListItem, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@material-ui/core';
import { mdiAccountCircle } from '@mdi/js';
import Icon from '@mdi/react';
import Downshift from 'downshift';
import { Form, Field } from 'formik';
import { isEmpty } from 'lodash';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField } from '../../layout/components';

import { useSelectedCompany } from '../../controller/hooks';
import { errorObjectsToArray } from '../../utils/error';
import { calculateOrderPrice } from '../../utils/orders';
import Delivery from './delivery';
import Products from './products';

import { GET_COMPANY_PAYMENT_METHODS } from '../../graphql/companies';
import { SEARCH_USERS } from '../../graphql/users';

export default function PageForm ({ editId, values, setFieldValue, isSubmitting, errors, isValidating }) {
	// carregamento inicial
	const { user, price, products, status, paymentMethod, paymentFee, discount, deliveryPrice } = values;

	// hooks
	const [errorDialog, setErrorDialog] = useState(false);

	// errors
	function handleCloseDialog() {
		setErrorDialog(false)
	}
	useEffect(()=>{
		if (isValidating && !isEmpty(errors)) setErrorDialog(true);
	}, [isValidating, errors])

	// get selecte company
	const selectedCompany = useSelectedCompany();

	//Query de busca de usuário
	const [searchUsers, { data: { searchUsers: usersFound = [] } = {}, loading: loadingUsers }] = useMutation(SEARCH_USERS, { fetchPolicy: 'no-cache' })
	
	//Query formas de pagamento
	const {
		data: { company: { paymentMethods = [] } = {} } = {},
	} = useQuery(GET_COMPANY_PAYMENT_METHODS, { variables: { id: selectedCompany } });

	const handleSearchCustomer = (value) => {
		searchUsers({ variables: { search: value } });
	}

	useEffect(()=>{
		setFieldValue('price', calculateOrderPrice(products, deliveryPrice + paymentFee - discount))
	}, [products, deliveryPrice, paymentFee, discount, setFieldValue]);

	return (
		<Form>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Pedido {Boolean(editId) && <Chip color='secondary' label={`Pedido nº: #${editId}`} />}</BlockTitle>
					</BlockHeader>
					<Paper>
						<FormRow>
							<FieldControl>
								<FormControl>
									<Downshift
										onChange={(item)=>{setFieldValue('user', item)}}
										itemToString={(item => item ? item.fullName : '')}
										onInputValueChange={(value)=>{handleSearchCustomer(value)}}
										initialSelectedItem={user && user.id ? user : null}
									>
										{({
											getInputProps,
											getItemProps,
											getMenuProps,
											isOpen,
											highlightedIndex,
										})=>{
											return (
												<div>
													<TextField disabled={isSubmitting} {...getInputProps({ error: !!errors.user, label: 'Cliente' })} />
													{isOpen && (
														<List {...getMenuProps()} className="dropdown">
															{loadingUsers ? <div style={{ padding: 20 }}><CircularProgress /></div>
																:
																usersFound.map((item, index) => {
																	return (<ListItem
																		className="dropdown-item"
																		selected={highlightedIndex === index}
																		key={item.id}
																		{...getItemProps({ key: item.id, index, item })}
																	>
																		<ListItemIcon><Icon path={mdiAccountCircle} color='#707070' size={1} /></ListItemIcon>
																		<ListItemText>{item.fullName}</ListItemText>
																		<ListItemSecondaryAction><small>{item.email}</small></ListItemSecondaryAction>
																	</ListItem>)
																})}
														</List>
													)}
												</div>
											)
										}}
									</Downshift>
									<FormHelperText error={!!errors.user}>{errors.user || 'Digite para buscar um cliente'}</FormHelperText>
								</FormControl>
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<Field name='message' component={tField} label='Observações' />
							</FieldControl>
						</FormRow>
					</Paper>
				</Block>
				{(user && user.id) && (
					<>
						<Delivery />
						<Products />
					</>
				)}
			</Content>
			<SidebarContainer>
				<Block>
					<BlockHeader>
						<BlockTitle>Configuração</BlockTitle>
					</BlockHeader>
					<Sidebar>
						<BlockSeparator>
							<FormRow>
								<FieldControl>
									<TextField select label='Status' value={status} onChange={(e)=>{setFieldValue('status', e.target.value)}}>
										<MenuItem value='waiting'>Aguardando</MenuItem>
										<MenuItem value='preparing'>Preparando</MenuItem>
										<MenuItem value='delivering'>Na entrega</MenuItem>
										<MenuItem value='delivered'>Entregue</MenuItem>
										<MenuItem value='canceled'>Cancelado</MenuItem>
									</TextField>
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
								<FieldControl>
									<Field
										label='Valor da entrega'
										type='number'
										name='deliveryPrice'
										InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
										component={tField}
									/>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<Field
										label='Desconto'
										type='number'
										name='discount'
										InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
										component={tField}
									/>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<TextField
										label='Valor total'
										type='number'
										value={price}
										name='price'
										InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment>, readOnly: true }}
									/>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									{!!paymentMethods.length &&
									<TextField disabled={paymentMethod && paymentMethod.id && editId} helperText={errors.paymentMethod} error={!!errors.paymentMethod} select label='Forma de pagamento' value={paymentMethod && paymentMethod.id ? paymentMethod.id : ''} onChange={(e)=>setFieldValue('paymentMethod.id', e.target.value)}>
										{paymentMethods.map(row=>(
											<MenuItem key={row.id} value={row.id}>{row.displayName}</MenuItem>
										))}
									</TextField>}
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
		</Form>
	)
}