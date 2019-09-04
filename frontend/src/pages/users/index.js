import React, {useState} from 'react';
import {Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button, Checkbox, FormControl, FormLabel , FormGroup} from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiPencil, mdiFilter, mdiAccountCircle} from '@mdi/js';
import {Link} from 'react-router-dom';

import {setPageTitle} from '../../utils';
import Layout from '../../layout';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, SidebarContainer, Sidebar} from '../../layout/components';

function Page () {
	setPageTitle('Usuários');

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const users = [
		{
			name: 'Ivandro Cardoso',
			role: 'Consumidor',
			created_at:'25/08/19 15:35',
			active: true,
		},
		{
			name: 'Daniel K. Guolo',
			role: 'Administrador',
			created_at:'25/08/19 15:35',
			active: true,
		},
		{
			name: 'Diego Alves',
			role: 'Gerente',
			created_at:'25/08/19 15:35',
			active: true,
		},
	];

	return (
		<Layout>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Usuários <Button size='small' variant="contained" color='secondary' to='/usuarios/novo' component={Link}>Adicionar</Button></BlockTitle>
						<NumberOfRows>{users.length} usuários</NumberOfRows>
					</BlockHeader>
					<Paper>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell style={{width:30, paddingLeft:30}}></TableCell>
									<TableCell>Nome</TableCell>
									<TableCell>Função</TableCell>
									<TableCell>Criada em</TableCell>
									<TableCell style={{width:100}}>Ações</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
									<TableRow key={row.name}>
										<TableCell style={{width:30, paddingLeft:30, paddingRight:10}}><Icon path={mdiAccountCircle} color='#BCBCBC' size='20' /></TableCell>
										<TableCell>{row.name}</TableCell>
										<TableCell>{row.role}</TableCell>
										<TableCell>{row.created_at}</TableCell>
										<TableCell>
											<IconButton>
												<Icon path={mdiPencil} size='18' color='#363E5E' />
											</IconButton>
											<Switch
												checked={row.active}
												onChange={()=>{}}
												value="checkedB"
												size='small'
												color="secondary"
												inputProps={{ 'aria-label': 'primary checkbox' }}
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<TablePagination
							component="div"
							count={users.length}
							rowsPerPage={rowsPerPage}
							page={page}
							backIconButtonProps={{
								'aria-label': 'previous page',
							}}
							nextIconButtonProps={{
								'aria-label': 'next page',
							}}
							onChangePage={(e, newPage)=>{setPage(newPage)}}
							onChangeRowsPerPage={(e)=>{setRowsPerPage(e.target.value); setPage(0);}}
							/>
					</Paper>
					<NumberOfRows>{users.length} usuários</NumberOfRows>
				</Block>
			</Content>
			<SidebarContainer>
				<Block>
					<BlockHeader>
						<BlockTitle><Icon path={mdiFilter} size='18' color='#D41450' /> Filtros</BlockTitle>
						<FormControlLabel
							control={
								<Switch size='small' color='primary' checked={false} onChange={()=>{}} value="includeDisabled" />
							}
							label="Incluir inativos"
						/>
					</BlockHeader>
					<Sidebar>
						<form noValidate>
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<TextField
											label='Buscar'
											onChange={(event)=>{}}
											/>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<FormControl component="fieldset">
											<FormLabel component="legend">Função</FormLabel>
											<FormGroup>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="waiting" />}
													label="Administrador"
												/>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="preparing" />}
													label="Gerente de filiais"
												/>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="delivering" />}
													label="Gerente"
												/>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="delivered" />}
													label="Vendedor"
												/>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="canceled" />}
													label="Consumidor"
												/>
											</FormGroup>
										</FormControl>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<ButtonGroup fullWidth>
											<Button color='primary'>Limpar</Button>
											<Button variant="contained" color='primary'>Aplicar</Button>
										</ButtonGroup>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
						</form>
					</Sidebar>
				</Block>
			</SidebarContainer>
		</Layout>
	)
}

export default Page;