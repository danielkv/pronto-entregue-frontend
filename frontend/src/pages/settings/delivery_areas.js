import React from 'react';
import { Paper, Table, TableBody, TableHead, TableCell, TextField, IconButton, TableRow, MenuItem, ButtonGroup, Button, InputAdornment } from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiCashMarker, mdiDelete, mdiPlusCircle} from '@mdi/js';

import {setPageTitle} from '../../utils';
import { FormRow, FieldControl } from '../../layout/components';

function Page () {
	setPageTitle('Configurações - Locais de entrega');
	
	return (
		<Paper>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell></TableCell>
						<TableCell>Nome</TableCell>
						<TableCell>Tipo</TableCell>
						<TableCell>CEP</TableCell>
						<TableCell>Valor</TableCell>
						<TableCell>Ações</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell><Icon path={mdiCashMarker} color='#707070' size='18' /></TableCell>
						<TableCell><TextField /></TableCell>
						<TableCell>
							<TextField select>
								<MenuItem value='single'>Simples</MenuItem>
								<MenuItem value='range'>Variação</MenuItem>
								<MenuItem value='joker'>Coringa</MenuItem>
							</TextField>
						</TableCell>
						<TableCell><TextField /></TableCell>
						<TableCell><TextField InputProps={{startAdornment:<InputAdornment position="start">R$</InputAdornment>}} /></TableCell>
						<TableCell>
							<IconButton>
								<Icon path={mdiDelete} color='#707070' size='18' />	
							</IconButton>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
			<FormRow></FormRow>
			<FormRow>
				<FieldControl>
					<ButtonGroup>
						<Button color='secondary'>Cancelar</Button>
						<Button variant="contained" color='secondary'><Icon className='iconLeft' path={mdiPlusCircle} color='#fff' size='20' /> Adicionar</Button>
						<Button variant="contained" color='secondary'>Salvar</Button>
					</ButtonGroup>
				</FieldControl>
			</FormRow>
		</Paper>		
	)
}

export default Page;