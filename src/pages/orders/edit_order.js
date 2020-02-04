import React, { useState, Fragment } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { sanitizeOrder, extractOrder } from '../../utils/orders';
import PageForm from './form';

import { LOAD_ORDER, UPDATE_ORDER } from '../../graphql/orders';

function Page (props) {
	setPageTitle('Alterar pedido');

	const editId = props.match.params.id;

	//erro e confirmação
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	const { data, loading: loadingGetData, error } = useQuery(LOAD_ORDER, { variables: { id: editId } });
	const [updateOrder, { error: errorSaving }] = useMutation(UPDATE_ORDER, { variables: { id: editId } });

	if (error) return <ErrorBlock error={getErrors(error)} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	// extract order data from DB
	const order = extractOrder(data.order);

	function onSubmit(result) {
		const data = sanitizeOrder(result);

		return updateOrder({ variables: {  data } })
			.then(() => {
				setDisplaySuccess('O pedido foi salvo');
			})
	}

	const checkAddress = (_type) => (type) => {
		if (type === 'takeout')
			return Yup.mixed().notRequired();
		
		return (_type === 'number') ? Yup.number().required('Há algo de errado com o endereço') : Yup.string().required('Há algo de errado com o endereço')
	}
	
	function checkZipcodeOk (value) {
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
		status: Yup.string().required('O status é obrigatório'),
		user: Yup.object().typeError('O pedido não tem um cliente selecionado'),
		message: Yup.string().notRequired(),
		type: Yup.string().required('Selecione como o pedido será retirado'),
		paymentMethod: Yup.string().typeError('O Método de pagamento é obrigatório').required('O Método de pagamento é obrigatório'),

		street: Yup.mixed().when('type', checkAddress('string')),
		number: Yup.mixed().when('type', checkAddress('number')),
		city: Yup.mixed().when('type', checkAddress('string')),
		state: Yup.mixed().when('type', checkAddress('string')),
		district: Yup.mixed().when('type', checkAddress('string')),

		zipcode: Yup.mixed().test('checkZipcode', 'Obrigatório', checkZipcode),
		zipcodeOk: Yup.mixed().test('zipcode_not_found', 'Não há entregas para essa área', checkZipcodeOk),

		products: Yup.array().min(1, 'O pedido não tem produtos'),
		deliveryPrice: Yup.number().typeError('Digite um número').required('Obrigatório'),
		discount: Yup.number().typeError('Digite um número').required('Obrigatório')
	});

	return (
		<Fragment>
			<Snackbar
				open={!!errorSaving}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				<SnackbarContent className='error' message={!!errorSaving && getErrors(errorSaving)} />
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
				validateOnChange={false}
				validateOnBlur={false}
				component={PageForm}
			/>
		</Fragment>
	)
}

export default Page;