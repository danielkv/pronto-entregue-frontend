import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { sanitizeCategory, extractCategory } from '../../utils/categories';
import { getErrors } from '../../utils/error';
import PageForm from './form';

import { UPDATE_CATEGORY, LOAD_CATEGORY } from '../../graphql/categories';

const FILE_SIZE = 3000 * 1024;

const validationSchema = Yup.object().shape({
	name: Yup.string().required('O nome é obrigatório'),
	description: Yup.string().notRequired(),
	file: Yup.mixed().notRequired()
		.test('fileSize', 'A imagem é muito grande. Máximo 5MB', value => !value || value.size <= FILE_SIZE),
});

function Page () {
	setPageTitle('Alterar categoria');

	const { id: editId } = useParams();
	const { enqueueSnackbar } = useSnackbar();

	//erro e confirmação
	
	const { data, loading: loadingGetData, error } = useQuery(LOAD_CATEGORY, { variables: { id: editId } });
	const [updateCategory] = useMutation(UPDATE_CATEGORY, { variables: { id: editId } })

	if (error) return <ErrorBlock error={getErrors(error)} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	// extract category data coming from DB
	const initialValues = extractCategory(data.category);

	function onSubmit(result) {
		const data = sanitizeCategory(result);

		return updateCategory({ variables: { data } })
			.then(()=>{
				enqueueSnackbar('A categoria foi alterada com sucesso', { variant: 'success' });
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
		>
			{(props)=><PageForm {...props} pageTitle='Alterar categoria' />}
		</Formik>
	)
}

export default Page;