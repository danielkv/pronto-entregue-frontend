import React from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableCell, TableRow, Switch, Typography } from '@material-ui/core';
import { mdiAlertCircle } from '@mdi/js';
import Icon from '@mdi/react';
import numeral from 'numeral';

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

	const handleEnableDisable = (id, action) => {
		if (action)
			enablePaymentMethod({ variables: { id } });
		else
			disablePaymentMethod({ variables: { id } });
	}

	const methodsGroups = [
		{ title: 'Pagamento no app (Cartão de crédito)', methods: appPaymentMethods },
		{ title: 'Pagamento em Dinheiro na entrega', methods: moneyPaymentMethods },
		{ title: 'Pagamento na entrega (seleciona as bandeiras)', methods: deliveryPaymentMethods },
	]
	
	return (
		<Paper>
			{methodsGroups.filter(m => m.methods.length).map(group =>
				(
					<Table key={group.title}>
						<TableHead>
							<TableRow>
								<TableCell style={{ width: 30 }}></TableCell>
								<TableCell><Typography variant='overline'>{group.title}</Typography></TableCell>
								<TableCell style={{ width: 30, textAlign: 'right' }}></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{group.methods.map((method, index)=> (
								<TableRow key={index}>
									<TableCell><img alt={method.displayName} src={method.image} style={{ height: 30 }} /></TableCell>
									<TableCell>
										{method.displayName}
										<Typography variant='caption'>{Boolean(method.fee) && ` (Taxa: ${method.feeType === 'pct' ? numeral(method.fee/100).format('0,0.00%') : numeral(method.fee).format('$0,0.00')})`}</Typography>
										{!method.active && <Icon path={mdiAlertCircle} title='Você pode habilitar essa forma de pagamento, mas ela foi desativada pelo administrador e não será mostrada no app' size={.8} color='#fa0' />}
									</TableCell>
									<TableCell>
										<Switch
											disabled={loadingEnablePaymentMethod || loadingDisablePaymentMethod}
											onClick={()=>{handleEnableDisable(method.id, !method.enabled)}}
											checked={method.enabled}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)
			)}
		</Paper>
	)
}

export default Page;