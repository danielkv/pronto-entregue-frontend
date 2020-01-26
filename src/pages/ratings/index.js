import React, { useState, Fragment, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { useQuery } from '@apollo/react-hooks';
import { TextField, ButtonGroup, Button, Card, CardContent, Typography, Divider, TablePagination } from '@material-ui/core';
import {  mdiFilter, mdiStar } from '@mdi/js';
import Icon from '@mdi/react';
import 'moment/locale/pt-br';
import moment from 'moment';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, FormRow, FieldControl, NumberOfRows, SidebarContainer, Sidebar } from '../../layout/components';

import { useSelectedCompany } from '../../controller/hooks';
import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';

import { GET_COMPANY_RATINGS } from '../../graphql/ratings';


const initialFilter = {
	showInactive: false,
	search: '',
}

function Page () {
	setPageTitle('Empresas');

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
		data: { company: { countRatings = 0, ratings = [] } = {} } = {},
		loading: loadingRatings,
		error,
		called,
	} = useQuery(GET_COMPANY_RATINGS, { variables: { id: selectedCompany, filter, pagination } });

	function renderStars(rate) {
		const colors = [];
		for (let i=0; i<=5; i++) {
			colors.push(i >= rate ? '#999999': '#D41450')
		}
		return (
			<div style={{ marginLeft: 10 }} title={`${rate} ${rate > 1 ? 'estrelas' : 'estrela'}`}>
				<Icon path={mdiStar} size='18' color={colors[0]} />
				<Icon path={mdiStar} size='18' color={colors[1]} />
				<Icon path={mdiStar} size='18' color={colors[2]} />
				<Icon path={mdiStar} size='18' color={colors[3]} />
				<Icon path={mdiStar} size='18' color={colors[4]} />
			</div>
		);
	}

	if (error) return <ErrorBlock error={getErrors(error)} />
	if (loadingRatings && !called) return (<LoadingBlock />);

	return (
		<Fragment>
			<Content>
				{loadingRatings ? <LoadingBlock /> :
					<Block>
						<BlockHeader>
							<BlockTitle>Comentários</BlockTitle>
						</BlockHeader>
						<TablePagination
							component="div"
							backIconButtonProps={{
								'aria-label': 'previous page',
							}}
							nextIconButtonProps={{
								'aria-label': 'next page',
							}}
							count={countRatings}
							rowsPerPage={pagination.rowsPerPage}
							page={pagination.page}
							onChangePage={(e, newPage)=>{setPagination({ ...pagination, page: newPage })}}
							onChangeRowsPerPage={(e)=>{setPagination({ ...pagination, page: 0, rowsPerPage: e.target.value });}}
						/>
						{ratings.map((rating, index)=>(
							<Card style={{ marginBottom: 10 }} key={index}>
								<CardContent>
									<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '8px 0' }}>
										<Typography><b>{rating.user.fullName}</b> para pedido</Typography>
										<Button size='small' component={Link} to={`/pedidos/alterar/${rating.order.id}`}>
											#{rating.order.id}
										</Button>
									</div>
									<Divider />
									<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '8px 0' }}>
										<Typography variant='caption'>{moment(rating.createdAt).fromNow()}</Typography>
										{renderStars(rating.rate)}
									</div>
									<Typography variant='body1'>{rating.comment}</Typography>
								</CardContent>
							</Card>
						))}
						<TablePagination
							component="div"
							backIconButtonProps={{
								'aria-label': 'previous page',
							}}
							nextIconButtonProps={{
								'aria-label': 'next page',
							}}
							count={countRatings}
							rowsPerPage={pagination.rowsPerPage}
							page={pagination.page}
							onChangePage={(e, newPage)=>{setPagination({ ...pagination, page: newPage })}}
							onChangeRowsPerPage={(e)=>{setPagination({ ...pagination, page: 0, rowsPerPage: e.target.value });}}
						/>
					</Block>}
			</Content>
			<SidebarContainer>
				<Block>
					<BlockHeader>
						<BlockTitle><Icon path={mdiFilter} size='18' color='#D41450' /> Filtros</BlockTitle>
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
											<Button type='submit' variant="contained" color='primary'>Aplicar</Button>
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