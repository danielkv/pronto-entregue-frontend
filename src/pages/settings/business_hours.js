import React, { Fragment } from 'react';
import { Paper, Table, TableBody, TableCell, IconButton, TableRow, Button } from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiMinusCircle, mdiPlusCircle} from '@mdi/js';
import {tField, FormRow, FieldControl, Loading} from '../../layout/components';
import {useQuery, useMutation} from '@apollo/react-hooks';

import {Form, Field, FieldArray, Formik} from 'formik';

import {setPageTitle} from '../../utils';
import { LOAD_BUSINESS_HOURS, UPDATE_BUSINESS_HOURS } from '../../graphql/business_hours';
import { GET_SELECTED_BRANCH } from '../../graphql/branches';
import { LoadingBlock } from '../../layout/blocks';

function Page () {
	setPageTitle('Configurações - Horário de atendimento');

	//Carrega horas de trabalho
	const {data:selectedBranchData, loading:loadingSelectedData} = useQuery(GET_SELECTED_BRANCH);
	const {data: businessHoursData, loading: loadingBusinessHours} = useQuery(LOAD_BUSINESS_HOURS, {variables:{id:selectedBranchData.selectedBranch}});

	//Mutate business_hour
	const [updateBusinessHours, {loading: loadingUpdateBusinessHours}] = useMutation(UPDATE_BUSINESS_HOURS, {
		refetchQueries: [{ query: LOAD_BUSINESS_HOURS,variables: { id:selectedBranchData.selectedBranch } }]
	});

	if (loadingSelectedData || loadingBusinessHours || !businessHoursData) return <LoadingBlock />;

	const onSubmit = ({business_hours}) => {
		const dataSave = business_hours.map(day=>{
			delete day.__typename;
			day.hours = day.hours.map(hour=>{
				delete hour.__typename;
				return hour;
			})
			return day;
		})
		return updateBusinessHours({variables:{data:dataSave}});
	}

	const business_hours = businessHoursData.branch.business_hours || [];
	
	return (
		<Paper>
			<Formik
				onSubmit={onSubmit}
				initialValues={{business_hours}}
				>
				{({values:{business_hours}, setFieldValue, handleChange}) =>
				(<Form><Table>
					<TableBody>
						{business_hours.map((day, dayIndex)=>(
							<FieldArray key={dayIndex} name={`business_hours.${dayIndex}.hours`}>
							{({insert, remove})=>(
								<TableRow>
									<TableCell style={{width:190}}>{day.day_of_week}</TableCell>
									<TableCell>
										{day.hours.map((hour, hourIndex)=>
											<Fragment key={hourIndex}>
												<Field component={tField} controlDisabled={loadingUpdateBusinessHours} name={`business_hours.${dayIndex}.hours.${hourIndex}.from`} style={{margin:'0 7px'}} fullWidth={false} type='time' />
												<Field component={tField} controlDisabled={loadingUpdateBusinessHours} name={`business_hours.${dayIndex}.hours.${hourIndex}.to`} style={{margin:'0 7px'}} fullWidth={false} type='time' />
											</Fragment>
										)}
									</TableCell>
									<TableCell style={{width:100}}>
										{day.hours.length<2 &&
										<IconButton disabled={loadingUpdateBusinessHours} onClick={()=>insert(1, {from:'', to:''})}>
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
						{!!loadingUpdateBusinessHours && <Loading />}
					</FieldControl>
				</FormRow>
				
				</Form>)}
			</Formik>
		</Paper>
	)
}

export default Page;