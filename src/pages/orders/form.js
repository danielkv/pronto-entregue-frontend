import React, { useState, useEffect } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, InputAdornment, TextField, FormControl, Button, MenuItem, FormHelperText, List, ListItemIcon, ListItemText, ListItemSecondaryAction, ListItem, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Chip, IconButton, Grid, Typography, Avatar } from '@material-ui/core';
import { mdiAccountCircle, mdiInformation } from '@mdi/js';
import Icon from '@mdi/react';
import Downshift from 'downshift';
import { Form, Field } from 'formik';
import { isEmpty } from 'lodash';
import numeral from 'numeral';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField } from '../../layout/components';

import { useSelectedCompany, useLoggedUserRole } from '../../controller/hooks';
import { availableStatus } from '../../controller/orderStatus'
import { errorObjectsToArray } from '../../utils/error';
import { calculateOrderPrice } from '../../utils/orders';
import Delivery from './delivery';
import Products from './products';

import { GET_COMPANY_PAYMENT_METHODS } from '../../graphql/companies';
import { SEARCH_USERS } from '../../graphql/users';

export default function PageForm ({ editId, values, setFieldValue, isSubmitting, errors, isValidating, initialValues }) {
	// carregamento inicial
	const { user, price, products, status, paymentMethod, paymentFee, discount, deliveryPrice, creditHistory, coupon } = values;
	const loggedUserRole = useLoggedUserRole();
	const canChangeStatus = loggedUserRole === 'master' || !['delivered', 'canceled'].includes(initialValues.status)
	const inputDisabled = !canChangeStatus || isSubmitting;

	// user
	const [userDialog, setUserDialog] = useState(false);
	function handleCloseUserDialog() {
		setUserDialog(false)
	}
	
	// errors
	const [errorDialog, setErrorDialog] = useState(false);
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
			<Dialog
				open={userDialog}
				onClose={handleCloseUserDialog}
				fullWidth
				maxWidth='xs'
			>
				<DialogTitle>Informações do cliente</DialogTitle>
				<DialogContent>
					{Boolean(user) && <Grid container spacing={2}>
						<Grid item xs={3}>
							<Avatar alt={user.fullName} style={{ width: 90, height: 90 }} src={user.image} />
						</Grid>
						<Grid item xs={9}>
							<Typography style={{ color: '#bbb' }} variant='caption'>Nome</Typography>
							<Typography>{user.firstName}</Typography>
							<Typography style={{ color: '#bbb' }} variant='caption'>Sobrenome</Typography>
							<Typography>{user.lastName}</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography style={{ color: '#bbb' }} variant='caption'>Email</Typography>
							<Typography>{user.email}</Typography>
						</Grid>
						{Boolean(user.phones.length) && <Grid item xs={12}>
							<Typography style={{ color: '#bbb' }} variant='caption'>Telefones</Typography>
							{user.phones.map((phone, index)=><Typography key={index}>{phone.value}</Typography>)}
						</Grid>}
					</Grid>}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseUserDialog}>Fechar</Button>
				</DialogActions>
			</Dialog>
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
													<TextField disabled={inputDisabled} {...getInputProps({ error: !!errors.user, label: 'Cliente' })} />
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
							<FieldControl style={{ flex: .05 }}>
								<IconButton disabled={!user} onClick={()=>setUserDialog(true)}>
									<Icon path={mdiInformation} color='#333' size={.9} />
								</IconButton>
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<Field name='message' controldisabled={inputDisabled} multiline component={tField} label='Observações' />
							</FieldControl>
						</FormRow>
					</Paper>
				</Block>
				{(user && user.id) && (
					<>
						<Products />
						<Delivery />
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
									<TextField
										select
										label='Status'
										value={status}
										onChange={(e)=>{setFieldValue('status', e.target.value)}}
										disabled={loggedUserRole !== 'master' && ['delivered', 'canceled'].includes(status)}
									>
										{availableStatus(values).map(status => <MenuItem key={status.slug} value={status.slug}>{status.label}</MenuItem>)}
									</TextField>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<Button fullWidth type='submit' variant="contained" disabled={inputDisabled} color='primary'>Salvar</Button>
								</FieldControl>
							</FormRow>
						</BlockSeparator>
						<BlockSeparator>
							<FormRow>
								<FieldControl>
									<Field
										controldisabled={inputDisabled}
										label='Valor da entrega'
										type='number'
										name='deliveryPrice'
										InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
										component={tField}
									/>
								</FieldControl>
							</FormRow>
							{creditHistory && <FormRow>
								<FieldControl>
									<Chip color='secondary' label={`Créditos: ${numeral(Math.abs(creditHistory.value)).format('$0,0.00')}`} />
								</FieldControl>
							</FormRow>}
							{coupon && <FormRow>
								<FieldControl>
									<Chip color='secondary' label={`Cupom: ${coupon.name}`} />
								</FieldControl>
							</FormRow>}
							<FormRow>
								<FieldControl>
									<Field
										controldisabled={inputDisabled || initialValues.discount}
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
										disabled={inputDisabled}
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
									<TextField disabled={Boolean((paymentMethod && paymentMethod.id && editId) || inputDisabled)} helperText={errors.paymentMethod} error={!!errors.paymentMethod} select label='Forma de pagamento' value={paymentMethod && paymentMethod.id ? paymentMethod.id : ''} onChange={(e)=>setFieldValue('paymentMethod.id', e.target.value)}>
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