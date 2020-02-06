import React from 'react';

import { useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useSelectedCompany, useLoggedUserRole } from '../../controller/hooks';
import { setPageTitle } from '../../utils';
import { createEmptyCampaign, sanitizeCampaign } from '../../utils/campaign';
import PageForm from './form';

import { CREATE_CAMPAIGN, GET_CAMPAIGNS } from '../../graphql/campaigns';

const FILE_SIZE = 500 * 1024;

const validationSchema = Yup.object().shape({
	name: Yup.string().required('O nome é obrigatório'),
	file: Yup.mixed().required('Selecione uma imagem')
		.test('fileSize', 'A imagem é muito grande. Máximo 500kb', value => !value || value.size <= FILE_SIZE),
	description: Yup.string().required('A descrição é obrigatória'),
	value: Yup.number().required('O valor é obrigatório'),
});

function Page ({ history }) {
	setPageTitle('Novo produto');

	const loggedUserRole = useLoggedUserRole();

	const selectedCompany = useSelectedCompany();
	const [createCampaign] = useMutation(CREATE_CAMPAIGN, { refetchQueries: [{ query: GET_CAMPAIGNS }] });

	const initialValues = createEmptyCampaign({ companies: (!loggedUserRole || loggedUserRole === 'master') ? [] : [{ id: selectedCompany }] });

	function onSubmit(data) {
		const dataSave = sanitizeCampaign(data);

		return createCampaign({ variables: { data: dataSave } })
			.then(({ data: { createCampaign } })=>{
				history.push(`/campanhas/alterar/${createCampaign.id}`);
			})
			.catch((err)=>{
				console.error(err);
			});
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