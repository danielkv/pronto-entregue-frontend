import React from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';

import PageForm from './form';
import {setPageTitle, sanitizeProductData} from '../../utils';
import { GET_SELECTED_BRANCH } from '../../graphql/branches';
import { CREATE_PRODUCT, GET_BRANCHES_PRODUCTS } from '../../graphql/products';

function Page (props) {
	setPageTitle('Novo produto');

	const client = useApolloClient();
	const { selectedBranch } = client.readQuery({ query: GET_SELECTED_BRANCH });
	const [createProduct] = useMutation(CREATE_PRODUCT, { refetchQueries: [{ query: GET_BRANCHES_PRODUCTS, variables: { id: selectedBranch } }] });

	const product = {
		name:'',
		description:'',
		active:true,
		type:'inline',
		price:'',
		file:'',
		featured: false, 
		preview:'',
		category:{id:''},
		options_groups: []
	};

	function onSubmit(data) {
		const dataSave = sanitizeProductData(data);

		return createProduct({ variables:{ data: dataSave } })
			.then(({data:{createItem}})=>{
				props.history.push(`/estoque/alterar/${createItem.id}`);
			})
			.catch((err)=>{
				console.error(err);
			});
	}
	
	return (
		<PageForm
			onSubmit={onSubmit}
			initialValues={product}
			pageTitle='Novo produto'
			validateOnChange={false}
		/>
	)
}

export default Page;