import React from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper } from '@material-ui/core';
import { Formik } from 'formik';

import { useSelectedCompany } from '../../../controller/hooks';
import { LoadingBlock } from '../../../layout/blocks';
import { setPageTitle } from '../../../utils';
import { sanitizeBusinessHours } from '../../../utils/settings';
import BusinessHoursForm from './form';

import { LOAD_BUSINESS_HOURS, UPDATE_BUSINESS_HOURS } from '../../../graphql/businessHours';

function Page () {
	setPageTitle('Configurações - Horário de atendimento');

	//Carrega horas de trabalho
	const selectedCompany = useSelectedCompany();
	const {
		data: { company: { businessHours = [] } = {} } = {},
		loading: loadingBusinessHours
	} = useQuery(LOAD_BUSINESS_HOURS, { variables: { id: selectedCompany } });

	// mutate business_hour
	const [updateBusinessHours] = useMutation(UPDATE_BUSINESS_HOURS, {
		refetchQueries: [{ query: LOAD_BUSINESS_HOURS, variables: { id: selectedCompany } }]
	});

	const onSubmit = ({ businessHours }) => {
		const dataSave = sanitizeBusinessHours(businessHours)
		return updateBusinessHours({ variables: { data: dataSave } });
	}

	if (loadingBusinessHours) return <LoadingBlock />;

	return (
		<Paper>
			<Formik
				onSubmit={onSubmit}
				initialValues={{ businessHours }}
				component={BusinessHoursForm}
			/>
		</Paper>
	)
}

export default Page;