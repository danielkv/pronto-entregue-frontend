import React, { useState, Fragment, useRef } from 'react';
import {Paper, InputAdornment, TextField, IconButton, FormControl, Button, Select, MenuItem, InputLabel, FormHelperText, Table, TableBody, TableRow, TableCell, TableHead, List, ListItemIcon, ListItemText, ListItemSecondaryAction, ListItem} from '@material-ui/core';
import { useQuery, useApolloClient ,useLazyQuery } from '@apollo/react-hooks';
import Icon from '@mdi/react';
import numeral from 'numeral';
import {mdiContentDuplicate, mdiDelete, mdiPencil, mdiAccountCircle, mdiBasket } from '@mdi/js';
import { Formik, FieldArray, Form, Field} from 'formik';
import * as Yup from 'yup';
import Downshift from 'downshift';

import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, ProductImage, Loading, tField} from '../../layout/components';
import ProductModal from './product_modal';
import { SEARCH_USERS } from '../../graphql/users';
import { SEARCH_BRANCH_PRODUCTS, LOAD_PRODUCT_FULL } from '../../graphql/products';
import { createEmptyOrderProduct } from '../../utils';

export default function PageForm ({initialValues, onSubmit, pageTitle, validateOnChange, edit}) {
	const productSchema = Yup.object().shape({
		type: Yup.string().required('Obrigatório'),
		user: Yup.object().required('Obrigatório'),
		price: Yup.number().required('Obrigatório'),
		message: Yup.string().required('Obrigatório'),
		
		options_groups: Yup.array().of(Yup.object().shape({
			name: Yup.string().required('Obrigatório'),
			options: Yup.array().of(Yup.object().shape({
				name: Yup.string().required('Obrigatório'),
				price: Yup.number().required('Obrigatório'),
			})),
		})),
	});

	//carregamento inicial
	const client = useApolloClient();
	const [editingProductIndex, setEditingProductIndex] = useState(null);
	const [loadingProduct, setLoadingProduct] = useState(false);
	const formRef = useRef(null);

	//Query de busca de usuário
	const [searchUsers, {data:usersData, loading:loadingUsers}] = useLazyQuery(SEARCH_USERS, {fetchPolicy:'no-cache'});
	const usersFound = usersData && !loadingUsers ? usersData.searchCompanyUsers : [];
	
	//Query de busca de produto
	const [searchProducts, {data:productsData, loading:loadingProducts}] = useLazyQuery(SEARCH_BRANCH_PRODUCTS, {fetchPolicy:'no-cache'});
	const productsFound = productsData && !loadingProducts ? productsData.searchBranchProducts : [];

	const handleSearchCustomer = (value) => {
		searchUsers({variables:{search: value}});
	}
	const handleSearchProducts = (value) => {
		searchProducts({variables:{search: value}});
	}
	const handleSelectAddress = ({street, number, zipcode, district, city, state}) => {
		formRef.current.setValues({
			...formRef.current.state.values,
			street,
			number,
			zipcode,
			district,
			city,
			state,
		})
	}

	const getProductFromItem = (item) => {
		setLoadingProduct(true);
		return client.query({query: LOAD_PRODUCT, variables:{id:item.id}})
		.then(({data:{product}})=>{
			return createEmptyOrderProduct({...product, action:'create'});
		})
		.catch((err)=> {
			console.error(err);
		})
		.finally(()=>{
			setLoadingProduct(false);
		})
	}

	const handleSaveProductModal = (data) => {
		formRef.current.setFieldValue(`products.${editingProductIndex}`, data);
	}

	const handleOpenProductModal = (productIndex) => {
		setEditingProductIndex(productIndex);
	}
	const handleCloseProductModal = () => {
		setEditingProductIndex(null);
	}

	return (
		<Formik
			ref={formRef}
			validationSchema={productSchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={validateOnChange}
			validateOnBlur={false}
		>
			{({values:{user, type, products}, setFieldValue, handleChange, isSubmitting, errors}) => {
			return (<Form>
				<ProductModal prod={products[editingProductIndex]} open={editingProductIndex!==null} onSave={handleSaveProductModal} onClose={handleCloseProductModal} />
				<Content>
					<Block>
						<BlockHeader>
							<BlockTitle>{pageTitle}</BlockTitle>
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
												inputValue,
												highlightedIndex,
											})=>{
												return (
													<div>
														<TextField disabled={isSubmitting} {...getInputProps({error:!!errors.user})} />
														{isOpen && (
															<List {...getMenuProps()} className="dropdown">
																{loadingUsers ? <div style={{padding:20}}><Loading /></div>
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
										<FormHelperText error={!!errors.user}>Digite para buscar um cliente</FormHelperText>
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
								<FieldControl style={{flex:.3}}>
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
											{!!user && user.addresses.map((address, index)=>(
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
									<FieldControl style={{flex:.3}}>
										<Field type='number' name='number' component={tField} label='Número' />
									</FieldControl>
									<FieldControl style={{flex:.3}}>
										<Field name='zipcode' component={tField} label='CEP' />
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
								{({insert, remove}) =>
								(<Fragment>
									<BlockSeparator>
										<FormRow>
											<FieldControl>
												<FormControl>
													<Downshift
														onChange={(item, {clearSelection})=>{
															if (!item) return;
															getProductFromItem(item)
															.then(product=>{
																insert(0, product);
																handleOpenProductModal(0);
																clearSelection();
															})
														}}
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
																				disabled:isSubmitting || loadingProduct,
																				onBlur: clearSelection,
																			})
																		}
																		/>
																	{isOpen && (
																		<List {...getMenuProps()} className="dropdown">
																			{loadingProducts ? <div style={{padding:20}}><Loading /></div>
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
													<FormHelperText>Digite para buscar produtos</FormHelperText>
												</FormControl>
											</FieldControl>
										</FormRow>
									</BlockSeparator>
									<BlockSeparator>
										<Table>
											<TableHead>
												<TableRow>
													<TableCell style={{width:70, paddingRight:10}}></TableCell>
													<TableCell>Produto</TableCell>
													<TableCell style={{width:110}}>Valor</TableCell>
													<TableCell style={{width:130}}>Ações</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{products.map((row, index) => {
													let price = row.options_groups.reduce((totalGroup, group)=>{
														let optionsPrice = group.options.reduce((totalOption, option)=> {
															return (option.selected) ?  totalOption + option.price : totalOption;
														}, 0);
														return totalGroup + optionsPrice;
													}, row.price);
													let selected_options = (row.options_groups.filter(group=>{
														return group.options.some(option=>option.selected);
													})
													.map(group=>{
														let options = group.options.filter(option=>option.selected).map(option=>option.name);
														return (options.length) ? options.join(', ') : '';
													}));
													return(
													<TableRow key={`${row.id}.${index}`}>
														<TableCell style={{width:80, paddingRight:10}}><ProductImage src={row.image} alt={row.name} /></TableCell>
														<TableCell>
															<div>{row.name}</div>
															{!!selected_options.length &&
																<FormHelperText>
																	{selected_options.join(', ')}
																</FormHelperText>
															}
														</TableCell>
														<TableCell>
															{numeral(price).format('$0,0.00')}
														</TableCell>
														<TableCell>
															<IconButton disabled={isSubmitting} onClick={()=>handleOpenProductModal(index)}>
																<Icon path={mdiPencil} size='18' color='#363E5E' />
															</IconButton>
															<IconButton>
																<Icon path={mdiContentDuplicate} size='18' color='#363E5E' />
															</IconButton>
															<IconButton>
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
										<TextField select label='Status' value='delivering'>
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
										<TextField label='Desconto' value={0} InputProps={{startAdornment:<InputAdornment position="start">R$</InputAdornment>}} />
									</FieldControl>
								</FormRow>
								<FormRow>
									<FieldControl>
										<TextField label='Valor total' value={0} InputProps={{startAdornment:<InputAdornment position="start">R$</InputAdornment>}} />
									</FieldControl>
								</FormRow>
								<FormRow>
									<FieldControl>
										<TextField select label='Forma de pagamento' value='money'>
											<MenuItem value='credit_debit'>Cartão de crédito/débito</MenuItem>
											<MenuItem value='money'>Dinheiro</MenuItem>
										</TextField>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
						</Sidebar>
					</Block>
				</SidebarContainer>
			</Form>)}}
		</Formik>
	)
}