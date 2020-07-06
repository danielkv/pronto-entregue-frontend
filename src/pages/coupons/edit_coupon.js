import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import { MAX_UPLOAD_SIZE } from '../../config';
import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { sanitizeCoupon, extractCoupon } from '../../utils/coupons';
import { getErrors } from '../../utils/error';
import PageForm from './form';

import { LOAD_COUPON, UPDATE_COUPON } from '../../graphql/coupons';

const validationSchema = Yup.object().shape({
	name: Yup.string().required('O nome é obrigatório'),
	file: Yup.mixed().notRequired()
		.test('fileSize', 'A imagem é muito grande. Máximo 5MB', value => !value || value.size <= MAX_UPLOAD_SIZE),
	description: Yup.string().required('A descrição é obrigatória'),
	value: Yup.number().required('O valor é obrigatório'),
});

function Page () {
	setPageTitle('Alterar campanha');

	const { id: editId } = useParams();
	const { enqueueSnackbar } = useSnackbar();
	
	const { data, loading: loadingGetData, error } = useQuery(LOAD_COUPON, { variables: { id: editId, filter: { showInactive: true } } });
	const [updateCoupon] = useMutation(UPDATE_COUPON, {
		variables: { id: editId },
		refetchQueries: [{ query: LOAD_COUPON, variables: { id: editId } }]
	});

	if (error) return <ErrorBlock error={getErrors(error)} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	const initialValues = extractCoupon(data.coupon);

	
	function onSubmit(data) {
		const saveData = sanitizeCoupon(data);

		return updateCoupon({ variables: { data: saveData } })
			.then(()=>{
				enqueueSnackbar('A campanha foi alterada com sucesso', { variant: 'success' });
			})
			.catch((err)=>{
				enqueueSnackbar(getErrors(err), { variant: 'error' });
			})
	}

	return (
		<Formik
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