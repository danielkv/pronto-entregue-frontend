import React, { useState } from 'react'

import { useApolloClient, useLazyQuery } from '@apollo/react-hooks';
import { Paper, FormControl, TextField, List, CircularProgress, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, FormHelperText } from '@material-ui/core'
import { mdiBasket } from '@mdi/js';
import Icon from '@mdi/react';
import Downshift from 'downshift'
import {  useFormikContext } from 'formik'


import { Block, BlockHeader, BlockTitle, BlockSeparator, FormRow, FieldControl } from '../../../layout/components'

import { useSelectedCompany } from '../../../controller/hooks';
import { getErrors } from '../../../utils/error';
import { createEmptyOrderProduct } from '../../../utils/orders';
import ProductModal from './modal';
import ProductList from './productList';

import { GET_COMPANY_PRODUCTS, LOAD_PRODUCT } from '../../../graphql/products';

export default function Products() {
	// Formik context
	const { values: { products }, isSubmitting, setFieldValue, errors } = useFormikContext();

	const [loadingProduct, setLoadingProduct] = useState(false);
	const [editingProductIndex, setEditingProductIndex] = useState(null);
	const [productModalCancel, setProductModalCancel] = useState(false);
	const client = useApolloClient();
	const selectedCompany = useSelectedCompany();

	const [searchProducts, {
		data: { company: { products: productsFound = [] } = {} } = {}, loading: loadingProducts
	}] = useLazyQuery(GET_COMPANY_PRODUCTS, { fetchPolicy: 'no-cache', variables: { id: selectedCompany } });

	//Query de busca de produto
	const handleSearchProducts = (value) => {
		searchProducts({ variables: { filter: { search: value } } });
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
				console.error(getErrors(err));
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

	return (
		<Block>
			<ProductModal onCancel={productModalCancel} prod={products[editingProductIndex]} open={editingProductIndex!==null} onSave={handleSaveProductModal} onClose={handleCloseProductModal} />
			<BlockHeader>
				<BlockTitle>Produtos {!!loadingProduct && <CircularProgress />}</BlockTitle>
			</BlockHeader>
			<Paper>
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
														{loadingProducts ? <div style={{ padding: 20 }}><CircularProgress /></div>
															:
															productsFound.map((item, index) => {
																return (<ListItem
																	className="dropdown-item"
																	selected={highlightedIndex === index}
																	key={item.id}
																	{...getItemProps({ key: item.id, index, item })}
																>
																	<ListItemIcon><Icon path={mdiBasket} color='#707070' size={1} /></ListItemIcon>
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

				<ProductList setEditingProductIndex={setEditingProductIndex} />
			</Paper>
		</Block>
	)
}
