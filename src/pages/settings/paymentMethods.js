import React from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableCell, TableRow, Switch, Typography } from '@material-ui/core';

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
	const { data: { moneyMethods = [], deliveryMethods = [], appMethods = []  } ={}, loading: loadingPaymentMethods } = useQuery(GET_PAYMENT_METHODS);

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

	const moneyPaymentMethods = extractPaymentMethods(companyPaymentMethods, moneyMethods);
	const deliveryPaymentMethods = extractPaymentMethods(companyPaymentMethods, deliveryMethods);
	const appPaymentMethods = extractPaymentMethods(companyPaymentMethods, appMethods);

	console.log(moneyMethods);

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
						<TableCell><Typography variant='overline'>Pagamento em Dinheiro</Typography></TableCell>
						<TableCell style={{ width: 30, textAlign: 'right' }}>Ativo</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{moneyPaymentMethods.map((method, index)=> (
						<TableRow key={index}>
							<TableCell><img alt={method.displayName} src={method.image} style={{ height: 30 }} /></TableCell>
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
			<Table>
				<TableHead>
					<TableRow>
						<TableCell style={{ width: 30 }}></TableCell>
						<TableCell><Typography variant='overline'>Pagamento na entrega (seleciona as bandeiras)</Typography></TableCell>
						<TableCell style={{ width: 30, textAlign: 'right' }}>Ativo</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{deliveryPaymentMethods.map((method, index)=> (
						<TableRow key={index}>
							<TableCell><img alt={method.displayName} src={method.image} style={{ height: 30 }} /></TableCell>
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
			<Table>
				<TableHead>
					<TableRow>
						<TableCell style={{ width: 30 }}></TableCell>
						<TableCell><Typography variant='overline'>Pagamento no app (Cartão de crédito)</Typography></TableCell>
						<TableCell style={{ width: 30, textAlign: 'right' }}>Ativo</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{appPaymentMethods.map((method, index)=> (
						<TableRow key={index}>
							<TableCell><img alt={method.displayName} src={method.image} style={{ height: 30 }} /></TableCell>
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