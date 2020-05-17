import React from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useSelectedCompany } from '../../../controller/hooks';
import { LoadingBlock } from '../../../layout/blocks';
import { setPageTitle } from '../../../utils';
import { sanitizeViewAreas } from '../../../utils/settings';
import Form from './form'

import { GET_COMPANY_VIEW_AREAS, MODIFY_VIEW_AREA } from '../../../graphql/viewAreas';

function Page () {
	setPageTitle('Configurações - Locais de entrega');

	const selectedCompany = useSelectedCompany();
	const {
		data: { company: { address = {}, viewAreas: viewAreasInitial = [] } = {} } = {},
		loading: loadingviewAreas
	} = useQuery(GET_COMPANY_VIEW_AREAS, { variables: { id: selectedCompany } });

	// mutations
	const [modifyViewAreas] = useMutation(MODIFY_VIEW_AREA, { refetchQueries: [{ query: GET_COMPANY_VIEW_AREAS, variables: { id: selectedCompany } }] })
	
	// still loading displays loading
	if (loadingviewAreas) return <LoadingBlock />;

	//form schema
	const areasSchema = Yup.object().shape({
		viewAreas: Yup.array().of(Yup.object().shape({
			name: Yup.string().required('Obrigatório'),
			price: Yup.number().required('Obrigatório'),
			radius: Yup.number().required('Selecione a área no mapa'),
		}))
	});

	const handleSave = ({ viewAreas }) => {
		const viewAreasSave = sanitizeViewAreas(viewAreas);
		return modifyViewAreas({ variables: { data: viewAreasSave } });
	}

	return (
		<Formik
			onSubmit={handleSave}
			enableReinitialize={true}
			validationSchema={areasSchema}
			validateOnChange={false}
			validateOnBlur={true}
			initialValues={{ viewAreas: viewAreasInitial }}
			component={(props) => <Form center={address.location} {...props} />}
		/>
	)
}

export default Page;