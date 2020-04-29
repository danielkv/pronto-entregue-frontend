import React from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useSelectedCompany } from '../../../controller/hooks';
import { LoadingBlock } from '../../../layout/blocks';
import { setPageTitle } from '../../../utils';
import { sanitizeDeliveryAreas } from '../../../utils/settings';
import Form from './form'

import { GET_COMPANY_DELIVERY_AREAS, MODIFY_DELIVERY_AREA } from '../../../graphql/deliveryAreas';

function Page () {
	setPageTitle('Configurações - Locais de entrega');

	// query load delivery_areas
	const selectedCompany = useSelectedCompany();
	const {
		data: { company: { address = {}, deliveryAreas: deliveryAreasInitial = [] } = {} } = {},
		loading: loadingDeliveryAreas
	} = useQuery(GET_COMPANY_DELIVERY_AREAS, { variables: { id: selectedCompany } });

	// mutations
	const [modifyDeliveryAreas] = useMutation(MODIFY_DELIVERY_AREA, { refetchQueries: [{ query: GET_COMPANY_DELIVERY_AREAS, variables: { id: selectedCompany } }] })
	
	// still loading displays loading
	if (loadingDeliveryAreas) return <LoadingBlock />;

	//form schema
	const areasSchema = Yup.object().shape({
		deliveryAreas: Yup.array().of(Yup.object().shape({
			name: Yup.string().required('Obrigatório'),
			price: Yup.number().required('Obrigatório'),
			radius: Yup.number().required('Selecione a área no mapa'),
		}))
	});

	const handleSave = ({ deliveryAreas }) => {
		const deliveryAreasSave = sanitizeDeliveryAreas(deliveryAreas);
		return modifyDeliveryAreas({ variables: { data: deliveryAreasSave } });
	}

	return (
		<Formik
			onSubmit={handleSave}
			enableReinitialize={true}
			validationSchema={areasSchema}
			validateOnChange={false}
			validateOnBlur={true}
			initialValues={{ deliveryAreas: deliveryAreasInitial }}
			component={(props) => <Form center={address.location} {...props} />}
		/>
	)
}

export default Page;