import React, { useState, Fragment, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableHead, TableRow, TableCell, IconButton, FormControlLabel, Switch, TablePagination, TextField, ButtonGroup, Button, Checkbox, FormControl, FormLabel , FormGroup, CircularProgress, Chip, Avatar } from '@material-ui/core';
import { mdiPencil, mdiFilter } from '@mdi/js';
import Icon from '@mdi/react';
import numeral from 'numeral';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, SidebarContainer, Sidebar } from '../../layout/components';

import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getTypeLabel } from '../../utils/campaign';
import { getErrors } from '../../utils/error';

import { GET_CAMPAIGNS, UPDATE_CAMPAIGN } from '../../graphql/campaigns';


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

	const {
		data: { countCampaigns = 0, campaigns = [] } = {},
		loading: loadingCampaigns,
		error: campaignsError,
		called,
	} = useQuery(GET_CAMPAIGNS, {
		variables: {
			filter,
			pagination
		}
	});

	const [updateCompany, { loading: loadingUpdating }] = useMutation(UPDATE_CAMPAIGN);

	if (campaignsError) return <ErrorBlock error={getErrors(campaignsError)} />
	if (loadingCampaigns && !called) return (<LoadingBlock />);

	return (
		<Fragment>
			<Content>
				{loadingCampaigns ? <LoadingBlock /> :
					<Block>
						<BlockHeader>
							<BlockTitle>Campanhas</BlockTitle>
							<Button size='small' variant="contained" color='secondary' to='/campanhas/nova' component={Link}>Adicionar</Button> {loadingUpdating && <CircularProgress />}
							<NumberOfRows>{countCampaigns} campanhas</NumberOfRows>
						</BlockHeader>
						<Paper>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell style={{ width: 30, paddingLeft: 30 }}></TableCell>
										<TableCell>Produto</TableCell>
										<TableCell>Tipo</TableCell>
										<TableCell>Valor</TableCell>
										<TableCell>Criada em</TableCell>
										<TableCell style={{ width: 100 }}>Ações</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{campaigns.map(row => (
										<TableRow key={row.id}>
											<TableCell style={{ width: 30, paddingLeft: 30, paddingRight: 10 }}><Avatar alt={row.name} src={row.image} /></TableCell>
											<TableCell>{row.name}</TableCell>
											<TableCell><Chip color='primary' label={getTypeLabel(row.type)} /></TableCell>
											<TableCell>{row.valueType === 'percentage'
												? numeral(row.value/100).format('0,0.00%')
												: numeral(row.value).format('$0,0.00')
											}</TableCell>
											<TableCell>{row.createdAt}</TableCell>
											<TableCell>
												{Boolean(row.masterOnly) && (
													<>
														<IconButton disabled={loadingUpdating} onClick={()=>{props.history.push(`/campanhas/alterar/${row.id}`)}}>
															<Icon path={mdiPencil} size={1} color='#363E5E' />
														</IconButton>
														<Switch
															disabled={loadingUpdating}
															checked={row.active}
															onChange={()=>updateCompany({ variables: { id: row.id, data: { active: !row.active } } }) }
															value="checkedB"
															size='small'
															color="secondary"
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
								count={countCampaigns}
								rowsPerPage={pagination.rowsPerPage}
								page={pagination.page}
								onChangePage={(e, newPage)=>{setPagination({ ...pagination, page: newPage })}}
								onChangeRowsPerPage={(e)=>{setPagination({ ...pagination, page: 0, rowsPerPage: e.target.value });}}
							/>
						</Paper>
						<NumberOfRows>{countCampaigns} campanhas</NumberOfRows>
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