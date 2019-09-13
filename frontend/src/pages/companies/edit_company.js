import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import gql from 'graphql-tag';
import { useQuery, useApolloClient } from '@apollo/react-hooks';

import PageForm from './form';
import {setPageTitle, extractMetas, joinMetas} from '../../utils';
import Layout from '../../layout';
import { Loading } from '../../layout/components';
import { UPDATE_COMPANY } from '../../graphql/companies';


export const LOAD_COMPANY = gql`
	query ($id: ID!) {
		company (id: $id) {
			id
			name
			display_name
			createdAt
			active
			metas {
				id
				meta_type
				meta_value
				action @client
			}
		}
	}
`;

const companySchema = Yup.object().shape({
	name: Yup.string().required('Obrigatório'),
	display_name: Yup.string().required('Obrigatório'),
	document : Yup.object().shape({
			meta_value:Yup.string().required('Obrigatório')
		}),
	contact : Yup.object().shape({
			meta_value:Yup.string().required('Obrigatório')
		}),
	address : Yup.object().shape({
		meta_value: Yup.object().shape({
				street: Yup.string().required('Obrigatório'),
				number: Yup.number().typeError('Deve ser um número').required('Obrigatório'),
				zipcode: Yup.string().required('Obrigatório'),
				district: Yup.string().required('Obrigatório'),
				city: Yup.string().required('Obrigatório'),
				state: Yup.string().required('Obrigatório'),
			})
		}),
	phones: Yup.array().of(Yup.object().shape({
			meta_value:Yup.string().required('Obrigatório')
		})).min(1),
	emails: Yup.array().of(Yup.object().shape({
			meta_value:Yup.string().required('Obrigatório').email('Email não é válido'),
		})).min(1),
});

function Page (props) {
	setPageTitle('Nova empresa');

	const edit_id = props.match.params.id;
	
	const {data, loading:loadingGetData} = useQuery(LOAD_COMPANY, {variables:{id:edit_id}});
	const client = useApolloClient();

	if (!data || loadingGetData) return (<Layout><Loading /></Layout>);

	const company = {
		name: data.company.name,
		display_name: data.company.display_name,
		active: data.company.active,
		...extractMetas(data.company.metas)
	};

	function onSubmit(values, {setSubmitting}) {
		const data = {...values, metas:joinMetas(values)};
		delete data.address;
		delete data.contact;
		delete data.phones;
		delete data.emails;
		delete data.document;

		client.mutate({mutation:UPDATE_COMPANY, variables:{id:edit_id, data}})
		.then(({data, error}) => {
			if (error) return console.error(error);

			setSubmitting(false);
		})
		.catch((err)=>{
			console.log(err.graphQLErrors, err.networkError, err.operation);
		})
	}
	
	return (
		<Layout>
			<Formik
				validationSchema={companySchema}
				initialValues={company}
				onSubmit={onSubmit}
				component={PageForm}
				/>
		</Layout>
	)
}

export default Page;