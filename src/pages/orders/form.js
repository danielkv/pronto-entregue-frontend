import React, { useState, Fragment, useEffect, useCallback } from 'react';

import { useQuery, useApolloClient ,useLazyQuery } from '@apollo/react-hooks';
import { Paper, InputAdornment, TextField, IconButton, FormControl, Button, Select, MenuItem, InputLabel, FormHelperText, Table, TableBody, TableRow, TableCell, TableHead, List, ListItemIcon, ListItemText, ListItemSecondaryAction, ListItem } from '@material-ui/core';
import { mdiContentDuplicate, mdiDelete, mdiPencil, mdiAccountCircle, mdiBasket } from '@mdi/js';
import Icon from '@mdi/react';
import Downshift from 'downshift';
import { FieldArray, Form, Field } from 'formik';
import numeral from 'numeral';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, ProductImage, Loading, tField } from '../../layout/components';

import { createEmptyOrderProduct, calculateProductPrice, calculateOrderPrice } from '../../utils';
import ProductModal from './product_modal';

import { GET_SELECTED_COMPANY, GET_COMPANY_PAYMENT_METHODS } from '../../graphql/companies';
import { CALCULATE_DELIVERY_PRICE } from '../../graphql/orders';
import { GET_COMPANY_PRODUCTS, LOAD_PRODUCT } from '../../graphql/products';
import { SEARCH_USERS } from '../../graphql/users';

