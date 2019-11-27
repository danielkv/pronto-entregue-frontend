import React from 'react';
import { Paper, Table, TableBody, TableHead, TableCell, TableRow, Switch } from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiCreditCardOutline} from '@mdi/js';
import {useQuery, useMutation} from '@apollo/react-hooks';

import {setPageTitle} from '../../utils';
import { GET_PAYMENT_METHODS } from '../../graphql/payment_methods';
import { GET_SELECTED_BRANCH, LOAD_BRANCH_PAYMENT_METHODS, ENABLE_PAYMENT_METHOD, DISABLE_PAYMENT_METHOD } from '../../graphql/branches';
import { LoadingBlock } from '../../layout/blocks';

function Page () {
	setPageTitle('Configurações - Formas de pagamento');

	//carrega todos métodos de pagamento
	const {data: paymentMethodsData, loading:loadingPaymentMethods} = useQuery(GET_PAYMENT_METHODS);

	//carrega métodos pagamento ativos na filial
	const {data:selectedBranchData, loading:loadingSelectedData} = useQuery(GET_SELECTED_BRANCH);
	const {data: branchPaymentMethodsData, loading:loadingBranchPaymentMethods} = useQuery(LOAD_BRANCH_PAYMENT_METHODS, {variables:{id:selectedBranchData.selectedBranch}});

	const [enablePaymentMethod, {loading:loadingEnablePaymentMethod}] = useMutation(ENABLE_PAYMENT_METHOD, {refetchQueries:[{query:LOAD_BRANCH_PAYMENT_METHODS, variables:{id:selectedBranchData.selectedBranch}}]})
	const [disablePaymentMethod, {loading:loadingDisablePaymentMethod}] = useMutation(DISABLE_PAYMENT_METHOD, {refetchQueries:[{query:LOAD_BRANCH_PAYMENT_METHODS, variables:{id:selectedBranchData.selectedBranch}}]})

	if (loadingPaymentMethods || loadingSelectedData || loadingBranchPaymentMethods) return <LoadingBlock />;

	const paymentMethods = paymentMethodsData.paymentMethods.map(method => {
		return {
			...method,
			active: !!branchPaymentMethodsData.branch.paymentMethods.length && !!branchPaymentMethodsData.branch.paymentMethods.find(row=>row.id===method.id)
		}
	});

	const handleEnableDisable = (id, action) => {
		if (action)
			enablePaymentMethod({variables:{id}});
		else
			disablePaymentMethod({variables:{id}});
	}
	
	return (
		<Paper>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell style={{width:30}}></TableCell>
						<TableCell>Forma de pagamento</TableCell>
						<TableCell style={{width:30}}>Ações</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{paymentMethods.map((method, index)=> (
					<TableRow key={index}>
						<TableCell><Icon path={mdiCreditCardOutline} color='#707070' size='18' /></TableCell>
						<TableCell>{method.display_name}</TableCell>
						<TableCell>
							<Switch
								disabled={loadingEnablePaymentMethod || loadingDisablePaymentMethod}
								onClick={(e)=>{handleEnableDisable(method.id, !method.active)}}
								checked={method.active}
								/>
						</TableCell>
					</TableRow>
					))}
				</TableBody>
			</Table>
		</Paper>		
	)
}

export default Page;