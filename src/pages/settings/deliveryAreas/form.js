import React, { Fragment, useState } from 'react'

import { useMutation } from '@apollo/react-hooks';
import { FormHelperText, CircularProgress, Paper, Table, TableHead, TableRow, TableCell, TableBody, InputAdornment, IconButton, FormControl, ButtonGroup, Button } from '@material-ui/core';
import { mdiCashMarker, mdiMap, mdiDelete, mdiPlusCircle } from '@mdi/js';
import Icon from '@mdi/react';
import { Form, FieldArray, Field } from 'formik';

import { FormRow, FieldControl, tField } from '../../../layout/components';

import { useSelectedCompany } from '../../../controller/hooks';
import AreaMap from './areaMap';

import { REMOVE_DELIVERY_AREA, GET_COMPANY_DELIVERY_AREAS } from '../../../graphql/deliveryAreas';

export default function FormPage({ values: { deliveryAreas }, isSubmitting, setFieldValue, center, errors }) {
	const selectedCompany = useSelectedCompany();
	const [removeDeliveryArea] = useMutation(REMOVE_DELIVERY_AREA, { refetchQueries: [{ query: GET_COMPANY_DELIVERY_AREAS, variables: { id: selectedCompany } }] })

	const [mapOpen, setMapOpen] = useState(false);
	const [selectedAreaIndex, setSelectedAreaIndex] = useState(null);

	function handleCloseMap () {
		setMapOpen(false);
	}
	
	const handleOpenMap = (index) => () => {
		setSelectedAreaIndex(index)
		setMapOpen(true);
	}

	function handleApply (result) {
		setFieldValue(`deliveryAreas.${selectedAreaIndex}`, { ...result })
		setSelectedAreaIndex(null);
	}

	return (
		<Paper>
			
			<AreaMap mapOpen={mapOpen} handleApply={handleApply} handleCloseMap={handleCloseMap} selectedAreaIndex={selectedAreaIndex} center={center} />
					
			<Form>
				<FieldArray name='deliveryAreas'>
					{({ insert, remove })=>
						(
							<Fragment>
						
								<Table>
									<TableHead>
										<TableRow>
											<TableCell></TableCell>
											<TableCell>Nome (identificação)</TableCell>
											<TableCell>Valor da entrega</TableCell>
											<TableCell></TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{deliveryAreas.map((area, index)=> {
											const radiusError = errors && errors.deliveryAreas && errors.deliveryAreas[index] && errors.deliveryAreas[index].radius;
											return (
												<TableRow key={index}>
													<TableCell><Icon path={mdiCashMarker} color='#707070' size={1} /></TableCell>
													<TableCell>
														<Field disabled={isSubmitting} component={tField} name={`deliveryAreas.${index}.name`} inputProps={{ autoComplete: "false" }} />
													</TableCell>
													<TableCell>
														<Field
															disabled={isSubmitting}
															component={tField}
															type='number'
															name={`deliveryAreas.${index}.price`}
															InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
															inputProps={{ step: '0.01' }}
														/>
													</TableCell>
													<TableCell>
														{area.removing ?
															<CircularProgress />
															:
															(<>
																<IconButton
																	disabled={isSubmitting}
																	onClick={handleOpenMap(index)}
																>
																	<Icon path={mdiMap} color={radiusError ? '#e00' : '#707070'} size={1} />
																</IconButton>
																<IconButton
																	disabled={isSubmitting}
																	onClick={()=>{
																		if (!area.id)
																			remove(index);
																		else {
																			setFieldValue(`deliveryAreas.${index}.removing`, true);
																			removeDeliveryArea({ variables: { id: area.id } });
																		}
																	}}
																>
																	<Icon path={mdiDelete} color='#707070' size={1} />
																</IconButton>
															</>)
														}
													</TableCell>
												</TableRow>
											)}
										)}
									</TableBody>
								</Table>
								<FormRow></FormRow>
								<FormRow>
									<FieldControl>
										<FormControl>
											<ButtonGroup disabled={isSubmitting}>
												{/* <Button color='primary'>Cancelar</Button> */}
												<Button
													variant="contained"
													color='primary'
													onClick={()=>{insert(deliveryAreas.length, { distance: '', price: 0 })}}
												>
													<Icon className='iconLeft' path={mdiPlusCircle} color='#fff' size={1} /> Adicionar
												</Button>
												<Button
													type='submit'
													variant="contained"
													color='primary'
													disabled={isSubmitting}
												>
											Salvar
												</Button>
											</ButtonGroup>
											{!!isSubmitting && <CircularProgress />}
											<FormHelperText>Seu estelecimento será listado no app para os clientes que estão dentro raio de entrega da maior distância definida acima.</FormHelperText>
										</FormControl>
									</FieldControl>
								</FormRow>
							</Fragment>
						)}
				</FieldArray>
			</Form>
		</Paper>
	)
}
