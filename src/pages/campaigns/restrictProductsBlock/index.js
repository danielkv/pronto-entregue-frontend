import React, { useState } from 'react'

import { useMutation } from '@apollo/react-hooks';
import { Paper, FormHelperText, TextField, List, ListItem, ListItemIcon, CircularProgress, ListItemText, FormControl, Chip, Avatar, ListItemSecondaryAction } from '@material-ui/core'
import { mdiBasket } from '@mdi/js';
import Icon from '@mdi/react';
import Downshift from 'downshift';
import { useFormikContext } from 'formik';
import { cloneDeep } from 'lodash';

import { Block, BlockHeader, BlockTitle, FormRow, FieldControl } from '../../../layout/components'

import { useLoggedUserRole } from '../../../controller/hooks';

import { SEARCH_PRODUCTS } from '../../../graphql/products';

export default function RestrictProductsBlock() {
	const { values: { products, companies }, setFieldValue, isSubmitting } = useFormikContext();
	const [productsFound, setProductsFound] = useState([]);

	const loggedUserRole = useLoggedUserRole();

	const searchVariables = { exclude: products.map(p=>p.id) };
	if (loggedUserRole !== 'master' || companies.length) searchVariables.companies = companies.map(c=>c.id);
	const [searchProducts, { loading: loadingProducts }] = useMutation(SEARCH_PRODUCTS, { variables: searchVariables, fetchPolicy: 'no-cache' });

	function handleSelect (selected, { setState }) {
		if (!selected) return;
		setFieldValue('products', [...products, selected]);
		setState({ inputValue: '' });
	}
	
	const handleDelete = (index) => () => {
		const newProducts = cloneDeep(products);
		newProducts.splice(index, 1);
		setFieldValue('products', newProducts);
	}

	async function handleSearch (search) {
		const { data: { searchProducts: searchResult } } = await searchProducts({ variables: { search } });

		setProductsFound(searchResult);
	}

	return (
		<Block>
			<BlockHeader>
				<BlockTitle>Restringir Produtos {!!products.length && `(${products.length})`}</BlockTitle>
				{loggedUserRole === 'master' && !!companies.length && <FormHelperText>Apenas serão listados produtos das emrpesas selecionadas produto</FormHelperText>}
			</BlockHeader>
			<Paper>
				<FormRow>
					<FieldControl>
						<FormControl>
							<Downshift
								onChange={handleSelect}
								itemToString={(item => item ? item.name : '')}
								onInputValueChange={(value)=>{handleSearch(value)}}
							>
								{({
									getInputProps,
									getItemProps,
									getMenuProps,
									isOpen,
									highlightedIndex,
								})=>(
									<div style={{ width: '100%' }}>
										<TextField label='Buscar produto' {...getInputProps()} disabled={isSubmitting} />
										{isOpen && (
											<List {...getMenuProps()} className="dropdown">
												{loadingProducts && <div style={{ padding: 20 }}><CircularProgress /></div>}
												{!productsFound.length
													? <ListItem>Nenhum produto encontrado</ListItem>
													: productsFound.map((product, index) => (
														<ListItem
															className="dropdown-item"
															selected={highlightedIndex === index}
															key={product.id}
															{...getItemProps({ key: product.id, index, item: product })}
														>
															<ListItemIcon><Icon path={mdiBasket} color='#707070' size='22' /></ListItemIcon>
															<ListItemText>{product.name}</ListItemText>
															<ListItemSecondaryAction>
																<small>{loggedUserRole === 'master' ? product.company.name : product.category.name}</small>
															</ListItemSecondaryAction>
														</ListItem>
													))}
											</List>
										)}
									</div>
								)}
							</Downshift>
						</FormControl>
					</FieldControl>
				</FormRow>
				<FormRow>
					<FieldControl>
						{products.map((product, index) => (
							<Chip
								key={product.id}
								onDelete={handleDelete(index)}
								label={product.name}
								avatar={<Avatar src={product.image} />}
							/>
						))}
					</FieldControl>
				</FormRow>
			</Paper>
			<FormHelperText>A campanha ficará ativa para os produtos selecionados. Caso nenhum for selecionado, ficará ativa para todos.</FormHelperText>
		</Block>
	)
}
