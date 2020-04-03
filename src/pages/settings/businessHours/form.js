import React, { Fragment } from 'react';

import { Table, TableBody, TableRow, TableCell, IconButton, Button, CircularProgress } from '@material-ui/core';
import { mdiMinusCircle, mdiPlusCircle } from '@mdi/js';
import Icon from '@mdi/react';
import { Form, FieldArray, Field } from 'formik';

import { tField, FormRow, FieldControl } from '../../../layout/components';


export default function BusinessHoursForm({ isSubmiting, values: { businessHours }, setFieldValue }) {

	const handleCopyDay = (dayIndex) => () => {
		const hoursToCopy = businessHours[dayIndex];
	
		const newBusinessHours = businessHours.map(()=>hoursToCopy);

		setFieldValue('businessHours', newBusinessHours);
	}

	return (
		<Form>
			<Table>
				<TableBody>
					{businessHours.map((day, dayIndex)=>(
						<FieldArray key={dayIndex} name={`businessHours.${dayIndex}.hours`}>
							{({ insert, remove })=>(
								<TableRow>
									<TableCell style={{ width: 100 }}>{day.dayOfWeek}</TableCell>
									<TableCell>
										{day.hours.map((hour, hourIndex)=>
											<Fragment key={hourIndex}>
												<Field component={tField} disabled={isSubmiting} name={`businessHours.${dayIndex}.hours.${hourIndex}.from`} style={{ margin: '0 7px' }} fullWidth={false} type='time' />
												<Field component={tField} disabled={isSubmiting} name={`businessHours.${dayIndex}.hours.${hourIndex}.to`} style={{ margin: '0 7px' }} fullWidth={false} type='time' />
											</Fragment>
										)}
									</TableCell>
									<TableCell style={{ width: 20 }}>
										{day.hours.length < 2
											&& (
												<IconButton disabled={isSubmiting} onClick={()=>insert(1, { from: '', to: '' })}>
													<Icon path={mdiPlusCircle} color='#209055' size={1} />
												</IconButton>
											)}
										{day.hours.length > 1
											&& (
												<IconButton disabled={isSubmiting} onClick={()=>remove(1)}>
													<Icon path={mdiMinusCircle} color='#dd2020' size={1} />
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
					<Button color='primary' disabled={isSubmiting} type='submit' variant='contained'>Salvar</Button>
					{!!isSubmiting && <CircularProgress />}
				</FieldControl>
			</FormRow>
				
		</Form>
	);
}
