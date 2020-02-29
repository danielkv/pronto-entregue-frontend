import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { sanitizeProduct, extractProduct } from '../../utils/products';
import { extractSale } from '../../utils/sale';
import PageForm from './form';

import { LOAD_PRODUCT, UPDATE_PRODUCT } from '../../graphql/products';

const FILE_SIZE = 500 * 1024;



function Page () {
	const productSchema = Yup.object().shape({
		name: Yup.string().required('O nome é obrigatório'),
		price: Yup.number().required('O preço é obrigatório (pode ser 0)'),
		description: Yup.string().required('A descrição é obrigatória'),
		file: Yup.mixed().notRequired()
			.test('fileSize', 'A imagem é muito grande. Máximo 500kb', value => !value || value.size <= FILE_SIZE),
		optionsGroups: Yup.array().of(Yup.object().shape({
			name: Yup.string().required('O nome do grupo é obrigatório'),
			options: Yup.array().of(Yup.object().shape({
				name: Yup.string().required('O nome da opção é obrigatório'),
				price: Yup.number().required('O valor da opção obrigatório (pode ser 0)'),
			})),
		}))
	});


	setPageTitle('Alterar produto');

	const { id: editId } = useParams();
	const { enqueueSnackbar } = useSnackbar();
	
	const { data, loading: loadingGetData, error } = useQuery(LOAD_PRODUCT, { variables: { id: editId, filter: { showInactive: true } } });
	const [updateProduct] = useMutation(UPDATE_PRODUCT, {
		variables: { id: editId },
		refetchQueries: [{ query: LOAD_PRODUCT, variables: { id: editId, filter: { showInactive: true } } }]
	});

	if (error) return <ErrorBlock error={getErrors(error)} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	const initialValues = extractProduct(data.product);

	function onSubmit(data, { setFieldValue }) {
		const saveData = sanitizeProduct(data);

		return updateProduct({ variables: { data: saveData } })
			.then(({ data: { updateProduct: product } })=>{
				enqueueSnackbar('O produto foi alterado com sucesso', { variant: 'success' });

				if (product.sale) {
					const sale = extractSale(product.sale);
					setFieldValue('sale', sale);
				}
			})
			.catch((err)=>{
				enqueueSnackbar(getErrors(err), { variant: 'error' });
			})
	}

	return (
		<Formik
			validationSchema={productSchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={false}
			validateOnBlur={false}
			component={PageForm}
		/>
	)
}

export default Page;