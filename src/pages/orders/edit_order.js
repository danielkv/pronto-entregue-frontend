import React, {useState, useRef, Fragment} from 'react';
import PageForm from './form';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';

import { Formik } from 'formik';
import * as Yup from 'yup';

import {setPageTitle, sanitizeOrderData} from '../../utils';
import {LoadingBlock, ErrorBlock} from '../../layout/blocks';
import { LOAD_ORDER, UPDATE_ORDER } from '../../graphql/orders';

function Page (props) {
	setPageTitle('Alterar pedido');

	const edit_id = props.match.params.id;
	const formRef = useRef(null);

	//erro e confirmação
	const [displayError, setDisplayError] = useState('');
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	const {data, loading:loadingGetData, error} = useQuery(LOAD_ORDER, {variables:{id:edit_id}});
	const client = useApolloClient();

	if (error) return <ErrorBlock error={error} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	const order = {
		user: data.order.user,
		payment_fee: data.order.payment_fee,
		delivery_price: data.order.delivery_price,
		price: data.order.price,
		type: data.order.type,
		discount: data.order.discount,
		status: data.order.status,
		message: data.order.message,
		street: data.order.street,
		number: data.order.number || '',
		city: data.order.city,
		state: data.order.state,
		district: data.order.district,
		zipcode: data.order.zipcode,
		payment_method: data.order.payment_method,
		products: data.order.products.map(product=>{
			return {
				...product.product_related,

				id: product.id,
				price:product.price,
				name:product.name,
				action:'editable',
				product_related:{id: product.product_related.id},

				options_groups:product.product_related.options_groups.map(group=>{
					let order_group = product.options_groups.find(row=>row.options_group_related.id===group.id);
					let name = order_group ? order_group.name : group.name;
					let id = order_group ? order_group.id : group.id;

					let options = group.options.map(option=>{
						let order_option = order_group ? order_group.options.find(row=>row.option_related.id===option.id) : null;
						let name = order_option ? order_option.name : option.name;
						let selected = order_option ? true : false;
						let price = order_option ? order_option.price : option.price;
						let id = order_option ? order_option.id : option.id;
						return {...option, id, name, selected, price, action:'editable', option_related:{id: option.id}};
					})

					return {...group, id, options, name, action:'editable', group_related:{id: group.id}};
				}),
			}
		}),
	};

	function onSubmit(data, {setSubmitting}) {
		const saveData = sanitizeOrderData(data);

		client.mutate({mutation:UPDATE_ORDER, variables:{id:edit_id, data:saveData}})
		.then(()=>{
			setDisplaySuccess('O peido foi salvo');
		})
		.catch((err)=>{
			setDisplayError(err.message);
			console.error(err.graphQLErrors, err.networkError, err.operation);
		})
		.finally(() => {
			setSubmitting(false);
		})
	}

	const test_address = (type) => (value) => {
		if (formRef.current.state.values.type === 'takeout') 
			return Yup.mixed().notRequired();
		
		return (type === 'number') ? Yup.number().required('Obrigatório') : Yup.string().required('Obrigatório')
	}
	
	function test_zipcode_ok (value) {
		const state = formRef.current.state;

		if (state.values.type)
			return true;

		if (!state.values.zipcode && !state.errors.zipcode)
			return true;

		return !!value;
	}

	function test_zipcode (value) {
		if (formRef.current.state.values.type === 'takeout')
			return Yup.mixed().notRequired();

		return Yup.mixed().required('Obrigatório').test('zipcode_test', 'CEP inválido', value=> /^([\d]{5})-?([\d]{3})$/.test(value) );
			
	}

	const productSchema = Yup.object().shape({
		status : Yup.string().required('Obrigatório'),
		user: Yup.object().typeError('O pedido não tem um cliente selecionado'),
		message: Yup.string().notRequired(),
		type: Yup.string().required('Obrigatório'),
		payment_method: Yup.string().typeError('Obrigatório').required('Obrigatório'),

		street: Yup.lazy(test_address('string')),
		number: Yup.lazy(test_address('number')),
		city: Yup.lazy(test_address('string')),
		state: Yup.lazy(test_address('string')),
		district: Yup.lazy(test_address('string')),
		
		zipcode: Yup.lazy(test_zipcode),
		zipcode_ok: Yup.mixed().test('zipcode_not_found', 'Não há entregas para essa área', test_zipcode_ok),

		products: Yup.array().min(1, 'O pedido não tem produtos'),
		delivery_price: Yup.number().typeError('Digite um número').required('Obrigatório'),
		discount: Yup.number().typeError('Digite um número').required('Obrigatório')
	});

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
				ref={formRef}
				validationSchema={productSchema}
				initialValues={order}
				onSubmit={onSubmit}
				validateOnChange={true}
				validateOnBlur={false}
				component={PageForm}
				/>
		</Fragment>
	)
}

export default Page;