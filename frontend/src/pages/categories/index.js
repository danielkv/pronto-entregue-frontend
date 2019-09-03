import React, {useState} from 'react';
import {Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button } from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiDrag , mdiPencil, mdiFilter} from '@mdi/js';
import {Link} from 'react-router-dom';

import {setPageTitle} from '../../utils';
import Layout from '../../layout';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, CircleNumber, SidebarContainer, Sidebar, ProductImage} from '../../layout/components';

function Page () {
	setPageTitle('Categorias');

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const categories = [
		{
			image: 'https://www.turismoouropreto.com/wp-content/uploads/culin%C3%A1ria-mineira.jpg',
			name: 'Lanches',
			products_qty: 3,
			created_at:'25/08/19 15:35',
			active: true,
		},
		{
			image: 'https://img.elo7.com.br/product/main/258B7CB/adesivo-parede-restaurante-prato-feito-comida-caseira-lenha-adesivo-restaurante-fritas-salada.jpg',
			name: 'Hamburguer',
			products_qty: 3,
			created_at:'25/08/19 15:35',
			active: true,
		},
	];

	return (
		<Layout>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Categorias <Button size='small' variant="contained" color='secondary' to='/categorias/novo' component={Link}>Adicionar</Button></BlockTitle>
						<NumberOfRows>{categories.length} categorias</NumberOfRows>
					</BlockHeader>
					<Paper>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell style={{width:30, paddingRight:10}}></TableCell>
									<TableCell style={{width:30, paddingRight:10}}></TableCell>
									<TableCell>Nome</TableCell>
									<TableCell>Produtos vinculados</TableCell>
									<TableCell>Criada em</TableCell>
									<TableCell style={{width:100}}>Ações</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
									<TableRow key={row.name}>
										<TableCell style={{width:30, paddingLeft:40, paddingRight:10}}><Icon path={mdiDrag} size='20' color='#BCBCBC' /></TableCell>
										<TableCell><ProductImage src={row.image} /></TableCell>
										<TableCell>{row.name}</TableCell>
										<TableCell><CircleNumber>{row.products_qty}</CircleNumber></TableCell>
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
							count={categories.length}
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
					<NumberOfRows>{categories.length} categorias</NumberOfRows>
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