import React from 'react';

import { Table, TableBody, TableRow, TableCell, IconButton, Button, CircularProgress, TextField, FormHelperText } from '@material-ui/core';
import { mdiMinusCircle, mdiPlusCircle } from '@mdi/js';
import Icon from '@mdi/react';
import { Form, FieldArray } from 'formik';

import { FormRow, FieldControl } from '../../../layout/components';


export default function DeliveryHoursForm({ isSubmitting, values: { deliveryHours }, handleChange, setFieldValue, errors }) {
	const daysOfWeek = ['Domingo','Segunda','Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

	const handleCopyDay = (dayIndex) => () => {
		const hoursToCopy = deliveryHours[dayIndex];
	
		const newDeliveryHours = deliveryHours.map((h)=> ({ ...h, hours: hoursToCopy.hours }));

		setFieldValue('deliveryHours', newDeliveryHours);
	}

	return (
		<Form>
			<Table>
				<TableBody>
					{deliveryHours.map((day, dayIndex)=>(
						<FieldArray key={dayIndex} name={`deliveryHours.${dayIndex}.hours`}>
							{({ insert, remove })=>(
								<TableRow>
									<TableCell style={{ width: 70 }}>{daysOfWeek[day.dayOfWeek]}</TableCell>
									<TableCell>
										<div style={{ display: 'flex', justifyContent: 'flex-start' }}>
											{day.hours.map((hour, hourIndex)=>
												<div
													style={{
														marginRight: 3,
														textAlign: 'center'
													}}
													key={hourIndex}
												>
													<div
														style={{
															backgroundColor: '#333',
															padding: 5,
															borderRadius: 5,
															display: 'flex',
															alignItems: 'center',
														}}
													>
														
														<TextField
															disabled={isSubmitting}
															style={{ marginRight: 3, marginLeft: 5 }}
															name={`deliveryHours.${dayIndex}.hours.${hourIndex}.from`}
															value={deliveryHours[dayIndex].hours[hourIndex].from}
															type='time'
															fullwidth={false}
															onChange={handleChange}
														/>
														<TextField
															disabled={isSubmitting}
															style={{ marginRight: 3, marginLeft: 5 }}
															name={`deliveryHours.${dayIndex}.hours.${hourIndex}.to`}
															value={deliveryHours[dayIndex].hours[hourIndex].to}
															type='time'
															fullwidth={false}
															onChange={handleChange}
														/>
														<IconButton disabled={isSubmitting} onClick={()=>remove(hourIndex)}>
															<Icon path={mdiMinusCircle} color='#dd2020' size={1} />
														</IconButton>
													</div>
													{Boolean(
														errors?.deliveryHours?.[dayIndex]?.hours?.[hourIndex]?.from
														|| errors?.deliveryHours?.[dayIndex]?.hours?.[hourIndex]?.to)
														&& <FormHelperText error>{errors.deliveryHours[dayIndex].hours[hourIndex].from || errors.deliveryHours[dayIndex].hours[hourIndex].to}</FormHelperText>
													}
												</div>
											)}
										</div>
									</TableCell>
									<TableCell style={{ width: 20 }}>
										{day.hours.length < 2
											&& (
												<IconButton disabled={isSubmitting} onClick={()=>insert(1, { from: '', to: '' })}>
													<Icon path={mdiPlusCircle} color='#209055' size={1} />
												</IconButton>
											)}
									</TableCell>
									<TableCell style={{ width: 50 }}>
										<Button onClick={handleCopyDay(dayIndex)}>Copiar</Button>
									</TableCell>
								</TableRow>
							)}
						</FieldArray>
					))}
				</TableBody>
			</Table>
			<FormRow></FormRow>
			<FormRow>
				<FieldControl>
					{isSubmitting
						? <CircularProgress />
						: <Button color='primary' disabled={isSubmitting} type='submit' variant='contained'>Salvar</Button>}
				</FieldControl>
			</FormRow>
				
		</Form>
	);
}
