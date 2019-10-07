import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';

import PageForm from './form';
import {setPageTitle, sanitizeProductData} from '../../utils';
import Layout from '../../layout';
import { GET_SELECTED_BRANCH } from '../../graphql/branches';
import { CREATE_PRODUCT, GET_BRANCHES_PRODUCTS } from '../../graphql/products';

function Page (props) {
	setPageTitle('Novo pedido');
	
	const client = useApolloClient();

	const order = {
		user:null,
		payment_fee:0,
		delivery_price:0,
		price:0,
		type:'',
		discount:0,
		status:'',
		message:'',
		street:'',
		number:'',
		complement:'',
		city:'',
		state:'',
		district:'',
		zipcode:'',
		products:[],
		payment_method:null,
	};

	function onSubmit(data, {setSubmitting}) {
		const dataSave = sanitizeProductData(data);
		const {selectedBranch} = client.readQuery({query:GET_SELECTED_BRANCH});

		client.mutate({mutation:CREATE_PRODUCT, variables:{data:dataSave}, refetchQueries:[{query:GET_BRANCHES_PRODUCTS, variables:{id:selectedBranch}}]})
		.then(({data:{createItem}})=>{
			props.history.push(`/estoque/alterar/${createItem.id}`);
		})
		.catch((err)=>{
			console.error(err);
		})
		.finally(()=>{
			setSubmitting(false);
		})
	}
	
	return (
		<Layout>
			<PageForm
				onSubmit={onSubmit}
				initialValues={order}
				pageTitle='Novo produto'
				validateOnChange={false}
			/>
		</Layout>
	)
}

export default Page;