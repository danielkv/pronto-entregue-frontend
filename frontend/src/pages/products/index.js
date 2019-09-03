import React, {useState} from 'react';
import {Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button, Checkbox, MenuItem, FormControl, FormLabel , FormGroup} from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiPencil, mdiFilter} from '@mdi/js';
import {Link} from 'react-router-dom';
import numeral from 'numeral';

import {setPageTitle} from '../../utils';
import Layout from '../../layout';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, CircleNumber, SidebarContainer, Sidebar, ProductImage} from '../../layout/components';

function Page () {
	setPageTitle('Produtos');

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const products = [
		{
			image: 'https://www.turismoouropreto.com/wp-content/uploads/culin%C3%A1ria-mineira.jpg',
			name: 'Hamburguer de Siri',
			category: 'Hamburguer',
			options_qty: 3,
			amount: 17.50,
			created_at:'25/08/19 15:35',
			active: true,
		},
		{
			image: 'https://img.elo7.com.br/product/main/258B7CB/adesivo-parede-restaurante-prato-feito-comida-caseira-lenha-adesivo-restaurante-fritas-salada.jpg',
			name: 'Hamburguer de costela',
			category: 'Hamburguer',
			options_qty: 3,
			amount: 17.50,
			created_at:'25/08/19 15:35',
			active: true,
		},
		{
			image: 'https://www.turismoouropreto.com/wp-content/uploads/culin%C3%A1ria-mineira.jpg',
			name: 'Hamburguer de Siri',
			category: 'Hamburguer',
			options_qty: 3,
			amount: 17.50,
			created_at:'25/08/19 15:35',
			active: true,
		},
	];

	return (
		<Layout>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Produtos <Button size='small' variant="contained" color='secondary' to='/categorias/novo' component={Link}>Adicionar</Button></BlockTitle>
						<NumberOfRows>{products.length} produtos</NumberOfRows>
					</BlockHeader>
					<Paper>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell style={{width:30, paddingLeft:30}}></TableCell>
									<TableCell>Produto</TableCell>
									<TableCell>Categoria</TableCell>
									<TableCell>Nº de opções</TableCell>
									<TableCell>Preço</TableCell>
									<TableCell>Criada em</TableCell>
									<TableCell style={{width:100}}>Ações</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
									<TableRow key={row.name}>
										<TableCell style={{width:30, paddingLeft:30, paddingRight:10}}><ProductImage src={row.image} /></TableCell>
										<TableCell>{row.name}</TableCell>
										<TableCell>{row.category}</TableCell>
										<TableCell><CircleNumber>{row.options_qty}</CircleNumber></TableCell>
										<TableCell>{numeral(row.amount).format('$0,0.00')}</TableCell>
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
							count={products.length}
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
					<NumberOfRows>{products.length} produtos</NumberOfRows>
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
								<FormRow>
									<FieldControl>
										<TextField
											select
											label='Categoria'
											onChange={(event)=>{}}
											>
											<MenuItem value='1'>Hamburguer</MenuItem>
											<MenuItem value='2'>Lanches</MenuItem>
											<MenuItem value='3'>Porções</MenuItem>
										</TextField>

									</FieldControl>
								</FormRow>
							</BlockSeparator>
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<FormControl component="fieldset">
											<FormLabel component="legend">Contendo opções</FormLabel>
											<FormGroup>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="waiting" />}
													label="Aguardando"
												/>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="preparing" />}
													label="Preparando"
												/>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="delivering" />}
													label="Na entrega"
												/>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="delivered" />}
													label="Entregue"
												/>
												<FormControlLabel
													control={<Checkbox checked={false} onChange={()=>{}} value="canceled" />}
													label="Cancelado"
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