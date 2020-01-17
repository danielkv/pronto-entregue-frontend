import React, { useState, Fragment } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle, sanitizeProductData } from '../../utils';
import { getErrors } from '../../utils/error';
import PageForm from './form';

import { LOAD_PRODUCT, UPDATE_PRODUCT } from '../../graphql/products';

const productSchema = Yup.object().shape({
	name: Yup.string().required('Obrigatório'),
	price: Yup.number().required('Obrigatório'),
	description: Yup.string().required('Obrigatório'),
	file: Yup.mixed().notRequired(),
	optionsGroups: Yup.array().of(Yup.object().shape({
		name: Yup.string().required('Obrigatório'),
		options: Yup.array().of(Yup.object().shape({
			name: Yup.string().required('Obrigatório'),
			price: Yup.number().required('Obrigatório'),
		})),
	})),
});

function Page (props) {
	setPageTitle('Alterar produto');

	const editId = props.match.params.id;

	//erro e confirmação
	const [displayError, setDisplayError] = useState('');
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	const { data, loading: loadingGetData, error } = useQuery(LOAD_PRODUCT, { variables: { id: editId, filter: { showInactive: true } } });
	const [updateProduct] = useMutation(UPDATE_PRODUCT, {
		variables: { id: editId },
		refetchQueries: [{ query: LOAD_PRODUCT, variables: { id: editId, filter: { showInactive: true } } }]
	});

	if (error) return <ErrorBlock error={getErrors(error)} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	const initialValues = {
		name: data.product.name,
		featured: data.product.featured,
		description: data.product.description,
		active: data.product.active,
		category: data.product.category,
		price: data.product.price,
		type: data.product.type,
		file: '',
		preview: data.product.image,
		optionsGroups: data.product.optionsGroups
	};

	function onSubmit(data) {
		const saveData = sanitizeProductData(data);

		return updateProduct({ variables: { data: saveData } })
			.then(()=>{
				setDisplaySuccess('O produto foi salvo');
			})
			.catch((err)=>{
				setDisplayError(err.message);
				console.error(err.graphQLErrors, err.networkError, err.operation);
			});

	}

	return (
		<Fragment>
			<Snackbar
				open={!!displayError}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				onClose={()=>{setDisplayError('')}}
				autoHideDuration={4000}
			>
				<SnackbarContent className='error' message={!!displayError && displayError} />
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
				validateOnChange={true}
				validateOnBlur={false}
				component={PageForm}
			/>
		</Fragment>
	)
}

export default Page;