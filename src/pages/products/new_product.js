import React from 'react';

import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { setPageTitle, sanitizeProductData } from '../../utils';
import PageForm from './form';

import { GET_SELECTED_COMPANY } from '../../graphql/branches';
import { CREATE_PRODUCT, GET_COMPANYES_PRODUCTS } from '../../graphql/products';

const FILE_SIZE = 500 * 1024;

const productSchema = Yup.object().shape({
	name: Yup.string().required('Obrigatório'),
	price: Yup.number().required('Obrigatório'),
	description: Yup.string().required('Obrigatório'),
	file: Yup.mixed().required('Selecione uma imagem')
		.test('fileSize', 'Essa imagem é muito grande. Máximo 500kb', value => value && value.size <= FILE_SIZE),
	optionsGroups: Yup.array().of(Yup.object().shape({
		name: Yup.string().required('Obrigatório'),
		options: Yup.array().of(Yup.object().shape({
			name: Yup.string().required('Obrigatório'),
			price: Yup.number().required('Obrigatório'),
		})),
	})),
});

function Page (props) {
	setPageTitle('Novo produto');

	const client = useApolloClient();
	const { selectedBranch } = client.readQuery({ query: GET_SELECTED_COMPANY });
	const [createProduct] = useMutation(CREATE_PRODUCT, { refetchQueries: [{ query: GET_COMPANYES_PRODUCTS, variables: { id: selectedBranch } }] });

	const initialValues = {
		name: '',
		description: '',
		active: true,
		type: 'inline',
		price: '',
		file: '',
		featured: false,
		preview: '',
		category: { id: '' },
		optionsGroups: []
	};

	function onSubmit(data) {
		const dataSave = sanitizeProductData(data);

		return createProduct({ variables: { data: dataSave } })
			.then(({ data: { createItem } })=>{
				props.history.push(`/estoque/alterar/${createItem.id}`);
			})
			.catch((err)=>{
				console.error(err);
			});
	}
	
	return (
		<Formik
			validationSchema={productSchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={true}
			validateOnBlur={false}
			component={PageForm}
		/>
	)
}

export default Page;