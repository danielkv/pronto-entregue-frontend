import React, {useState} from 'react';
import PageForm from './form';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Snackbar, SnackbarContent } from '@material-ui/core';

import {setPageTitle} from '../../utils';
import Layout from '../../layout';
import {LoadingBlock, ErrorBlock} from '../../layout/blocks';
import { LOAD_PRODUCT, UPDATE_PRODUCT } from '../../graphql/products';

function Page (props) {
	setPageTitle('Alterar produto');

	const edit_id = props.match.params.id;

	//erro e confirmação
	const [displayError, setDisplayError] = useState('');
	const [displaySuccess, setDisplaySuccess] = useState('');
	
	const {data, loading:loadingGetData, error} = useQuery(LOAD_PRODUCT, {variables:{id:edit_id}});
	const client = useApolloClient();

	if (error) return <ErrorBlock error={error} />
	if (!data || loadingGetData) return (<LoadingBlock />);

	const product = {
		name: data.product.name,
		description: data.product.description,
		active: data.product.active,
		file: '',
		preview: data.product.image,
		options_groups: data.product.options_groups.map(group=>{
			delete group.__typename;
			group.open = false;
			group.max_select_restrained_by = group.max_select_restrained_by ? group.max_select_restrained_by.id : '';
			group.options = group.options.map(option=>{
				delete option.__typename;
				option.item = option.item ? option.item.id : '';
				return option;
			});
			return group;
		})
	};

	function onSubmit(data, {setSubmitting}) {

		//console.log(data);

		client.mutate({mutation:UPDATE_PRODUCT, variables:{id:edit_id, data}})
		.then(()=>{
			setDisplaySuccess('O item de estoque foi salvo');
		})
		.catch((err)=>{
			setDisplayError(err.message);
			console.error(err.graphQLErrors, err.networkError, err.operation);
		})
		.finally(() => {
			setSubmitting(false);
		})
	}

	return (
		<Layout>
			<Snackbar
				open={!!displayError}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				onClose={()=>{setDisplayError('')}}
				autoHideDuration={4000}
			>
				<SnackbarContent className='error' message={!!displayError && displayError} />
			</Snackbar>
			<Snackbar
				open={!!displaySuccess}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				onClose={()=>{setDisplaySuccess('')}}
				autoHideDuration={4000}
			>
				<SnackbarContent className='success' message={!!displaySuccess && displaySuccess} />
			</Snackbar>
			<PageForm
				pageTitle='Alterar produto'
				initialValues={product}
				onSubmit={onSubmit}
				/>
		</Layout>
	)
}

export default Page;