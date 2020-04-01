import React, { useState, Fragment, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button, CircularProgress, Chip, Avatar, Typography } from '@material-ui/core';
import { mdiPencil, mdiFilter, mdiBrightnessPercent } from '@mdi/js';
import Icon from '@mdi/react';
import moment from 'moment';
import numeral from 'numeral';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, SidebarContainer, Sidebar } from '../../layout/components';

import { useSelectedCompany } from '../../controller/hooks';
import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';

import { GET_COMPANY_PRODUCTS, UPDATE_PRODUCT } from '../../graphql/products';

const initialFilter = {
	showInactive: false,
	search: '',
}

function Page ({ match: { url } }) {
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
							<Button size='small' variant="contained" color='primary' to={`${url}/novo`} component={Link}>Adicionar</Button> {loading && <CircularProgress />}
							<NumberOfRows>{countProducts} produtos</NumberOfRows>
						</BlockHeader>
						<Paper>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell style={{ width: 30, paddingLeft: 30 }}></TableCell>
										<TableCell>Produto</TableCell>
										<TableCell>Favoritado por</TableCell>
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
											<TableCell style={{ width: 30, paddingLeft: 30, paddingRight: 10 }}><Avatar alt={row.name} src={row.image} /></TableCell>
											<TableCell>
												<div style={{ alignItems: "center", flexDirection: 'row', display: 'flex' }}>
													<div style={{ marginRight: 5 }}>{row.name}</div>
													{row.sale
														&& <Icon
															path={mdiBrightnessPercent}
															size={.8}
															color={
																row.sale.progress
																	? '#0a2'
																	: row.sale.active
																		? '#f95'
																		: '#ccc'
															}
															title={
																row.sale.progress
																	? `Promoção em andamento, termina em ${moment(row.sale.expiresAt).format('DD/MM/YY HH:MM')}`
																	: row.sale.active
																		? `Promoção inicia em ${moment(row.sale.startsAt).format('DD/MM/YY HH:MM')}`
																		: 'Promoção aguardando aprovação'}
														/>}
												</div>
											</TableCell>
											<TableCell><Chip color={row.countFavoritedBy ? 'secondary' : 'default'} label={row.countFavoritedBy} /></TableCell>
											<TableCell><Chip variant='outlined' label={row.category.name} /></TableCell>
											<TableCell><Chip variant='outlined' label={row.countOptions} /></TableCell>
											<TableCell>
												<div style={{ display: 'flex', flexDirection: 'column' }}>
													{row.sale && <Typography variant='caption' style={{ textDecoration: 'line-through', marginRight: 5 }}>{numeral(row.price).format('$0,0.00')}</Typography>}
													<Typography>
														{row.sale
															? numeral(row.sale.price).format('$0,0.00')
															: numeral(row.price).format('$0,0.00')}
													</Typography>
													
												</div>
											</TableCell>
											<TableCell>{moment(row.createdAt).format('DD/MM/YY')}</TableCell>
											<TableCell>
												<IconButton disabled={loading} component={Link} to={`${url}/alterar/${row.id}`}>
													<Icon path={mdiPencil} size={1} color='#363E5E' />
												</IconButton>
												<Switch
													disabled={loading || row.sale}
													checked={row.active}
													onChange={()=>setCompanyEnabled({ variables: { id: row.id, data: { active: !row.active } } }) }
													value="checkedB"
													size='small'
													color='primary'
													inputProps={{ 'aria-label': 'primary checkbox' }}
													title={row.sale && 'Não é possível alterar um produto, com uma promoção ativa'}
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
						<BlockTitle><Icon path={mdiFilter} size={1} color='#D41450' /> Filtros</BlockTitle>
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