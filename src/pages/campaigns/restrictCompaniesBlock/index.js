import React, { useState } from 'react'

import { useMutation } from '@apollo/react-hooks';
import { Paper, FormHelperText, TextField, List, ListItem, ListItemIcon, CircularProgress, ListItemText, FormControl, Chip, Avatar } from '@material-ui/core'
import { mdiBasket } from '@mdi/js';
import Icon from '@mdi/react';
import Downshift from 'downshift';
import { useFormikContext } from 'formik';
import { cloneDeep } from 'lodash';

import { Block, BlockHeader, BlockTitle, FormRow, FieldControl } from '../../../layout/components'

import { SEARCH_COMPANIES } from '../../../graphql/companies';

export default function RestrictProductsBlock() {
	const { values: { companies }, setFieldValue, isSubmitting } = useFormikContext();
	const [companiesFound, setCompaniesFound] = useState([]);

	const [searchCompanies, { loading: loadingCompanies }] = useMutation(SEARCH_COMPANIES, { variables: { exclude: companies.map(c=>c.id) }, fetchPolicy: 'no-cache' });

	function handleSelect (selected, { setState }) {
		if (!selected) return;
		setFieldValue('companies', [...companies, selected]);
		setState({ inputValue: '', selectedItem: null });
	}
	
	const handleDelete = (index) => () => {
		const newCompanies = cloneDeep(companies);
		newCompanies.splice(index, 1);
		setFieldValue('companies', newCompanies);
	}

	async function handleSearch (search) {
		const { data: { searchCompanies: searchResult } } = await searchCompanies({ variables: { search } });

		setCompaniesFound(searchResult);
	}

	return (
		<Block>
			<BlockHeader>
				<BlockTitle>Restringir Empresas {!!companies.length && `(${companies.length})`}</BlockTitle>
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
										<TextField label='Buscar empresa'  {...getInputProps()} disabled={isSubmitting} />
										{isOpen && (
											<List {...getMenuProps()} className="dropdown">
												{loadingCompanies && <div style={{ padding: 20 }}><CircularProgress /></div>}
												{!companiesFound.length
													? <ListItem>Nenhuma empresa encontrada</ListItem>
													: companiesFound.map((company, index) => (
														<ListItem
															className="dropdown-item"
															selected={highlightedIndex === index}
															key={company.id}
															{...getItemProps({ key: company.id, index, item: company })}
														>
															<ListItemIcon><Icon path={mdiBasket} color='#707070' size='22' /></ListItemIcon>
															<ListItemText>{company.name}</ListItemText>
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
						{companies.map((company, index) => (
							<Chip
								key={company.id}
								onDelete={handleDelete(index)}
								label={company.displayName}
								avatar={<Avatar>{company.displayName.substr(0, 1)}</Avatar>}
							/>
						))}
					</FieldControl>
				</FormRow>
			</Paper>
			<FormHelperText>A campanha ficará ativa para as empresas selecionadas. Caso nenhuma for selecionada, ficará ativa para todas.</FormHelperText>
		</Block>
	)
}
