import React, { Fragment } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableCell, TextField, IconButton, TableRow, MenuItem, ButtonGroup, Button, InputAdornment } from '@material-ui/core';
import { mdiCashMarker, mdiDelete, mdiPlusCircle } from '@mdi/js';
import Icon from '@mdi/react';
import { Formik, Field, FieldArray, Form } from 'formik';
import * as Yup from 'yup';

import { FormRow, FieldControl, tField, Loading } from '../../layout/components';

import { LoadingBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';

import { GET_SELECTED_COMPANY } from '../../graphql/companies';
import { GET_COMPANY_DELIVERY_AREAS, REMOVE_DELIVERY_AREA, MODIFY_DELIVERY_AREA } from '../../graphql/delivery_areas';

function Page () {
	setPageTitle('Configurações - Locais de entrega');

	// query load delivery_areas
	const { data: selectedCompanyData, loading: loadingSelectedData } = useQuery(GET_SELECTED_COMPANY);
	const {
		data: { company: { deliveryAreas: deliveryAreasInitial = [] } = {} } = {},
		loading: loadingDeliveryAreas
	} = useQuery(GET_COMPANY_DELIVERY_AREAS, { variables: { id: selectedCompanyData.selectedCompany } });

	// remove delivery_area
	const [removeDeliveryArea, { loading: loadingRemoveDeliveryArea }] = useMutation(REMOVE_DELIVERY_AREA, { refetchQueries: [{ query: GET_COMPANY_DELIVERY_AREAS, variables: { id: selectedCompanyData.selectedCompany } }] })

	// mutate delivery_area
	const [modifyDeliveryAreas, { loading: loadingModifyDeliveryAreas }] = useMutation(MODIFY_DELIVERY_AREA, { refetchQueries: [{ query: GET_COMPANY_DELIVERY_AREAS, variables: { id: selectedCompanyData.selectedCompany } }] })
	
	// still loading displays loading
	if (loadingSelectedData || loadingDeliveryAreas) return <LoadingBlock />;

	//form schema
	const areasSchema = Yup.object().shape({
		deliveryAreas: Yup.array().of(Yup.object().shape({
			name: Yup.string().required('Obrigatório'),
			type: Yup.string().required('Obrigatório'),
			zipcodeA: Yup.mixed().when('type', (type, schema)=> {
				if (type === 'joker')
					return schema.test('zipcode_test', 'Campo inválido', value=> /^([\d]+)$/.test(value) );

				return schema.test('zipcode_test', 'CEP inválido', value=> /^([\d]{5})-?([\d]{3})$/.test(value) )
			}),
			zipcodeB: Yup.mixed().when('type', (type, schema) => {
				if (type === 'set')
					return schema.required('Obrigatório').test('zipcode_test', 'CEP inválido', value=> /^([\d]{5})-?([\d]{3})$/.test(value) );
				
				return schema.notRequired();
			}),
			price: Yup.number().required('Obrigatório'),
		}))
	});

	const handleSave = ({ deliveryAreas }) => {
		const deliveryAreasSave = deliveryAreas.map(area=>({
			id: area.id || null,
			name: area.name,
			type: area.type,
			price: area.price,
			zipcodeA: area.zipcodeA,
			zipcodeB: area.zipcodeB || null,
		}))
		modifyDeliveryAreas({ variables: { data: deliveryAreasSave } });
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
			{({ values: { deliveryAreas }, handleChange, setFieldValue })=>{
				return (<Paper>
					<Form>
						<FieldArray name='deliveryAreas'>
							{({ insert, remove })=>(
								<Fragment>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell></TableCell>
												<TableCell>Nome</TableCell>
												<TableCell>Tipo</TableCell>
												<TableCell style={{ width: 240 }}>CEP</TableCell>
												<TableCell>Valor</TableCell>
												<TableCell></TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{deliveryAreas.map((area, index)=>
											{
												let placeholder = 'Digite o CEP';
												if (area.type === 'set') placeholder = 'CEP inicial';
												if (area.type === 'joker') placeholder = 'Números iniciais do CEP';

												return (
													<TableRow key={index}>
														<TableCell><Icon path={mdiCashMarker} color='#707070' size='18' /></TableCell>
														<TableCell><Field disabled={loadingRemoveDeliveryArea || loadingModifyDeliveryAreas} component={tField} name={`deliveryAreas.${index}.name`} inputProps={{ autocomplete: false }} /></TableCell>
														<TableCell>
															<TextField disabled={loadingRemoveDeliveryArea || loadingModifyDeliveryAreas} onChange={handleChange} name={`deliveryAreas.${index}.type`} value={area.type} select>
																<MenuItem value='single'>Simples</MenuItem>
																<MenuItem value='set'>Variação</MenuItem>
																<MenuItem value='joker'>Coringa</MenuItem>
															</TextField>
														</TableCell>
														<TableCell>
															<FieldControl style={{ margin: 0 }}>
																<Field
																	disabled={loadingRemoveDeliveryArea || loadingModifyDeliveryAreas}
																	component={tField} name={`deliveryAreas.${index}.zipcodeA`}
																	inputProps={{ placeholder }}
																/>
																{area.type === 'set' && <span style={{ marginLeft: 10 }}>
																	<Field
																		disabled={loadingRemoveDeliveryArea || loadingModifyDeliveryAreas}
																		component={tField} name={`deliveryAreas.${index}.zipcodeB`}
																		inputProps={{ placeholder: 'CEP final' }}
																	/>
																</span>}
															</FieldControl>
														</TableCell>
														<TableCell>
															<Field
																disabled={loadingRemoveDeliveryArea || loadingModifyDeliveryAreas}
																component={tField}
																type='number'
																name={`deliveryAreas.${index}.price`}
																InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
																inputProps={{ step: '0.01' }}
															/>
														</TableCell>
														<TableCell>
															{area.removing ?
																<Loading />
																:
																<IconButton
																	disabled={loadingRemoveDeliveryArea || loadingModifyDeliveryAreas}
																	onClick={()=>{
																		if (!area.id)
																			remove(index);
																		else {
																			setFieldValue(`deliveryAreas.${index}.removing`, true);
																			removeDeliveryArea({ variables: { id: area.id } });
																		}
																	}}
																>
																	<Icon path={mdiDelete} color='#707070' size='18' />
																</IconButton>}
														</TableCell>
													</TableRow>
												)})}
								
										</TableBody>
									</Table>
									<FormRow></FormRow>
									<FormRow>
										<FieldControl>
											<ButtonGroup disabled={loadingRemoveDeliveryArea || loadingModifyDeliveryAreas}>
												{/* <Button color='secondary'>Cancelar</Button> */}
												<Button
													variant="contained"
													color='secondary'
													onClick={()=>{insert(deliveryAreas.length, { name: '', type: 'single', zipcodeA: '', zipcodeB: '', price: 0 })}}
												>
													<Icon className='iconLeft' path={mdiPlusCircle} color='#fff' size='20' /> Adicionar
												</Button>
												<Button
													type='submit'
													variant="contained"
													color='secondary'
												>
											Salvar
												</Button>
											</ButtonGroup>
											{!!loadingModifyDeliveryAreas && <Loading />}
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