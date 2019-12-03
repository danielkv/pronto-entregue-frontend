import React, {useState, Fragment} from 'react';
import {Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button, Checkbox, FormControl, FormLabel , FormGroup} from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiPencil, mdiFilter} from '@mdi/js';
import {Link} from 'react-router-dom';
import numeral from 'numeral';
import {LoadingBlock, ErrorBlock} from '../../layout/blocks';
import { useQuery, useMutation } from '@apollo/react-hooks';

import {setPageTitle} from '../../utils';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, CircleNumber, SidebarContainer, Sidebar, ProductImage, Loading} from '../../layout/components';
import { GET_SELECTED_BRANCH } from '../../graphql/branches';
import { GET_BRANCHES_PRODUCTS, UPDATE_PRODUCT } from '../../graphql/products';

function Page (props) {
	setPageTitle('Produtos');

	const [showInactive, setShowInactive] = useState(false);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const { data: { selectedBranch }, loading:loadingSelectedData } = useQuery(GET_SELECTED_BRANCH);

	const {data:productsData, loading:loadingProductsData, error} = useQuery(GET_BRANCHES_PRODUCTS, {
		variables: {
			id: selectedBranch,
			filter: { showInactive }
		} 
	});
	const products = productsData && productsData.branch.products.length ? productsData.branch.products : [];

	const [setCompanyEnabled, {loading}] = useMutation(UPDATE_PRODUCT);

	if (error) return <ErrorBlock error={error} />
	if (loadingProductsData || loadingSelectedData) return (<LoadingBlock />);

	return (
		<Fragment>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Produtos</BlockTitle>
						<Button size='small' variant="contained" color='secondary' to='/produtos/novo' component={Link}>Adicionar</Button> {loading && <Loading />}
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
									<TableRow key={row.id}>
										<TableCell style={{width:30, paddingLeft:30, paddingRight:10}}><ProductImage src={row.image} /></TableCell>
										<TableCell>{row.name}</TableCell>
										<TableCell>{row.category.name}</TableCell>
										<TableCell><CircleNumber>{row.options_qty}</CircleNumber></TableCell>
										<TableCell>{numeral(row.price).format('$0,0.00')}</TableCell>
										<TableCell>{row.createdAt}</TableCell>
										<TableCell>
											<IconButton disabled={loading} onClick={()=>{props.history.push(`/produtos/alterar/${row.id}`)}}>
												<Icon path={mdiPencil} size='18' color='#363E5E' />
											</IconButton>
											<Switch
												disabled={loading}
												checked={row.active}
												onChange={()=>{setCompanyEnabled({variables:{filter:{showInactive}, id:row.id, data:{active:!row.active}}})}}
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
								<Switch size='small' color='primary' checked={showInactive} onChange={()=>{setShowInactive(!showInactive)}} value="includeDisabled" />
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
										{/* <TextField
											select
											label='Categoria'
											onChange={(event)=>{}}
											>
											<MenuItem value='1'>Hamburguer</MenuItem>
											<MenuItem value='2'>Lanches</MenuItem>
											<MenuItem value='3'>Porções</MenuItem>
										</TextField> */}

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
		</Fragment>
	)
}

export default Page;