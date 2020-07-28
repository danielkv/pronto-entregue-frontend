import React from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, FormControlLabel, Switch, Typography, Divider } from '@material-ui/core';
import { Formik } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import { useSelectedCompany } from '../../../controller/hooks';
import { LoadingBlock, ErrorBlock } from '../../../layout/blocks';
import { setPageTitle } from '../../../utils';
import { getErrors } from '../../../utils/error';
import DeliveryHoursForm from './form';

import { GET_COMPANY_CONFIG, SET_COMPANY_CONFIG } from '../../../graphql/companies';

const validationSchema = Yup.object().shape({
	deliveryHours: Yup.array().of(Yup.object().shape({
		hours: Yup.array().of(Yup.object().shape({
			from: Yup.string().required('Horário inicial obrigatório'),
			to: Yup.string().required('Horário final obrigatório'),
		}))
	}))
})

function Page () {
	setPageTitle('Configurações - Horários de entrega');
	const { enqueueSnackbar } = useSnackbar();

	//Carrega horas de trabalho
	const selectedCompany = useSelectedCompany();
	const {
		data: { companyConfig: { deliveryHours=[], deliveryHoursEnabled=false } = {} } = {},
		loading: loadingDeliveryHours,
		error
	} = useQuery(GET_COMPANY_CONFIG, { variables: { companyId: selectedCompany, keys: ['deliveryHours', 'deliveryHoursEnabled'] } });

	// mutate delivery_hours
	const [updateDeliveryHours] = useMutation(SET_COMPANY_CONFIG, {
		variables: { companyId: selectedCompany, key: 'deliveryHours', type: 'json' },
		//refetchQueries: [{ query: GET_COMPANY_CONFIG, variables: { companyId: selectedCompany, keys: ['deliveryHours'] } }]
	});

	// mutate delivery_hours_enabled
	const [updateDeliveryHoursEnabled, { loading: loadingUpdateDeliveryHoursEnabled }] = useMutation(SET_COMPANY_CONFIG, {
		variables: { companyId: selectedCompany, key: 'deliveryHoursEnabled', type: 'boolean' },
		refetchQueries: [{ query: GET_COMPANY_CONFIG, variables: { companyId: selectedCompany, keys: ['deliveryHours', 'deliveryHoursEnabled'] } }]
	});

	function handleUpdateDeliveryHours(e, newValue) {
		if (loadingUpdateDeliveryHoursEnabled) return;

		updateDeliveryHoursEnabled({ variables: { value: newValue } })
			.then(()=>enqueueSnackbar(newValue? 'Horários de entregas ativos' : 'Horários de entregas desativados', { variant: 'success' }))
			.catch((err)=>enqueueSnackbar(getErrors(err), { variant: 'error' }))
	}

	function onSubmit({ deliveryHours }) {
		return updateDeliveryHours({ variables: { value: deliveryHours } })
			.then(()=>enqueueSnackbar('Horários de entregas salvos', { variant: 'success' }))
			.catch((err)=>enqueueSnackbar(getErrors(err), { variant: 'error' }))
	}

	if (loadingDeliveryHours) return <LoadingBlock />;
	if (error) return <ErrorBlock erro={getErrors(error)} />

	return (
		<Paper>
			<div style={{ padding: 20 }}>
				<FormControlLabel
					labelPlacement='start'
					control={
						<Switch size='small' color='primary' checked={deliveryHoursEnabled} onChange={handleUpdateDeliveryHours} value="includeDisabled" />
					}
					label="Horários de entregas habilitado?"
				/>
			</div>
			<AnimatePresence>
				{deliveryHoursEnabled && <motion.div
					initial={{ height: 0 }}
					animate={{ height: 'auto' }}
					exit={{ height: 0 }}
					style={{ overflow: 'hidden' }}
				>
					
					<Typography variant='overline' style={{ fontWeight: 'bold', padding: 20 }}>Horários</Typography>
					<Divider />
					<Formik
						onSubmit={onSubmit}
						validationSchema={validationSchema}
						initialValues={{ deliveryHours }}
						component={DeliveryHoursForm}
					/>
				</motion.div>}
			</AnimatePresence>
		</Paper>
	)
}

export default Page;