import React, { useState, Fragment } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { sanitizeOrder, extractOrder, checkAddress, checkDelivery } from '../../utils/orders';
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

	const productSchema = Yup.object().shape({
		status: Yup.string().required('O status é obrigatório'),
		user: Yup.object().typeError('O pedido não tem um cliente selecionado'),
		message: Yup.string().notRequired(),
		type: Yup.string().required('Selecione como o pedido será retirado'),
		paymentMethod: Yup.string().typeError('O Método de pagamento é obrigatório').required('O Método de pagamento é obrigatório'),

		address: Yup.object().shape({
			street: Yup.mixed().when('type', checkAddress('string', 'Endereço - Preencha o nome da rua')),
			number: Yup.mixed().when('type', checkAddress('number', 'Endereço - Preencha o número')),
			city: Yup.mixed().when('type', checkAddress('string', 'Endereço - Preencha a cidade')),
			state: Yup.mixed().when('type', checkAddress('string', 'Endereço - Preencha o estado')),
			district: Yup.mixed().when('type', checkAddress('string', 'Endereço - Preencha o bairro')),
			zipcode: Yup.mixed().when('type', checkAddress('number', 'Endereço - Preencha o CEP')),
			location: Yup.mixed().when('type', (type) => {
				if (type === 'takeout')
					return Yup.mixed().notRequired();
				else
					return Yup.array().of(Yup.string().required('Endereço - Você não setou a localização.')).min(2).max(2);
			}),
		}),

		deliveryOk: Yup.mixed().test('location_not_found', 'Não há entregas para essa localização', checkDelivery),

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