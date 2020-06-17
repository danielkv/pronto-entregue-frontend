import React, { Fragment, useState } from 'react'

import { useMutation } from '@apollo/react-hooks';
import { FormHelperText, CircularProgress, Paper, Table, TableHead, TableRow, TableCell, TableBody, InputAdornment, IconButton, FormControl, ButtonGroup, Button, FormControlLabel, Switch } from '@material-ui/core';
import { mdiCashMarker, mdiMap, mdiDelete, mdiPlusCircle } from '@mdi/js';
import Icon from '@mdi/react';
import { Form, FieldArray, Field } from 'formik';

import { FormRow, FieldControl, tField } from '../../../layout/components';

import { useSelectedCompany } from '../../../controller/hooks';
import AreaMap from './areaMap';

import { REMOVE_PE_DELIVERY_AREA, GET_COMPANY_PE_DELIVERY_AREAS } from '../../../graphql/peDeliveryAreas';

export default function FormPage({ values: { peDeliveryAreas }, isSubmitting, setFieldValue, center, errors }) {
	const selectedCompany = useSelectedCompany();
	const [removeDeliveryArea] = useMutation(REMOVE_PE_DELIVERY_AREA, { refetchQueries: [{ query: GET_COMPANY_PE_DELIVERY_AREAS, variables: { id: selectedCompany } }] })

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
		setFieldValue(`peDeliveryAreas.${selectedAreaIndex}`, { ...result })
		setSelectedAreaIndex(null);
	}

	return (
		<Paper>
			
			<AreaMap mapOpen={mapOpen} handleApply={handleApply} handleCloseMap={handleCloseMap} selectedAreaIndex={selectedAreaIndex} center={center} />
					
			<Form>
				<FieldArray name='peDeliveryAreas'>
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
										{peDeliveryAreas.map((area, index)=> {
											const radiusError = errors && errors.peDeliveryAreas && errors.peDeliveryAreas[index] && errors.peDeliveryAreas[index].radius;
											return (
												<TableRow key={index}>
													<TableCell><Icon path={mdiCashMarker} color='#707070' size={1} /></TableCell>
													<TableCell>
														<Field disabled={isSubmitting} component={tField} name={`peDeliveryAreas.${index}.name`} inputProps={{ autoComplete: "false" }} />
													</TableCell>
													<TableCell>
														<Field
															disabled={isSubmitting}
															component={tField}
															type='number'
															name={`peDeliveryAreas.${index}.price`}
															InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
															inputProps={{ step: '0.01' }}
														/>
													</TableCell>
													<TableCell>
														{area.removing ?
															<CircularProgress />
															:
															(<>
																<FormControlLabel
																	labelPlacement='start'
																	control={
																		<Switch size='small' color='primary' checked={area.active} onChange={()=>{setFieldValue(`peDeliveryAreas.${index}.active`, !area.active)}} value="includeDisabled" />
																	}
																/>
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
																			setFieldValue(`peDeliveryAreas.${index}.removing`, true);
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
													onClick={()=>{insert(peDeliveryAreas.length, { name: '', price: 0, active: true })}}
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
