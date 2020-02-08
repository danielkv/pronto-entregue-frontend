import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { extractCampaign, sanitizeCampaign } from '../../utils/campaign';
import { getErrors } from '../../utils/error';
import PageForm from './form';

import { LOAD_CAMPAIGN, UPDATE_CAMPAIGN } from '../../graphql/campaigns';

const FILE_SIZE = 500 * 1024;

const validationSchema = Yup.object().shape({
	name: Yup.string().required('O nome é obrigatório'),
	file: Yup.mixed().notRequired()
		.test('fileSize', 'A imagem é muito grande. Máximo 500kb', value => !value || value.size <= FILE_SIZE),
	description: Yup.string().required('A descrição é obrigatória'),
	value: Yup.number().required('O valor é obrigatório'),
});

function Page () {
	setPageTitle('Alterar campanha');

	const { id: editId } = useParams();
	const { enqueueSnackbar } = useSnackbar();
	
	const { data, loading: loadingGetData, error } = useQuery(LOAD_CAMPAIGN, { variables: { id: editId, filter: { showInactive: true } } });
	const [updateCampaign] = useMutation(UPDATE_CAMPAIGN, {
		variables: { id: editId },
		refetchQueries: [{ query: LOAD_CAMPAIGN, variables: { id: editId } }]
	});

	if (error) return <ErrorBlock error={getErrors(error)} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	const initialValues = extractCampaign(data.campaign);

	
	function onSubmit(data) {
		const saveData = sanitizeCampaign(data);

		return updateCampaign({ variables: { data: saveData } })
			.then(()=>{
				enqueueSnackbar('A campanha foi alterada com sucesso', { variant: 'success' });
			})
			.catch((err)=>{
				enqueueSnackbar(getErrors(err), { variant: 'error' });
			})
	}

	return (
		<Formik
			validationSchema={validationSchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={false}
			validateOnBlur={false}
			component={PageForm}
		/>
	)
}

export default Page;