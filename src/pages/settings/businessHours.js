import React, { Fragment } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableCell, IconButton, TableRow, Button, CircularProgress } from '@material-ui/core';
import { mdiMinusCircle, mdiPlusCircle } from '@mdi/js';
import Icon from '@mdi/react';
import { Form, Field, FieldArray, Formik } from 'formik';

import { tField, FormRow, FieldControl } from '../../layout/components';

import { useSelectedCompany } from '../../controller/hooks';
import { LoadingBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';

import { LOAD_BUSINESS_HOURS, UPDATE_BUSINESS_HOURS } from '../../graphql/businessHours';

function Page () {
	setPageTitle('Configurações - Horário de atendimento');

	//Carrega horas de trabalho
	const selectedCompany = useSelectedCompany();
	const {
		data: { company: { businessHours = [] } = {} } = {},
		loading: loadingBusinessHours
	} = useQuery(LOAD_BUSINESS_HOURS, { variables: { id: selectedCompany } });

	// mutate business_hour
	const [updateBusinessHours, { loading: loadingUpdateBusinessHours }] = useMutation(UPDATE_BUSINESS_HOURS, {
		refetchQueries: [{ query: LOAD_BUSINESS_HOURS, variables: { id: selectedCompany } }]
	});

	const onSubmit = ({ businessHours }) => {
		const dataSave = businessHours.map(day=>{
			delete day.__typename;
			day.hours = day.hours.map(hour=>{
				delete hour.__typename;
				return hour;
			})
			return day;
		})
		return updateBusinessHours({ variables: { data: dataSave } });
	}
	
	if (loadingBusinessHours) return <LoadingBlock />;

	return (
		<Paper>
			<Formik
				onSubmit={onSubmit}
				initialValues={{ businessHours }}
			>
				{({ values: { businessHours } }) =>
					(<Form><Table>
						<TableBody>
							{businessHours.map((day, dayIndex)=>(
								<FieldArray key={dayIndex} name={`businessHours.${dayIndex}.hours`}>
									{({ insert, remove })=>(
										<TableRow>
											<TableCell style={{ width: 190 }}>{day.dayOfWeek}</TableCell>
											<TableCell>
												{day.hours.map((hour, hourIndex)=>
													<Fragment key={hourIndex}>
														<Field component={tField} disabled={loadingUpdateBusinessHours} name={`businessHours.${dayIndex}.hours.${hourIndex}.from`} style={{ margin: '0 7px' }} fullWidth={false} type='time' />
														<Field component={tField} disabled={loadingUpdateBusinessHours} name={`businessHours.${dayIndex}.hours.${hourIndex}.to`} style={{ margin: '0 7px' }} fullWidth={false} type='time' />
													</Fragment>
												)}
											</TableCell>
											<TableCell style={{ width: 100 }}>
												{day.hours.length<2 &&
										<IconButton disabled={loadingUpdateBusinessHours} onClick={()=>insert(1, { from: '', to: '' })}>
											<Icon path={mdiPlusCircle} color='#209055' size='18' />
										</IconButton>}
												{day.hours.length>1 &&
										<IconButton disabled={loadingUpdateBusinessHours} onClick={()=>remove(1)}>
											<Icon path={mdiMinusCircle} color='#dd2020' size='18' />
										</IconButton>}
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
							<Button color='secondary' disabled={loadingUpdateBusinessHours} type='submit' variant='contained'>Salvar</Button>
							{!!loadingUpdateBusinessHours && <CircularProgress />}
						</FieldControl>
					</FormRow>
				
					</Form>)}
			</Formik>
		</Paper>
	)
}

export default Page;