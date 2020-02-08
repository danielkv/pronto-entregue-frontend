import React from 'react';

import { useMutation, useQuery } from '@apollo/react-hooks';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useSelectedCompany } from '../../controller/hooks';
import { ErrorBlock, LoadingBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { sanitizeOrder, createEmptyOrder, checkDelivery, checkAddress } from '../../utils/orders';
import PageForm from './form';

import { LOAD_COMPANY } from '../../graphql/companies';
import { CREATE_ORDER, GET_COMPANY_ORDERS } from '../../graphql/orders';

function Page (props) {
	setPageTitle('Novo pedido');

	const selectedCompany = useSelectedCompany();
	const { data: { company: { acceptTakeout = false } = {} } = {}, loading: loadingCompany } = useQuery(LOAD_COMPANY, { variables: { id: selectedCompany } });
	const [createOrder, { error: errorSaving }] = useMutation(CREATE_ORDER, { refetchQueries: [{ query: GET_COMPANY_ORDERS, variables: { id: selectedCompany } }] })

	const order = createEmptyOrder({ type: acceptTakeout === false ? 'delivery' : '' });

	function onSubmit(data) {
		const dataSave = sanitizeOrder(data);

		return createOrder({ variables: { data: dataSave } })
			.then(({ data: { createOrder } })=>{
				props.history.push(`/pedidos/alterar/${createOrder.id}`);
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

		deliveryOk: Yup.mixed().test('location_not_found', 'Endereço - Não há entregas para essa localização', checkDelivery),

		products: Yup.array().min(1, 'O pedido não tem produtos'),
		deliveryPrice: Yup.number().typeError('Digite um número').required('O valor do desconto é obrigatório (pode ser 0)'),
		discount: Yup.number().typeError('Digite um número').required('O desconto é obrigatório (pode ser 0)')
	});

	if (loadingCompany) return <LoadingBlock />
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