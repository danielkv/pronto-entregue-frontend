import React from 'react'

import { useQuery } from '@apollo/react-hooks';
import DateFnsUtils from '@date-io/date-fns';
import { FormControlLabel, Switch } from '@material-ui/core';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import brLocale from 'date-fns/locale/pt-BR';
import { useFormikContext } from 'formik';
import moment from 'moment';

import { FieldControl } from '../../../layout/components';

import { useSelectedCompany } from '../../../controller/hooks';
import { LoadingBlock } from '../../../layout/blocks';

import { GET_COMPANY_CONFIG } from '../../../graphql/companies';

export default function OrderScheduler() {

	const { isSubmitting, errors, setFieldValue, values: { scheduledTo, scheduledToEnabled } } = useFormikContext();

	const selectedCompany = useSelectedCompany();
	const {
		data: { getCompanyConfig: { deliveryHours=null, deliveryHoursEnabled=false, businessHours=[] } = {} } = {},
		loading: loadingDeliveryHours
	} = useQuery(GET_COMPANY_CONFIG, { variables: { companyId: selectedCompany, keys: ['deliveryHours', 'deliveryHoursEnabled', 'businessHours'] } });

	if (loadingDeliveryHours) return <LoadingBlock />

	const weekHours = deliveryHoursEnabled ? deliveryHours : businessHours;

	return (
		<div style={{ width: '100%' }}>
			<FieldControl style={{ justifyContent: 'flex-end', marginRight: 5, marginBottom: 12 }}>
				<FormControlLabel
					labelPlacement='start'
					control={
						<Switch size='small' color='primary' checked={scheduledToEnabled} onChange={()=>{setFieldValue('scheduledToEnabled', !scheduledToEnabled)}} value="includeDisabled" />
					}
					label="Habilitar agendamento"
				/>
			</FieldControl>
			<MuiPickersUtilsProvider utils={DateFnsUtils} locale={brLocale}>
				<DateTimePicker
					ampm={false}
					disablePast
					disabled={isSubmitting || !scheduledToEnabled}
					hideTabs
					format='dd/MM/yyyy HH:mm'
					label="Agendar para"
					value={scheduledTo}
					shouldDisableDate={(dayInstance)=>{
						const day = moment(dayInstance)
						const dayOfWeek = day.format('d');
						if (weekHours[dayOfWeek].hours.length) return false;
					
						return true;
					}}
					onChange={(date)=>setFieldValue('scheduledTo', date)}
					error={errors.scheduledTo && !!errors.scheduledTo}
					helperText={!!errors.scheduledTo && errors.scheduledTo}
				/>
			</MuiPickersUtilsProvider>
		</div>
	)
}
