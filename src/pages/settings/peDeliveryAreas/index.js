import React from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useSelectedCompany } from '../../../controller/hooks';
import { LoadingBlock } from '../../../layout/blocks';
import { setPageTitle } from '../../../utils';
import { sanitizeDeliveryAreas } from '../../../utils/settings';
import Form from './form'

import { GET_COMPANY_PE_DELIVERY_AREAS, MODIFY_PE_DELIVERY_AREA } from '../../../graphql/peDeliveryAreas';

function Page () {
	setPageTitle('Configurações - Locais de entrega');

	const selectedCompany = useSelectedCompany();
	const {
		data: { company: { address = {}, peDeliveryAreas: peDeliveryAreasInitial = [] } = {} } = {},
		loading: loadingPeDeliveryAreas
	} = useQuery(GET_COMPANY_PE_DELIVERY_AREAS, { variables: { id: selectedCompany } });

	// mutations
	const [modifyPeDeliveryAreas] = useMutation(MODIFY_PE_DELIVERY_AREA, { refetchQueries: [{ query: GET_COMPANY_PE_DELIVERY_AREAS, variables: { id: selectedCompany } }] })
	
	// still loading displays loading
	if (loadingPeDeliveryAreas) return <LoadingBlock />;

	//form schema
	const areasSchema = Yup.object().shape({
		peDeliveryAreas: Yup.array().of(Yup.object().shape({
			name: Yup.string().required('Obrigatório'),
			price: Yup.string().required('Obrigatório'),
			radius: Yup.number().required('Selecione a área no mapa'),
		}))
	});

	const handleSave = ({ peDeliveryAreas }) => {
		const peDeliveryAreasSave = sanitizeDeliveryAreas(peDeliveryAreas);
		return modifyPeDeliveryAreas({ variables: { data: peDeliveryAreasSave } });
	}

	return (
		<Formik
			onSubmit={handleSave}
			enableReinitialize={true}
			validationSchema={areasSchema}
			validateOnChange={false}
			validateOnBlur={true}
			initialValues={{ peDeliveryAreas: peDeliveryAreasInitial }}
			component={(props) => <Form center={address.location} {...props} />}
		/>
	)
}

export default Page;