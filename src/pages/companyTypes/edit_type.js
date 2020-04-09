import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { extractCompanyType, sanitizeCompanyType } from '../../utils/companyType';
import { getErrors } from '../../utils/error';
import PageForm from './form';

import { UPDATE_COMPANY_TYPE, LOAD_COMPANY_TYPE } from '../../graphql/companyTypes';

const FILE_SIZE = 3000 * 1024;

const validationSchema = Yup.object().shape({
	name: Yup.string().required('O nome é obrigatório'),
	description: Yup.string().required('A descrição é obrigatória'),
	file: Yup.mixed().notRequired().test('fileSize', 'A imagem é muito grande. Máximo 5MB', value => !value || value.size <= FILE_SIZE)
});

function Page () {
	setPageTitle('Alterar categoria');

	const { id: editId } = useParams();
	const { enqueueSnackbar } = useSnackbar();
	
	const { data, loading: loadingGetData, error } = useQuery(LOAD_COMPANY_TYPE, { variables: { id: editId } });
	const [updateCompanyType] = useMutation(UPDATE_COMPANY_TYPE, { variables: { id: editId } })

	if (error) return <ErrorBlock error={getErrors(error)} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	// extract category data coming from DB
	const initialValues = extractCompanyType(data.companyType);

	function onSubmit(result) {
		const data = sanitizeCompanyType(result);

		return updateCompanyType({ variables: { data } })
			.then(()=>{
				enqueueSnackbar('O Ramos de atividade foi alterado com sucesso', { variant: 'success' });
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
		>
			{(props)=><PageForm {...props} pageTitle='Alterar ramo de atividade' />}
		</Formik>
	)
}

export default Page;