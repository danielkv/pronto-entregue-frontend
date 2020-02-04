import React, { useState, Fragment } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { sanitizeProduct, extractProduct } from '../../utils/products';
import PageForm from './form';

import { LOAD_PRODUCT, UPDATE_PRODUCT } from '../../graphql/products';

const FILE_SIZE = 500 * 1024;

const productSchema = Yup.object().shape({
	name: Yup.string().required('O nome é obrigatório'),
	price: Yup.number().required('O preço é obrigatório (pode ser 0)'),
	description: Yup.string().required('A descrição é obrigatória'),
	file: Yup.mixed().notRequired()
		.test('fileSize', 'A imagem é muito grande. Máximo 500kb', value => value && value.size <= FILE_SIZE),
	optionsGroups: Yup.array().of(Yup.object().shape({
		name: Yup.string().required('O nome do grupo é obrigatório'),
		options: Yup.array().of(Yup.object().shape({
			name: Yup.string().required('O nome da opção é obrigatório'),
			price: Yup.number().required('O valor da opção obrigatório (pode ser 0)'),
		})),
	})),
});

function Page (props) {
	setPageTitle('Alterar produto');

	const editId = props.match.params.id;

	//erro e confirmação
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	const { data, loading: loadingGetData, error } = useQuery(LOAD_PRODUCT, { variables: { id: editId, filter: { showInactive: true } } });
	const [updateProduct, { error: savingError }] = useMutation(UPDATE_PRODUCT, {
		variables: { id: editId },
		refetchQueries: [{ query: LOAD_PRODUCT, variables: { id: editId, filter: { showInactive: true } } }]
	});

	if (error) return <ErrorBlock error={getErrors(error)} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	const initialValues = extractProduct(data.product);

	function onSubmit(data) {
		const saveData = sanitizeProduct(data);

		return updateProduct({ variables: { data: saveData } })
			.then(()=>{
				setDisplaySuccess('O produto foi salvo');
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
				validationSchema={productSchema}
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