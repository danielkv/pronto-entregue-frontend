import React, { useState } from 'react';
import { Link, Redirect, Route, useRouteMatch } from 'react-router-dom';

import { useQuery } from '@apollo/react-hooks';
import DateFnsUtils from '@date-io/date-fns';
import { Grid, Button, CircularProgress, Container, List, ListItem, ListItemText, Paper } from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import brLocale from 'date-fns/locale/pt-BR';
import moment from 'moment';


import { setPageTitle } from '../../utils';
import ListCompanies from './ListCompanies';
import ListOrders from './listOrders';
import Summary from './Summary';

import { GET_COMPANIES_REPORT } from '../../graphql/report';

const initialFilter = {
	period: {
		start: moment().subtract(1, 'month').startOf('month'),
		end: moment().subtract(1, 'month').endOf('month'),
	}
}

export default function Reports (props) {
	setPageTitle('Relatórios');
	const { path, url } = useRouteMatch();

	function isSelected(location) {
		const currentLocation = props.location.pathname.substr(1).split('/')[2];
		return currentLocation === location ? true : false;
	}
	const [filter, setFilter] = useState(()=>initialFilter);

	const [period, setPeriod] = useState(()=>initialFilter.period);

	const {
		data: { companiesReport = null } = {},
		loading: loadingReport,
	} = useQuery(GET_COMPANIES_REPORT, { variables: { filter } });

	function sanitizePeriod(period) {
		return {
			start: period.start.valueOf(),
			end: period.end.valueOf()
		}
	}

	return (
		<Container maxWidth={false}>
			<MuiPickersUtilsProvider utils={DateFnsUtils} locale={brLocale}>
				<Grid container spacing={6}>
					<Grid item>
						<DatePicker
							ampm={false}
							variant='inline'
							format='dd/MM/yyyy'
							label="Início do periodo"
							value={period.start}
							onChange={(value)=>setPeriod({ ...period, start: value })}
						/>
					</Grid>
					<Grid item>
						<DatePicker
							ampm={false}
							variant='inline'
							format='dd/MM/yyyy'
							label="Fim do período"
							value={period.end}
							onChange={(value)=>setPeriod({ ...period, end: value })}
						/>
					</Grid>
					<Grid item>
						<Button
							variant='contained'
							onClick={()=>setFilter({ ...filter, period: sanitizePeriod(period) })}
						>
							Filtrar
						</Button>
						{loadingReport && <CircularProgress />}
					</Grid>
				</Grid>
			</MuiPickersUtilsProvider>

			{!(loadingReport && !companiesReport) &&
				<Grid container spacing={6}>
					<Grid item sm={2}>
						<List component={Paper}>
							<ListItem button component={Link} selected={isSelected('resumo')} to={`${url}/resumo`}>
								<ListItemText primary="Resumo" />
							</ListItem>
							<ListItem button component={Link} selected={isSelected('empresas')} to={`${url}/empresas`}>
								<ListItemText primary="Lista de empresas" />
							</ListItem>
							<ListItem button component={Link} selected={isSelected('pedidos')} to={`${url}/pedidos`}>
								<ListItemText primary="Lista de pedidos" />
							</ListItem>
						</List>
					</Grid>
					<Grid item sm={10}>
						<Redirect from="/" to={`${url}/resumo`} />
						<Route path={`${path}/resumo`} component={(props)=><Summary {...props} report={companiesReport} period={filter.period} />} />
						<Route path={`${path}/empresas`} component={(props)=><ListCompanies {...props} report={companiesReport} period={filter.period} />} />
						<Route path={`${path}/pedidos`} component={(props)=><ListOrders {...props} report={companiesReport} period={filter.period} />} />
					</Grid>
				</Grid>
			}
		</Container>
	)
}