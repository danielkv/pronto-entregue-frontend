import React from 'react';
import { Paper, Table, TableBody, TableHead, TableCell, TableRow, Switch } from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiCreditCardOutline} from '@mdi/js';

import {setPageTitle} from '../../utils';

function Page () {
	setPageTitle('Configurações - Formas de pagamento');
	
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
					<TableRow>
						<TableCell><Icon path={mdiCreditCardOutline} color='#707070' size='18' /></TableCell>
						<TableCell>Dinheiro</TableCell>
						<TableCell>
							<Switch checked={true} />
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell><Icon path={mdiCreditCardOutline} color='#707070' size='18' /></TableCell>
						<TableCell>Cartão de crédito / débito</TableCell>
						<TableCell>
							<Switch checked={true} />
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Paper>		
	)
}

export default Page;