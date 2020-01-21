import React from 'react';

import { useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useSelectedCompany } from '../../controller/hooks';
import { ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { sanitizeOrderData } from '../../utils/orders';
import PageForm from './form';

import { CREATE_ORDER, GET_COMPANY_ORDERS } from '../../graphql/orders';

function Page (props) {
	setPageTitle('Novo pedido');

	const selectedCompany = useSelectedCompany();
	const [createOrder, { error: errorSaving }] = useMutation(CREATE_ORDER, { refetchQueries: [{ query: GET_COMPANY_ORDERS, variables: { id: selectedCompany } }] })

	const order = {
		user: null,
		paymentFee: 0,
		deliveryPrice: 0,
		price: 0,
		type: '',
		discount: 0,
		status: 'waiting',
		message: '',
		street: '',
		number: '',
		complement: '',
		city: '',
		state: '',
		district: '',
		zipcode: '',
		products: [],
		paymentMethod: null,
		zipcodeOk: false,
	};

	function onSubmit(data) {
		const dataSave = sanitizeOrderData(data);

		return createOrder({ variables: { data: dataSave } })
			.then(({ data: { createOrder } })=>{
				props.history.push(`/pedidos/alterar/${createOrder.id}`);
			})
	}

	
	const checkAddress = (_type) => (type) => {
		if (type === 'takeout')
			return Yup.mixed().notRequired();
		
		return (_type === 'number') ? Yup.number().required('Obrigatório') : Yup.string().required('Obrigatório')
	}
	
	function chackZipcodeOk (value) {
		const { type } = this.parent

		//console.log(type, zipcode, value);

		if (type === 'takeout') return true;

		return value;
	}

	function checkZipcode () {
		if (this.parent.type === 'takeout')
			return Yup.mixed().notRequired();

		return Yup.mixed().required('Obrigatório').test('zipcode_test', 'CEP inválido', value=> /^([\d]{5})-?([\d]{3})$/.test(value) );
	}

	const productSchema = Yup.object().shape({
		status: Yup.string().required('Obrigatório'),
		user: Yup.object().typeError('O pedido não tem um cliente selecionado'),
		message: Yup.string().notRequired(),
		type: Yup.string().required('Obrigatório'),
		paymentMethod: Yup.string().typeError('Obrigatório').required('Obrigatório'),

		street: Yup.mixed().when('type', checkAddress('string')),
		number: Yup.mixed().when('type', checkAddress('number')),
		city: Yup.mixed().when('type', checkAddress('string')),
		state: Yup.mixed().when('type', checkAddress('string')),
		district: Yup.mixed().when('type', checkAddress('string')),

		zipcode: Yup.mixed().test({ test: checkZipcode }),
		zipcodeOk: Yup.mixed().test('zipcode_not_found', 'Não há entregas para essa área', chackZipcodeOk),

		products: Yup.array().min(1, 'O pedido não tem produtos'),
		deliveryPrice: Yup.number().typeError('Digite um número').required('Obrigatório'),
		discount: Yup.number().typeError('Digite um número').required('Obrigatório')
	});

	if (errorSaving) return <ErrorBlock error={getErrors(errorSaving)} />

	return (
		<Formik
			validationSchema={productSchema}
			initialValues={order}
			onSubmit={onSubmit}
			validateOnChange={false}
			validateOnBlur={false}
			component={PageForm}
		/>
	)
}

export default Page;