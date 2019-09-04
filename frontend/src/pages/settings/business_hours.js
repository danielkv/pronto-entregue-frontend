import React from 'react';
import { Paper, Table, TableBody, TableCell, TextField, IconButton, TableRow } from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiMinusCircle, mdiPlusCircle} from '@mdi/js';

import {setPageTitle} from '../../utils';

function Page () {
	setPageTitle('Configurações - Horário de atendimento');
	
	return (
		<Paper>
			<Table>
				<TableBody>
					<TableRow>
						<TableCell>Domingo</TableCell>
						<TableCell>
							<TextField style={{margin:'0 7px'}} fullWidth={false} type='time' />
							<TextField style={{margin:'0 7px'}} fullWidth={false} type='time' />
						</TableCell>
						<TableCell>
							<IconButton>
								<Icon path={mdiPlusCircle} color='#707070' size='18' />
							</IconButton>
							<IconButton>
								<Icon path={mdiMinusCircle} color='#707070' size='18' />	
							</IconButton>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Segunda-Feira</TableCell>
						<TableCell>
							<TextField style={{margin:'0 7px'}} fullWidth={false} type='time' />
							<TextField style={{margin:'0 7px'}} fullWidth={false} type='time' />
						</TableCell>
						<TableCell>
							<IconButton>
								<Icon path={mdiPlusCircle} color='#707070' size='18' />
							</IconButton>
							<IconButton>
								<Icon path={mdiMinusCircle} color='#707070' size='18' />	
							</IconButton>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Terça-Feira</TableCell>
						<TableCell>
							<TextField style={{margin:'0 7px'}} fullWidth={false} type='time' />
							<TextField style={{margin:'0 7px'}} fullWidth={false} type='time' />
						</TableCell>
						<TableCell>
							<IconButton>
								<Icon path={mdiPlusCircle} color='#707070' size='18' />
							</IconButton>
							<IconButton>
								<Icon path={mdiMinusCircle} color='#707070' size='18' />	
							</IconButton>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Quarta-Feira</TableCell>
						<TableCell>
							<TextField style={{margin:'0 7px'}} fullWidth={false} type='time' />
							<TextField style={{margin:'0 7px'}} fullWidth={false} type='time' />
						</TableCell>
						<TableCell>
							<IconButton>
								<Icon path={mdiPlusCircle} color='#707070' size='18' />
							</IconButton>
							<IconButton>
								<Icon path={mdiMinusCircle} color='#707070' size='18' />	
							</IconButton>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Quinta-Feira</TableCell>
						<TableCell>
							<TextField style={{margin:'0 7px'}} fullWidth={false} type='time' />
							<TextField style={{margin:'0 7px'}} fullWidth={false} type='time' />
						</TableCell>
						<TableCell>
							<IconButton>
								<Icon path={mdiPlusCircle} color='#707070' size='18' />
							</IconButton>
							<IconButton>
								<Icon path={mdiMinusCircle} color='#707070' size='18' />	
							</IconButton>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Sexta-Feira</TableCell>
						<TableCell>
							<TextField style={{margin:'0 7px'}} fullWidth={false} type='time' />
							<TextField style={{margin:'0 7px'}} fullWidth={false} type='time' />
						</TableCell>
						<TableCell>
							<IconButton>
								<Icon path={mdiPlusCircle} color='#707070' size='18' />
							</IconButton>
							<IconButton>
								<Icon path={mdiMinusCircle} color='#707070' size='18' />	
							</IconButton>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Sábado</TableCell>
						<TableCell>
							<TextField style={{margin:'0 7px'}} fullWidth={false} type='time' />
							<TextField style={{margin:'0 7px'}} fullWidth={false} type='time' />
						</TableCell>
						<TableCell>
							<IconButton>
								<Icon path={mdiPlusCircle} color='#707070' size='18' />
							</IconButton>
							<IconButton>
								<Icon path={mdiMinusCircle} color='#707070' size='18' />	
							</IconButton>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Paper>		
	)
}

export default Page;