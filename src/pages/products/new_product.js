import React from 'react';

import { useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import { useSelectedCompany } from '../../controller/hooks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { sanitizeProduct, createEmptyProduct } from '../../utils/products';
import PageForm from './form';

import { CREATE_PRODUCT, GET_COMPANY_PRODUCTS } from '../../graphql/products';

const FILE_SIZE = 3000 * 1024;

const productSchema = Yup.object().shape({
	name: Yup.string().required('O nome é obrigatório'),
	price: Yup.number().required('O preço é obrigatório (pode ser 0)'),
	fromPrice: Yup.number().moreThan(0, 'O campo "A partir de" será mostrado no app. Deve ser maior que 0').required('O campo "A partir de" é obrigatório'),
	description: Yup.string().required('A descrição é obrigatória'),
	file: Yup.mixed().required('Selecione uma imagem')
		.test('fileSize', 'A imagem é muito grande. Máximo 5MB', value => value && value.size <= FILE_SIZE),
	optionsGroups: Yup.array().of(Yup.object().shape({
		name: Yup.string().required('O nome do grupo é obrigatório'),
		options: Yup.array().of(Yup.object().shape({
			name: Yup.string().required('O nome da opção é obrigatório'),
			price: Yup.number().required('O valor da opção obrigatório (pode ser 0)'),
		})),
	})),
});

function Page ({ history, match: { url } }) {
	setPageTitle('Novo produto');
	const splitedUrl = url.substr(1).split('/')
	const prefixUrl = `/${splitedUrl[0]}/${splitedUrl[1]}`;

	const selectedCompany = useSelectedCompany();
	const [createProduct] = useMutation(CREATE_PRODUCT, { refetchQueries: [{ query: GET_COMPANY_PRODUCTS, variables: { id: selectedCompany } }] });

	const initialValues = createEmptyProduct();
	const { enqueueSnackbar } = useSnackbar();

	function onSubmit(data) {
		const dataSave = sanitizeProduct(data);

		return createProduct({ variables: { data: dataSave } })
			.then(({ data: { createProduct } })=>{
				enqueueSnackbar('O produto foi criado com sucesso', { variant: 'success' });
				history.push(`${prefixUrl}/alterar/${createProduct.id}`);
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