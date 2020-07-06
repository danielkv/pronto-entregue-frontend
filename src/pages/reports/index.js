import React, { useState } from 'react';
import { Link, Redirect, Route, useRouteMatch } from 'react-router-dom';

import { useQuery } from '@apollo/react-hooks';
import DateFnsUtils from '@date-io/date-fns';
import { Grid, Button, CircularProgress, Container, List, ListItem, ListItemText, Paper, Divider, TextField, MenuItem } from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import brLocale from 'date-fns/locale/pt-BR';
import moment from 'moment';


import { setPageTitle } from '../../utils';
import DeliverySummary from './DeliverySummary';
import ListCompanies from './ListCompanies';
import ListDeliveryMen from './ListDeliveryMen';
import ListOrders from './listOrders';
import Summary from './Summary';

import { GET_COMPANIES_REPORT } from '../../graphql/report';

function definePeriod(value) {
	let period = {}

	switch(value) {
		case 'lastMonth':
			period = {
				start: moment().subtract(1, 'month').startOf('month'),
				end: moment().subtract(1, 'month').endOf('month'),
			}
			break;
		case 'last3Months':
			period = {
				start: moment().subtract(3, 'month').startOf('month'),
				end: moment().endOf('month'),
			}
			break;
		case 'thisWeek':
			period = {
				start: moment().startOf('week'),
				end: moment().endOf('week'),
			}
			break;
		case 'lastWeek':
			period = {
				start: moment().subtract(1, 'week').startOf('week'),
				end: moment().subtract(1, 'week').endOf('week'),
			}
			break;
		case 'thisMonth':
		default:
			period = {
				start: moment().startOf('month'),
				end: moment().endOf('month'),
			}
			break;
	}

	return period;
}

const initialPeriod = 'thisMonth';

export default function Reports (props) {
	setPageTitle('Relatórios');
	const { path, url } = useRouteMatch();
	const [periodSelected, setPeriodSelected] = useState('thisMonth');

	function isSelected(location) {
		const currentLocation = props.location.pathname.substr(1).split('/')[2];
		return currentLocation === location ? true : false;
	}

	const [filter, setFilter] = useState({ period: definePeriod(initialPeriod) });
	const [period, setPeriod] = useState(()=>definePeriod(initialPeriod));

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

	function handleChangePeriod(e) {
		const value = e.target.value;
		
		const period = definePeriod(value);

		setPeriod(period)
		setFilter({ ...filter, period: sanitizePeriod(period) });

		setPeriodSelected(value);
	}

	return (
		<Container maxWidth={false}>
			<MuiPickersUtilsProvider utils={DateFnsUtils} locale={brLocale}>
				<Grid container spacing={6}>
					<Grid item>
						<TextField label='Período' select value={periodSelected} onChange={handleChangePeriod}>
							<MenuItem value='thisMonth'>Este mês</MenuItem>
							<MenuItem value='lastMonth'>Mês anterior</MenuItem>
							<MenuItem value='last3Months'>Últimos 3 meses</MenuItem>
							<MenuItem value='thisWeek'>Essa semana</MenuItem>
							<MenuItem value='lastWeek'>Semana passada</MenuItem>
							<MenuItem value='custom'>Personalizar</MenuItem>
						</TextField>
					</Grid>
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
							<Divider />
							<ListItem button component={Link} selected={isSelected('resumo-entregas')} to={`${url}/resumo-entregas`}>
								<ListItemText primary="Resumo de entregas" />
							</ListItem>
							<ListItem button component={Link} selected={isSelected('entregadores')} to={`${url}/entregadores`}>
								<ListItemText primary="Entregadores" />
							</ListItem>
						</List>
					</Grid>
					<Grid item sm={10}>
						<Redirect from="/" to={`${url}/resumo`} />
						<Route path={`${path}/resumo`} component={(props)=><Summary {...props} report={companiesReport} period={filter.period} />} />
						<Route path={`${path}/empresas`} component={(props)=><ListCompanies {...props} report={companiesReport} period={filter.period} />} />
						<Route path={`${path}/pedidos`} component={(props)=><ListOrders {...props} report={companiesReport} period={filter.period} />} />
						
						<Route path={`${path}/resumo-entregas`} component={(props)=><DeliverySummary {...props} report={companiesReport} period={filter.period} />} />
						<Route path={`${path}/entregadores`} component={(props)=><ListDeliveryMen {...props} report={companiesReport} period={filter.period} />} />
					</Grid>
				</Grid>
			}
		</Container>
	)
}