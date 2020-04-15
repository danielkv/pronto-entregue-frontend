import React from 'react';

import { useMutation, useQuery } from '@apollo/react-hooks';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import { useSelectedCompany } from '../../controller/hooks';
import { LoadingBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { sanitizeOrder, createEmptyOrder, checkDelivery } from '../../utils/orders';
import PageForm from './form';

import { LOAD_COMPANY } from '../../graphql/companies';
import { CREATE_ORDER, GET_COMPANY_ORDERS } from '../../graphql/orders';

const productSchema = Yup.object().shape({
	status: Yup.string().required('O status é obrigatório'),
	user: Yup.object().typeError('O pedido não tem um cliente selecionado'),
	message: Yup.string().notRequired(),
	type: Yup.string().required('Selecione como o pedido será retirado'),
	paymentMethod: Yup.string().typeError('O Método de pagamento é obrigatório').required('O Método de pagamento é obrigatório'),

	address: Yup.mixed().when('type', {
		is: 'delivery',
		otherwise: Yup.mixed().notRequired(),
		then: Yup.object().shape({
			street: Yup.string().required('Endereço - Preencha o nome da rua'),
			number: Yup.string().required('Endereço - Preencha o número'),
			city: Yup.string().required('Endereço - Preencha a cidade'),
			state: Yup.string().required('Endereço - Preencha o estado'),
			district: Yup.string().required('Endereço - Preencha o bairro'),
			zipcode: Yup.string().required('Endereço - Preencha o CEP'),
			location: Yup.array().of(Yup.string().required('Endereço - Você não setou a localização.')).min(2).max(2)
		})
	}),

	deliveryOk: Yup.mixed().test('location_not_found', 'Endereço - Não há entregas para essa localização', checkDelivery),

	products: Yup.array().min(1, 'O pedido não tem produtos'),
	deliveryPrice: Yup.number().typeError('Digite um número').required('O valor do desconto é obrigatório (pode ser 0)'),
	discount: Yup.number().typeError('Digite um número').required('O desconto é obrigatório (pode ser 0)')
});

function Page ({ history, match: { url } }) {
	setPageTitle('Novo pedido');
	const splitedUrl = url.substr(1).split('/')
	const prefixUrl = `/${splitedUrl[0]}/${splitedUrl[1]}`;

	const { enqueueSnackbar } = useSnackbar();

	const selectedCompany = useSelectedCompany();
	const { data: { company: { acceptTakeout = false } = {} } = {}, loading: loadingCompany } = useQuery(LOAD_COMPANY, { variables: { id: selectedCompany } });
	const [createOrder] = useMutation(CREATE_ORDER, { refetchQueries: [{ query: GET_COMPANY_ORDERS, variables: { id: selectedCompany } }] })

	const order = createEmptyOrder({ type: acceptTakeout === false ? 'delivery' : '', companyId: selectedCompany });

	function onSubmit(data) {
		const dataSave = sanitizeOrder(data);

		return createOrder({ variables: { data: dataSave } })
			.then(({ data: { createOrder } })=>{
				enqueueSnackbar('O pedido foi criado com sucesso', { variant: 'success' });
				history.push(`${prefixUrl}/alterar/${createOrder.id}`);
			})
			.catch((err)=>{
				enqueueSnackbar(getErrors(err), { variant: 'error' });
			})
	}

	

	if (loadingCompany) return <LoadingBlock />

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