import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import { useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import { MAX_UPLOAD_SIZE } from '../../config';
import { useSelectedCompany, useLoggedUserRole } from '../../controller/hooks';
import { setPageTitle } from '../../utils';
import { createEmptyCoupon, sanitizeCoupon } from '../../utils/coupons';
import { getErrors } from '../../utils/error';
import PageForm from './form';

import { CREATE_COUPON } from '../../graphql/coupons';


const validationSchema = Yup.object().shape({
	name: Yup.string().required('O nome é obrigatório'),
	file: Yup.mixed().notRequired()
		.test('fileSize', 'A imagem é muito grande. Máximo 5MB', value => !value || value.size <= MAX_UPLOAD_SIZE),
	description: Yup.string().required('A descrição é obrigatória'),
	value: Yup.number().required('O valor é obrigatório'),
});

function Page({ history }) {
	setPageTitle('Novo produto');
	const { url } = useRouteMatch();
	const splitedUrl = url.substr(1).split('/')
	const prefixUrl = `/${splitedUrl[0]}/${splitedUrl[1]}`;

	const { enqueueSnackbar } = useSnackbar();
	const loggedUserRole = useLoggedUserRole();

	const selectedCompany = useSelectedCompany();
	const [createCoupon] = useMutation(CREATE_COUPON);

	const initialValues = createEmptyCoupon({ companies: (!loggedUserRole || loggedUserRole === 'master') ? [] : [{ id: selectedCompany }] });

	function onSubmit(data) {
		const dataSave = sanitizeCoupon(data);

		return createCoupon({ variables: { data: dataSave } })
			.then(({ data: { createCoupon } }) => {
				enqueueSnackbar('O cupom foi criado com sucesso', { variant: 'success' });
				history.push(`${prefixUrl}/alterar/${createCoupon.id}`);
			})
			.catch((err) => {
				enqueueSnackbar(getErrors(err), { variant: 'error' });
			})
	}

	return (
		<Formik
			enableReinitialize
			validationSchema={validationSchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={false}
			validateOnBlur={false}
			component={PageForm}
		/>
	)
}

export default Page;