import React from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableCell, TableRow, Switch } from '@material-ui/core';
import { mdiCreditCardOutline } from '@mdi/js';
import Icon from '@mdi/react';

import { useSelectedCompany } from '../../controller/hooks';
import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { extractPaymentMethods } from '../../utils/settings';

import { GET_COMPANY_PAYMENT_METHODS, ENABLE_PAYMENT_METHOD, DISABLE_PAYMENT_METHOD } from '../../graphql/companies';
import { GET_PAYMENT_METHODS } from '../../graphql/paymentMethods';

function Page () {
	setPageTitle('Configurações - Formas de pagamento');

	//carrega todos métodos de pagamento
	const { data: { paymentMethods: allPaymentMethods = [] } ={}, loading: loadingPaymentMethods } = useQuery(GET_PAYMENT_METHODS);

	//carrega métodos pagamento ativos na filial
	const selectedCompany = useSelectedCompany();
	const {
		data: { company: { paymentMethods: companyPaymentMethods = [] } = {} }= {},
		loading: loadingCompanyPaymentMethods
	} = useQuery(GET_COMPANY_PAYMENT_METHODS, { variables: { id: selectedCompany } });

	const [enablePaymentMethod, { loading: loadingEnablePaymentMethod, error: enableError }] = useMutation(ENABLE_PAYMENT_METHOD, { refetchQueries: [{ query: GET_COMPANY_PAYMENT_METHODS, variables: { id: selectedCompany } }] })
	const [disablePaymentMethod, { loading: loadingDisablePaymentMethod, error: disableError }] = useMutation(DISABLE_PAYMENT_METHOD, { refetchQueries: [{ query: GET_COMPANY_PAYMENT_METHODS, variables: { id: selectedCompany } }] })

	if (enableError || disableError) return <ErrorBlock error={getErrors(enableError || disableError)} />;
	if (loadingPaymentMethods || loadingCompanyPaymentMethods) return <LoadingBlock />;

	const paymentMethods = extractPaymentMethods(companyPaymentMethods, allPaymentMethods);

	const handleEnableDisable = (id, action) => {
		if (action)
			enablePaymentMethod({ variables: { id } });
		else
			disablePaymentMethod({ variables: { id } });
	}
	
	return (
		<Paper>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell style={{ width: 30 }}></TableCell>
						<TableCell>Forma de pagamento</TableCell>
						<TableCell style={{ width: 30 }}>Ações</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{paymentMethods.map((method, index)=> (
						<TableRow key={index}>
							<TableCell><Icon path={mdiCreditCardOutline} color='#707070' size='18' /></TableCell>
							<TableCell>{method.displayName}</TableCell>
							<TableCell>
								<Switch
									disabled={loadingEnablePaymentMethod || loadingDisablePaymentMethod}
									onClick={()=>{handleEnableDisable(method.id, !method.active)}}
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