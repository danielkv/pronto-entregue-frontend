import React, { useState, Fragment, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button, Checkbox, FormControl, FormLabel , FormGroup, CircularProgress } from '@material-ui/core';
import { mdiPencil, mdiFilter, mdiSale } from '@mdi/js';
import Icon from '@mdi/react';
import moment from 'moment';
import numeral from 'numeral';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, CircleNumber, SidebarContainer, Sidebar, ProductImage } from '../../layout/components';

import { useSelectedCompany } from '../../controller/hooks';
import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';

import { GET_COMPANY_PRODUCTS, UPDATE_PRODUCT } from '../../graphql/products';

const initialFilter = {
	showInactive: false,
	search: '',
}

function Page (props) {
	setPageTitle('Produtos');

	const searchRef = useRef(null);
	const [filter, setFilter] = useState(initialFilter);
	const [pagination, setPagination] = useState({
		page: 0,
		rowsPerPage: 10,
	});

	useEffect(()=>{
		setPagination((pagination) => ({ ...pagination, page: 0 }));
	}, [filter]);

	const submitFilterForm = (e) => {
		e.preventDefault();

		setFilter({
			...filter,
			search: searchRef.current.value
		})
	}
	const clearFilterForm = () => {
		setFilter(initialFilter);
	}

	const selectedCompany = useSelectedCompany();

	const {
		data: { company: { countProducts = 0, products = [] } = {} } = {},
		loading: loadingProducts,
		error: productsError,
		called,
	} = useQuery(GET_COMPANY_PRODUCTS, {
		variables: {
			id: selectedCompany,
			filter,
			pagination
		}
	});

	const [setCompanyEnabled, { loading }] = useMutation(UPDATE_PRODUCT);

	if (productsError) return <ErrorBlock error={getErrors(productsError)} />
	if (loadingProducts && !called) return (<LoadingBlock />);

	return (
		<Fragment>
			<Content>
				{loadingProducts ? <LoadingBlock /> :
					<Block>
						<BlockHeader>
							<BlockTitle>Produtos</BlockTitle>
							<Button size='small' variant="contained" color='secondary' to='/produtos/novo' component={Link}>Adicionar</Button> {loading && <CircularProgress />}
							<NumberOfRows>{countProducts} produtos</NumberOfRows>
						</BlockHeader>
						<Paper>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell style={{ width: 30, paddingLeft: 30 }}></TableCell>
										<TableCell>Produto</TableCell>
										<TableCell>Categoria</TableCell>
										<TableCell>Nº de opções</TableCell>
										<TableCell>Preço</TableCell>
										<TableCell>Criado em</TableCell>
										<TableCell style={{ width: 100 }}>Ações</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{products.map(row => (
										<TableRow key={row.id}>
											<TableCell style={{ width: 30, paddingLeft: 30, paddingRight: 10 }}><ProductImage src={row.image} /></TableCell>
											<TableCell>{row.name}</TableCell>
											<TableCell>{row.category.name}</TableCell>
											<TableCell><CircleNumber>{row.countOptions}</CircleNumber></TableCell>
											<TableCell>
												<div style={{ display: 'flex', alignItems: 'center' }}>
													{numeral(row.price).format('$0,0.00')}
													{!!row.countCampaigns && (
														<span style={{ marginLeft: 5 }} title={`Há ${row.countCampaigns} ${row.countCampaigns === 1 ? 'campanha vinculada' : 'campanhas vinculadas'} a este produto`}>
															<Icon path={mdiSale} color='#999' size='18' />
														</span>
													)}
												</div>
											</TableCell>
											<TableCell>{moment(row.createdAt).fromNow()}</TableCell>
											<TableCell>
												<IconButton disabled={loading} onClick={()=>{props.history.push(`/produtos/alterar/${row.id}`)}}>
													<Icon path={mdiPencil} size='18' color='#363E5E' />
												</IconButton>
												<Switch
													disabled={loading}
													checked={row.active}
													onChange={()=>setCompanyEnabled({ variables: { id: row.id, data: { active: !row.active } } }) }
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
								backIconButtonProps={{
									'aria-label': 'previous page',
								}}
								nextIconButtonProps={{
									'aria-label': 'next page',
								}}
								count={countProducts}
								rowsPerPage={pagination.rowsPerPage}
								page={pagination.page}
								onChangePage={(e, newPage)=>{setPagination({ ...pagination, page: newPage })}}
								onChangeRowsPerPage={(e)=>{setPagination({ ...pagination, page: 0, rowsPerPage: e.target.value });}}
							/>
						</Paper>
						<NumberOfRows>{countProducts} produtos</NumberOfRows>
					</Block>}
			</Content>
			<SidebarContainer>
				<Block>
					<BlockHeader>
						<BlockTitle><Icon path={mdiFilter} size='18' color='#D41450' /> Filtros</BlockTitle>
						<FormControlLabel
							control={
								<Switch
									size='small'
									color='primary'
									checked={filter.showInactive}
									onChange={()=>setFilter({ ...filter, showInactive: !filter.showInactive })}
									value={filter.showInactive}
								/>
							}
							label="Incluir inativos"
						/>
					</BlockHeader>
					<Sidebar>
						<form noValidate onSubmit={submitFilterForm}>
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<TextField
											label='Buscar'
											inputRef={searchRef}
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
											<Button type='reset' onClick={clearFilterForm} color='primary'>Limpar</Button>
											<Button variant="contained" type='submit' color='primary'>Aplicar</Button>
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