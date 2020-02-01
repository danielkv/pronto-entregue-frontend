import React, { Fragment } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableCell, IconButton, TableRow, ButtonGroup, Button, InputAdornment, CircularProgress, FormHelperText, FormControl } from '@material-ui/core';
import { mdiCashMarker, mdiDelete, mdiPlusCircle } from '@mdi/js';
import Icon from '@mdi/react';
import { Formik, Field, FieldArray, Form } from 'formik';
import * as Yup from 'yup';

import { FormRow, FieldControl, tField } from '../../layout/components';

import { useSelectedCompany } from '../../controller/hooks';
import { LoadingBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { sanitizeDeliveryAreas } from '../../utils/settings';

import { GET_COMPANY_DELIVERY_AREAS, REMOVE_DELIVERY_AREA, MODIFY_DELIVERY_AREA } from '../../graphql/deliveryAreas';

function Page () {
	setPageTitle('Configurações - Locais de entrega');

	// query load delivery_areas
	const selectedCompany = useSelectedCompany();
	const {
		data: { company: { deliveryAreas: deliveryAreasInitial = [] } = {} } = {},
		loading: loadingDeliveryAreas
	} = useQuery(GET_COMPANY_DELIVERY_AREAS, { variables: { id: selectedCompany } });

	// mutations
	const [removeDeliveryArea, { loading: loadingRemoveDeliveryArea }] = useMutation(REMOVE_DELIVERY_AREA, { refetchQueries: [{ query: GET_COMPANY_DELIVERY_AREAS, variables: { id: selectedCompany } }] })
	const [modifyDeliveryAreas] = useMutation(MODIFY_DELIVERY_AREA, { refetchQueries: [{ query: GET_COMPANY_DELIVERY_AREAS, variables: { id: selectedCompany } }] })
	
	
	// still loading displays loading
	if (loadingDeliveryAreas) return <LoadingBlock />;

	//form schema
	const areasSchema = Yup.object().shape({
		deliveryAreas: Yup.array().of(Yup.object().shape({
			distance: Yup.number().typeError('A distancia dever ser em kilometros').required('Obrigatório'),
			price: Yup.number().required('Obrigatório'),
		}))
	});

	const handleSave = ({ deliveryAreas }) => {
		const deliveryAreasSave = sanitizeDeliveryAreas(deliveryAreas);
		return modifyDeliveryAreas({ variables: { data: deliveryAreasSave } });
	}

	return (
		<Formik
			onSubmit={handleSave}
			enableReinitialize={true}
			validationSchema={areasSchema}
			validateOnChange={false}
			validateOnBlur={true}
			initialValues={{ deliveryAreas: deliveryAreasInitial }}
		>
			{({ values: { deliveryAreas }, setFieldValue, isSubmitting })=>{
				const inputsDisabled = loadingRemoveDeliveryArea || isSubmitting;

				return (<Paper>
					<Form>
						<FieldArray name='deliveryAreas'>
							{({ insert, remove })=>(
								<Fragment>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell></TableCell>
												<TableCell>Distancia (km)</TableCell>
												<TableCell>Valor da entrega</TableCell>
												<TableCell></TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{deliveryAreas.map((area, index)=> (
												<TableRow key={index}>
													<TableCell><Icon path={mdiCashMarker} color='#707070' size={1} /></TableCell>
													<TableCell>
														<Field disabled={inputsDisabled} component={tField} name={`deliveryAreas.${index}.distance`} inputProps={{ autoComplete: "false" }} />
													</TableCell>
													<TableCell>
														<Field
															disabled={inputsDisabled}
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
															<IconButton
																disabled={inputsDisabled}
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
															</IconButton>}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
									<FormRow></FormRow>
									<FormRow>
										<FieldControl>
											<FormControl>
												<ButtonGroup disabled={inputsDisabled}>
													{/* <Button color='secondary'>Cancelar</Button> */}
													<Button
														variant="contained"
														color='secondary'
														onClick={()=>{insert(deliveryAreas.length, { distance: '', price: 0 })}}
													>
														<Icon className='iconLeft' path={mdiPlusCircle} color='#fff' size={1} /> Adicionar
													</Button>
													<Button
														type='submit'
														variant="contained"
														color='secondary'
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
				</Paper>)}}
		</Formik>
	)
}

export default Page;