export default function PageForm ({ values, setValues, setFieldValue, handleChange, isSubmitting, errors }) {
	// carregamento inicial
	const { user, type, price, products, status, paymentMethod, paymentFee, discount, deliveryPrice } = values;
	const { zipcode } = values;
	const client = useApolloClient();
	const [editingProductIndex, setEditingProductIndex] = useState(null);
	const [productModalCancel, setProductModalCancel] = useState(false);
	const [loadingProduct, setLoadingProduct] = useState(false);
	const [loadingdeliveryPrice, setLoadingdeliveryPrice] = useState(false);

	//Carrega filial selecionada
	const { data: { selectedCompany }, loading: loadingSelectedData } = useQuery(GET_SELECTED_COMPANY);

	//Query de busca de usuário
	const [searchUsers, { data: usersData, loading: loadingUsers }] = useLazyQuery(SEARCH_USERS, { fetchPolicy: 'no-cache' });
	const usersFound = usersData && !loadingUsers ? usersData.searchCompanyUsers : [];
	
	//Query de busca de produto
	const [searchProducts, {
		data: { company: { products: productsFound = [] } = {} } = {}, loading: loadingProducts
	}] = useLazyQuery(GET_COMPANY_PRODUCTS, { fetchPolicy: 'no-cache', variables: { id: selectedCompany } });


	//Query formas de pagamento
	const {
		data: { company: { paymentMethods = [] } = {} } = {},
	} = useQuery(GET_COMPANY_PAYMENT_METHODS, { variables: { id: selectedCompany } });

	const handleSearchCustomer = (value) => {
		searchUsers({ variables: { search: value } });
	}
	const handleSearchProducts = (value) => {
		searchProducts({ variables: { search: value } });
	}
	const handleSelectAddress = ({ street, number, zipcode, district, city, state }) => {
		setValues({
			...values,
			street,
			number,
			zipcode,
			district,
			city,
			state,
		})
	}

	const handleAddProduct = (item, { clearSelection })=>{
		if (!item) return;
		getProductFromItem(item)
			.then(product=>{
				let newProducts = [...products];
				newProducts.unshift(product);
				setFieldValue('products', newProducts);
				setProductModalCancel(()=>()=>{
					let newProducts = Array.from(products);
					setFieldValue('products', newProducts);
				});
				setEditingProductIndex(0);
				clearSelection();
			})
	}

	const getProductFromItem = (item) => {
		setLoadingProduct(true);
		return client.query({ query: LOAD_PRODUCT, variables: { id: item.id } })
			.then(({ data: { product } })=>{
				return createEmptyOrderProduct({ ...product, action: 'create' });
			})
			.catch((err)=> {
				console.error(err);
			})
			.finally(()=>{
				setLoadingProduct(false);
			})
	}

	const handleSaveProductModal = (data) => {
		setFieldValue(`products.${editingProductIndex}`, data);
	}

	const handleCloseProductModal = () => {
		setProductModalCancel(null);
		setEditingProductIndex(null);
	}

	const calculatedeliveryPrice = useCallback((_zipcode)=>{
		setFieldValue('zipcodeOk', false);
		if (!_zipcode) return;
		
		// eslint-disable-next-line no-param-reassign
		_zipcode = parseInt(_zipcode.replace(/-/g, ''));
		if (_zipcode.toString().length !== 8) return;
		
		setLoadingdeliveryPrice(true);
		client.query({ query: CALCULATE_DELIVERY_PRICE, variables: { zipcode: _zipcode } })
			.then(({ data: { calculatedeliveryPrice: area } })=>{
				setFieldValue('deliveryPrice', area.price);
				setFieldValue('zipcodeOk', true);
			})
			.finally(()=>{
				setLoadingdeliveryPrice(false);
			});

	},[client, setFieldValue, setLoadingdeliveryPrice]);


	useEffect(()=>{
		setFieldValue('price', calculateOrderPrice(products, deliveryPrice + paymentFee - discount))
	}, [products, deliveryPrice, paymentFee, discount, setFieldValue]);
	
	useEffect(()=>{
		calculatedeliveryPrice(zipcode);
	}, [zipcode, calculatedeliveryPrice]);

	return (
		<Form>
			<ProductModal onCancel={productModalCancel} prod={products[editingProductIndex]} open={editingProductIndex!==null} onSave={handleSaveProductModal} onClose={handleCloseProductModal} />
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Pedido</BlockTitle>
					</BlockHeader>
					<Paper>
						<FormRow>
							<FieldControl>
								<FormControl>
									<Downshift
										onChange={(item)=>{setFieldValue('user', item)}}
										itemToString={(item => item ? item.full_name : '')}
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
															{loadingUsers ? <div style={{ padding: 20 }}><Loading /></div>
																:
																usersFound.map((item, index) => {
																	return (<ListItem
																		className="dropdown-item"
																		selected={highlightedIndex === index}
																		key={item.id}
																		{...getItemProps({ key: item.id, index, item })}
																	>
																		<ListItemIcon><Icon path={mdiAccountCircle} color='#707070' size='22' /></ListItemIcon>
																		<ListItemText>{item.full_name}</ListItemText>
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
				<Block>
					<BlockHeader>
						<BlockTitle>Retirada do pedido</BlockTitle>
					</BlockHeader>
					<Paper>
						<FormRow>
							<FieldControl style={{ flex: .3 }}>
								<FormControl>
									<InputLabel htmlFor="type">Tipo</InputLabel>
									<Select
										disableUnderline={true}
										name='type'
										value={type}
										error={!!errors.type}
										onChange={handleChange}
										inputProps={{
											name: 'type',
											id: 'type',
										}}
									>
										<MenuItem value='delivery'>Entrega</MenuItem>
										<MenuItem value='takeout'>Retirada no local</MenuItem>
									</Select>
									{!!errors.type && <FormHelperText error>{errors.type}</FormHelperText>}
								</FormControl>
							</FieldControl>
							{type === 'delivery' &&
							<FieldControl>
								<FormControl>
									<InputLabel htmlFor="user_addresses">Endereços cadastrados</InputLabel>
									<Select
										disableUnderline={true}
										value={''}
										onChange={(e)=>handleSelectAddress(user.addresses[e.target.value])}
										inputProps={{
											name: 'user_addresses',
											id: 'user_addresses',
										}}
									>
										{!!user && !!user.addresses && user.addresses.map((address, index)=>(
											<MenuItem key={index} value={index}>{`${address.street}, ${address.number} (${address.city} ${address.state})`}</MenuItem>
										))}
									</Select>
								</FormControl>
							</FieldControl>}
						</FormRow>
						{type === 'delivery' &&
						<Fragment>
							<FormRow>
								<FieldControl>
									<Field name='street' component={tField} label='Rua' />
								</FieldControl>
								<FieldControl style={{ flex: .3 }}>
									<Field type='number' name='number' component={tField} label='Número' />
								</FieldControl>
								<FieldControl style={{ flex: .3 }}>
									<FormControl>
										<Field name='zipcode' type='number' component={tField} label='CEP (apenas número)' />
										{!!errors.zipcodeOk && <FormHelperText error>{errors.zipcodeOk}</FormHelperText>}
									</FormControl>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<Field name='district' component={tField} label='Bairro' />
								</FieldControl>
								<FieldControl>
									<Field name='city' component={tField} label='Cidade' />
								</FieldControl>
								<FieldControl>
									<Field name='state' component={tField} label='Estado' />
								</FieldControl>
							</FormRow>
						</Fragment>}
					</Paper>
				</Block>
				<Block>
					<BlockHeader>
						<BlockTitle>Produtos {!!loadingProduct && <Loading />}</BlockTitle>
					</BlockHeader>
					<Paper>
						<FieldArray name='products'>
							{({ remove }) =>
								(<Fragment>
									<BlockSeparator>
										<FormRow>
											<FieldControl>
												<FormControl>
													<Downshift
														onChange={handleAddProduct}
														itemToString={(item => item ? item.name : '')}
														onInputValueChange={(value)=>{handleSearchProducts(value)}}
													>
														{({
															getInputProps,
															getItemProps,
															getMenuProps,
															isOpen,
															highlightedIndex,
															clearSelection
														})=>{
															return (
																<div>
																	<TextField
																		{...getInputProps({
																			disabled: isSubmitting || loadingProduct,
																			onBlur: clearSelection,
																		})
																		}
																	/>
																	{isOpen && (
																		<List {...getMenuProps()} className="dropdown">
																			{loadingProducts ? <div style={{ padding: 20 }}><Loading /></div>
																				:
																				productsFound.map((item, index) => {
																					return (<ListItem
																						className="dropdown-item"
																						selected={highlightedIndex === index}
																						key={item.id}
																						{...getItemProps({ key: item.id, index, item })}
																					>
																						<ListItemIcon><Icon path={mdiBasket} color='#707070' size='20' /></ListItemIcon>
																						<ListItemText>{item.name}</ListItemText>
																						<ListItemSecondaryAction><small>{item.category.name}</small></ListItemSecondaryAction>
																					</ListItem>)
																				})}
																		</List>
																	)}
																</div>
															)
														}}
													</Downshift>
													<FormHelperText error={!!errors.products}>{errors.products || 'Digite para buscar produtos'}</FormHelperText>
												</FormControl>
											</FieldControl>
										</FormRow>
									</BlockSeparator>
									<BlockSeparator>
										<Table>
											<TableHead>
												<TableRow>
													<TableCell style={{ width: 70, paddingRight: 10 }}></TableCell>
													<TableCell>Produto</TableCell>
													<TableCell style={{ width: 110 }}>Quantidade</TableCell>
													<TableCell style={{ width: 110 }}>Valor</TableCell>
													<TableCell style={{ width: 130 }}>Ações</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{products.filter(row=>row.action !== 'remove').map((row, index) => {
													let productIndex = products.findIndex(r=>r.id===row.id);
													let productPrice = calculateProductPrice(row);
													let selectedOptions = (row.options_groups.filter(group=>{
														return group.options.some(option=>option.selected);
													})
														.map(group=>{
															let options = group.options.filter(option=>option.selected).map(option=>option.name);
															return (options.length) ? options.join(', ') : '';
														}));
													return(
														<TableRow key={`${row.id}.${index}`}>
															<TableCell style={{ width: 80, paddingRight: 10 }}><ProductImage src={row.image} alt={row.name} /></TableCell>
															<TableCell>
																<div>{row.name}</div>
																{!!selectedOptions.length &&
															<FormHelperText>
																{selectedOptions.join(', ')}
															</FormHelperText>
																}
															</TableCell>
															<TableCell>
																{row.quantity}
															</TableCell>
															<TableCell>
																{numeral(productPrice).format('$0,0.00')}
															</TableCell>
															<TableCell>
																<IconButton disabled={isSubmitting} onClick={()=>setEditingProductIndex(productIndex)}>
																	<Icon path={mdiPencil} size='18' color='#363E5E' />
																</IconButton>
																<IconButton>
																	<Icon path={mdiContentDuplicate} size='18' color='#363E5E' />
																</IconButton>
																<IconButton
																	disabled={isSubmitting}
																	onClick={()=>{
																		if (row.action === 'create') remove(productIndex);
																		else {
																			setFieldValue(`products.${productIndex}.action`, 'remove');
																		}
																	}}
																>
																	<Icon path={mdiDelete} size='20' color='#707070' />
																</IconButton>
															</TableCell>
														</TableRow>
													)})}
											</TableBody>
										</Table>
									</BlockSeparator>
								</Fragment>)}
						</FieldArray>
					</Paper>
				</Block>
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
									<Button fullWidth type='submit' variant="contained" color='secondary'>Salvar</Button>
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
								{!!loadingdeliveryPrice && <Loading />}
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
									{!loadingSelectedData && !!paymentMethods.length &&
									<TextField helperText={errors.paymentMethod} error={!!errors.paymentMethod} select label='Forma de pagamento' value={paymentMethod && paymentMethod.id ? paymentMethod.id : ''} onChange={(e)=>setFieldValue('paymentMethod.id', e.target.value)}>
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
		</Form>
	)
}