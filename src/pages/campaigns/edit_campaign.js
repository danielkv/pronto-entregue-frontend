import React, { useState, Fragment } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import { Formik } from 'formik';
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

function Page (props) {
	setPageTitle('Alterar campanha');

	const editId = props.match.params.id;

	//erro e confirmação
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	const { data, loading: loadingGetData, error } = useQuery(LOAD_CAMPAIGN, { variables: { id: editId, filter: { showInactive: true } } });
	const [updateCampaign, { error: savingError }] = useMutation(UPDATE_CAMPAIGN, {
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
				setDisplaySuccess('A campanha foi salva');
			})
	}

	return (
		<Fragment>
			<Snackbar
				open={!!savingError}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				<SnackbarContent className='error' message={!!savingError && getErrors(savingError)} />
			</Snackbar>
			<Snackbar
				open={!!displaySuccess}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				onClose={()=>{setDisplaySuccess('')}}
				autoHideDuration={4000}
			>
				<SnackbarContent className='success' message={!!displaySuccess && displaySuccess} />
			</Snackbar>
			<Formik
				validationSchema={validationSchema}
				initialValues={initialValues}
				onSubmit={onSubmit}
				validateOnChange={false}
				validateOnBlur={false}
				component={PageForm}
			/>
		</Fragment>
	)
}

export default Page;