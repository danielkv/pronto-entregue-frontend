import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { sanitizeCategory, extractCategory } from '../../utils/categories';
import { getErrors } from '../../utils/error';
import PageForm from './form';

import { UPDATE_CATEGORY, LOAD_CATEGORY } from '../../graphql/categories';

const FILE_SIZE = 500 * 1024;

const validationSchema = Yup.object().shape({
	name: Yup.string().required('O nome é obrigatório'),
	description: Yup.string().required('A descrição é obrigatória'),
	file: Yup.mixed().notRequired()
		.test('fileSize', 'A imagem é muito grande. Máximo 500kb', value => !value || value.size <= FILE_SIZE),
});

function Page () {
	setPageTitle('Alterar categoria');

	const { id: editId } = useParams();

	//erro e confirmação
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	const { data, loading: loadingGetData, error } = useQuery(LOAD_CATEGORY, { variables: { id: editId } });
	const [updateCategory, { error: savingError }] = useMutation(UPDATE_CATEGORY, { variables: { id: editId } })

	if (error) return <ErrorBlock error={getErrors(error)} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	// extract category data coming from DB
	const initialValues = extractCategory(data.category);

	function onSubmit(result) {
		const data = sanitizeCategory(result);

		return updateCategory({ variables: { data } })
			.then(()=>{
				setDisplaySuccess('A categoria salva');
			})
	}

	return (
		<>
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
			>
				{(props)=><PageForm {...props} pageTitle='Alterar categoria' />}
			</Formik>
		</>
	)
}

export default Page;