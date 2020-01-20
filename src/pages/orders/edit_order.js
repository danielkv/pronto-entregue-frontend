import React, { useState, Fragment } from 'react';

import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { sanitizeOrderData } from '../../utils/orders';
import PageForm from './form';

import { LOAD_ORDER, UPDATE_ORDER } from '../../graphql/orders';

function Page (props) {
	setPageTitle('Alterar pedido');

	const editId = props.match.params.id;

	//erro e confirmação
	const [displayError, setDisplayError] = useState('');
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	const { data, loading: loadingGetData, error } = useQuery(LOAD_ORDER, { variables: { id: editId } });
	const client = useApolloClient();

	if (error) return <ErrorBlock error={getErrors(error)} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	const order = {
		user: data.order.user,
		paymentFee: data.order.paymentFee,
		deliveryPrice: data.order.deliveryPrice,
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
		paymentMethod: data.order.paymentMethod,
		products: data.order.products.map(product=>{
			return {
				...product.productRelated,

				id: product.id,
				price: product.price,
				name: product.name,
				quantity: product.quantity,
				action: 'editable',
				productRelated: { id: product.productRelated.id },

				optionsGroups: product.productRelated.optionsGroups.map(group=>{
					let orderGroup = product.optionsGroups.find(row=>row.optionsGroupRelated.id===group.id);
					let name = orderGroup ? orderGroup.name : group.name;
					let id = orderGroup ? orderGroup.id : group.id;

					let options = group.options.map(option=>{
						let orderOption = orderGroup ? orderGroup.options.find(row=>row.optionRelated.id===option.id) : null;
						let name = orderOption ? orderOption.name : option.name;
						let selected = orderOption ? true : false;
						let price = orderOption ? orderOption.price : option.price;
						let id = orderOption ? orderOption.id : option.id;
						return { ...option, id, name, selected, price, action: 'editable', optionRelated: { id: option.id } };
					})

					return { ...group, id, options, name, action: 'editable', groupRelated: { id: group.id } };
				}),
			}
		}),
	};

	function onSubmit(data, { setSubmitting }) {
		const saveData = sanitizeOrderData(data);
		console.log(saveData);

		client.mutate({ mutation: UPDATE_ORDER, variables: { id: editId, data: saveData } })
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

	const checkAddress = (_type) => (type) => {
		if (type === 'takeout')
			return Yup.mixed().notRequired();
		
		return (_type === 'number') ? Yup.number().required('Obrigatório') : Yup.string().required('Obrigatório')
	}
	
	function chackZipcode (value) {
		const { type, zipcode } = this.parent

		if (type)
			return true;

		if (zipcode) return true;

		return !!value;
	}

	function checkZipcode (value) {
		if (this.parent.type === 'takeout')
			return true;

		return  /^([\d]{5})-?([\d]{3})$/.test(value);
			
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

		zipcode: Yup.mixed().test('checkZipcode', 'Obrigatório', checkZipcode),
		zipcodeOk: Yup.mixed().test('zipcode_not_found', 'Não há entregas para essa área', chackZipcode),

		products: Yup.array().min(1, 'O pedido não tem produtos'),
		deliveryPrice: Yup.number().typeError('Digite um número').required('Obrigatório'),
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