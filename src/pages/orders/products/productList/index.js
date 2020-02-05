import React from 'react'

import { Table, TableHead, TableRow, TableCell, TableBody, FormHelperText, IconButton, Avatar } from '@material-ui/core';
import { mdiContentDuplicate, mdiDelete, mdiPencil } from '@mdi/js';
import Icon from '@mdi/react';
import { FieldArray, useFormikContext } from 'formik';
import numeral from 'numeral';

import { BlockSeparator } from '../../../../layout/components';

import { calculateProductPrice } from '../../../../utils/products';

export default function ProductList({ setEditingProductIndex }) {
	const { values: { products }, isSubmitting, setFieldValue } = useFormikContext();

	return (
		<BlockSeparator>
			<FieldArray name='products'>
				{({ remove }) =>
					(<>
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
									const productIndex = products.findIndex(r=>r.id===row.id);
									const productPrice = calculateProductPrice(row);
									const selectedOptions = (row.optionsGroups.filter(group=>{
										return group.options.some(option=>option.selected);
									})
										.map(group=>{
											let options = group.options.filter(option=>option.selected).map(option=>option.name);
											return (options.length) ? options.join(', ') : '';
										}));
									return(
										<TableRow key={`${row.id}.${index}`}>
											<TableCell style={{ width: 80, paddingRight: 10 }}><Avatar src={row.image} alt={row.name} /></TableCell>
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
													<Icon path={mdiPencil} size={.7} color='#363E5E' />
												</IconButton>
												<IconButton>
													<Icon path={mdiContentDuplicate} size={.7} color='#363E5E' />
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
													<Icon path={mdiDelete} size={.7} color='#707070' />
												</IconButton>
											</TableCell>
										</TableRow>
									)})}
							</TableBody>
						</Table>
					</>)}
			</FieldArray>
		</BlockSeparator>
	)
}
