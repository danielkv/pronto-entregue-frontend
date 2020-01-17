import React from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';

import { ErrorBlock } from '../../layout/blocks';
import { setPageTitle, joinMetas, initialMetas } from '../../utils';
import { getErrors } from '../../utils/error';
import PageForm from './form';

import { GET_SELECTED_COMPANY } from '../../graphql/companies';
import { GET_COMPANY_USERS, CREATE_USER } from '../../graphql/users';


function Page (props) {
	setPageTitle('Novo usuário');
	
	const { data: { selectedCompany } } = useQuery(GET_SELECTED_COMPANY);
	const [createUser, { error: errorSaving }] = useMutation(CREATE_USER, { refetchQueries: [{ query: GET_COMPANY_USERS, variables: { id: selectedCompany } }] })

	const metas = ['document', 'addresses', 'phones'];

	const user = {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		active: true,
		assignedCompany: {
			active: true,
		},
		...initialMetas(metas)
	};

	function onSubmit(values) {
		// eslint-disable-next-line no-param-reassign
		values = JSON.parse(JSON.stringify(values));
		const data = { ...values, metas: joinMetas(metas, values) };
		delete data.addresses;
		delete data.phones;
		delete data.document;

		return createUser({ variables: { data } })
			.then(({ data: { createUser } })=>{
				props.history.push(`/usuarios/alterar/${createUser.id}`);
			});
	}

	if (errorSaving) return <ErrorBlock error={getErrors(errorSaving)} />
	
	return (
		<PageForm
			onSubmit={onSubmit}
			initialValues={user}
			selectedCompany={selectedCompany}
			pageTitle='Novo usuário'
			validateOnChange={false}
		/>
	)
}

export default Page;