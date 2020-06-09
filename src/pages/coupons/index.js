import React, { useState, Fragment, useRef, useEffect } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button, CircularProgress, Avatar } from '@material-ui/core';
import { mdiPencil, mdiFilter } from '@mdi/js';
import Icon from '@mdi/react';
import moment from 'moment';
import numeral from 'numeral';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, SidebarContainer, Sidebar } from '../../layout/components';

import { useSelectedCompany } from '../../controller/hooks';
import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';

import { GET_COUPONS, UPDATE_COUPON } from '../../graphql/coupons';

const initialFilter = {
	showInactive: false,
	search: '',
}

function Page () {
	setPageTitle('Produtos');
	const { url } = useRouteMatch();
	const selectedCompany = useSelectedCompany();

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

	const {
		data: { countCoupons = 0, coupons = [] } = {},
		loading: loadingCoupons,
		error: couponsError,
		called,
	} = useQuery(GET_COUPONS, {
		variables: {
			filter: { ...filter, companyId: selectedCompany },
			pagination
		}
	});

	const [updateCompany, { loading: loadingUpdating }] = useMutation(UPDATE_COUPON);

	if (couponsError) return <ErrorBlock error={getErrors(couponsError)} />
	if (loadingCoupons && !called) return (<LoadingBlock />);

	return (
		<Fragment>
			<Content>
				{loadingCoupons ? <LoadingBlock /> :
					<Block>
						<BlockHeader>
							<BlockTitle>Cupons</BlockTitle>
							<Button size='small' variant="contained" color='primary' to={`${url}/nova`} component={Link}>Adicionar</Button> {loadingUpdating && <CircularProgress />}
							<NumberOfRows>{countCoupons} cupons</NumberOfRows>
						</BlockHeader>
						<Paper>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell style={{ width: 30, paddingLeft: 30 }}></TableCell>
										<TableCell>Nome</TableCell>
										<TableCell>Valor</TableCell>
										<TableCell>Inicia em</TableCell>
										<TableCell>Expira em</TableCell>
										<TableCell>Criada em</TableCell>
										<TableCell style={{ width: 100 }}>Ações</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{coupons.map(row => (
										<TableRow key={row.id}>
											<TableCell style={{ width: 30, paddingLeft: 30, paddingRight: 10 }}><Avatar alt={row.name} src={row.image} /></TableCell>
											<TableCell>{row.name}</TableCell>
											<TableCell>{row.valueType === 'percentage'
												? numeral(row.value/100).format('0,0.00%')
												: numeral(row.value).format('$0,0.00')
											}</TableCell>
											<TableCell>{moment(row.startsAt).format('DD/MM/YYYY HH:mm')}</TableCell>
											<TableCell>{moment(row.expiresAt).format('DD/MM/YYYY HH:mm')}</TableCell>
											<TableCell>{moment(row.createdAt).format('DD/MM/YYYY')}</TableCell>
											<TableCell>
												{Boolean(row.masterOnly) && (
													<>
														<IconButton disabled={loadingUpdating} component={Link} to={`${url}/alterar/${row.id}`}>
															<Icon path={mdiPencil} size={1} color='#363E5E' />
														</IconButton>
														<Switch
															disabled={loadingUpdating}
															checked={row.active}
															onChange={()=>updateCompany({ variables: { id: row.id, data: { active: !row.active } } }) }
															value="checkedB"
															size='small'
															color='primary'
															inputProps={{ 'aria-label': 'primary checkbox' }}
														/>
													</>
												)}
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
								count={countCoupons}
								rowsPerPage={pagination.rowsPerPage}
								page={pagination.page}
								onChangePage={(e, newPage)=>{setPagination({ ...pagination, page: newPage })}}
								onChangeRowsPerPage={(e)=>{setPagination({ ...pagination, page: 0, rowsPerPage: e.target.value });}}
							/>
						</Paper>
						<NumberOfRows>{countCoupons} cupons</NumberOfRows>
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