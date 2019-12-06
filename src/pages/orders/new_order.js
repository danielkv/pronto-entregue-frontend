import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';

import { Formik } from 'formik';
import * as Yup from 'yup';

import PageForm from './form';
import {setPageTitle, sanitizeOrderData} from '../../utils';
import { GET_SELECTED_BRANCH } from '../../graphql/branches';
import { CREATE_ORDER, GET_BANCH_ORDERS } from '../../graphql/orders';

function Page (props) {
	setPageTitle('Novo pedido');
	
	const client = useApolloClient();

	const order = {
		user:null,
		payment_fee:0,
		delivery_price:0,
		price:0,
		type:'',
		discount:0,
		status:'waiting',
		message:'',
		street:'',
		number:'',
		complement:'',
		city:'',
		state:'',
		district:'',
		zipcode:'',
		products:[],
		payment_method:null,
		zipcode_ok: false,
	};

	function onSubmit(data, {setSubmitting}) {
		const dataSave = sanitizeOrderData(data);

		const {selectedBranch} = client.readQuery({query:GET_SELECTED_BRANCH});

		client.mutate({mutation:CREATE_ORDER, variables:{data:dataSave} , refetchQueries:[{query:GET_BANCH_ORDERS, variables:{id:selectedBranch}}] })
		.then(({data:{createOrder}})=>{
			props.history.push(`/pedidos/alterar/${createOrder.id}`);
		})
		.catch((err)=>{
			console.error(err);
		})
		.finally(()=>{
			setSubmitting(false);
		})
	}

	
	const test_address = (_type) => (type) => {
		if (type === 'takeout') 
			return Yup.mixed().notRequired();
		
		return (_type === 'number') ? Yup.number().required('Obrigatório') : Yup.string().required('Obrigatório')
	}
	
	function test_zipcode_ok (value) {
		const { type, zipcode } = this.parent

		if (type)
			return true;

		if (zipcode) return true;

		return !!value;
	}

	function test_zipcode (value) {
		if (this.parent.type === 'takeout')
			return Yup.mixed().notRequired();

		return Yup.mixed().required('Obrigatório').test('zipcode_test', 'CEP inválido', value=> /^([\d]{5})-?([\d]{3})$/.test(value) );
			
	}

	const productSchema = Yup.object().shape({
		status : Yup.string().required('Obrigatório'),
		user: Yup.object().typeError('O pedido não tem um cliente selecionado'),
		message: Yup.string().notRequired(),
		type: Yup.string().required('Obrigatório'),
		payment_method: Yup.string().typeError('Obrigatório').required('Obrigatório'),

		street: Yup.mixed().when('type', test_address('string')),
		number: Yup.mixed().when('type', test_address('number')),
		city: Yup.mixed().when('type', test_address('string')),
		state: Yup.mixed().when('type', test_address('string')),
		district: Yup.mixed().when('type', test_address('string')),

		zipcode: Yup.mixed().test({test: test_zipcode}),
		zipcode_ok: Yup.mixed().test('zipcode_not_found', 'Não há entregas para essa área', test_zipcode_ok),

		products: Yup.array().min(1, 'O pedido não tem produtos'),
		delivery_price: Yup.number().typeError('Digite um número').required('Obrigatório'),
		discount: Yup.number().typeError('Digite um número').required('Obrigatório')
	});

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