import React from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Typography, Divider, Button, FormHelperText, CircularProgress } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { tField } from '../../layout/components';

import { useSelectedCompany } from '../../controller/hooks';
import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { extractMetas, sanitizeMetas } from '../../utils/metas';

import { GET_COMPANY_GENERAL_SETTINGS, UPDATE_COMPANY } from '../../graphql/companies';

const validationSchema = Yup.object().shape({
	deliveryTime: Yup.object().shape({
		value: Yup.number().required('Campo Obrigatório')
	})
})

function Page () {
	setPageTitle('Configurações - Formas de pagamento');

	const metaTypes = ['deliveryTime'];

	//carrega métodos pagamento ativos na filial
	const selectedCompany = useSelectedCompany();
	const {
		data: { company: { metas = [] } = {} }= {},
		loading: loadingMetas
	} = useQuery(GET_COMPANY_GENERAL_SETTINGS, { variables: { id: selectedCompany, keys: metaTypes } });

	const initialValues = extractMetas(metaTypes, metas);

	const [updateSettings, { loading: loadingUpdateSettings, error: updatingError }] = useMutation(UPDATE_COMPANY, { variables: { id: selectedCompany }, refetchQueries: [{ query: GET_COMPANY_GENERAL_SETTINGS, variables: { id: selectedCompany, keys: metaTypes } }] } );

	function onSubmit(result) {
		return updateSettings({ variables: { data: { metas: sanitizeMetas(metaTypes, result) } } })
	}

	if (updatingError) return <ErrorBlock error={getErrors(updatingError)} />;
	if (loadingMetas) return <LoadingBlock />;
	
	return (
		<Paper style={{ padding: 20 }}>
			<Formik
				enableReinitialize
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			>
				{({ isSubmitting, values }) => {
					console.log(values);
					return(
						<Form>
							<Typography>Configurações gerais</Typography>
							<Field type='number' component={tField} action='deliveryTime.action' label='Prazo de entrega' name='deliveryTime.value' />
							<FormHelperText>Tempo em minutos, incluindo a entrega.</FormHelperText>
							<Divider style={{ margin: '20px 0' }} />
							<Button variant='contained' color='secondary' type='submit' disabled={isSubmitting}>
								{loadingUpdateSettings
									? <CircularProgress />
									: 'Salvar'}
							</Button>
						</Form>
					)}}
			</Formik>
		</Paper>
	)
}

export default Page;