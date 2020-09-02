import React, { useState } from 'react';
import { Link, Redirect, Route, useRouteMatch } from 'react-router-dom';

import { useQuery } from '@apollo/react-hooks';
import DateFnsUtils from '@date-io/date-fns';
import { Grid, Button, CircularProgress, Container, List, ListItem, ListItemText, Paper, Divider, TextField, MenuItem, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import brLocale from 'date-fns/locale/pt-BR';
import moment from 'moment';

import CompanyAutoComplete from '../../components/CompanyAutoComplete';


import { useLoggedUserRole, useSelectedCompany } from '../../controller/hooks';
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

function sanitizePeriod(period) {
	return {
		'$between': [period.start.valueOf(), period.end.valueOf()]
	}
}

const initialPeriod = 'thisMonth';

export default function Reports (props) {
	setPageTitle('Relatórios');
	const { path, url } = useRouteMatch();
	const [periodSelected, setPeriodSelected] = useState('thisMonth');
	const userRole = useLoggedUserRole()
	const selectedCompany = useSelectedCompany();

	function isSelected(location) {
		const currentLocation = props.location.pathname.substr(1).split('/')[2];
		return currentLocation === location ? true : false;
	}

	const [period, setPeriod] = useState(()=>definePeriod(initialPeriod));
	const [companies, setCompanies] = useState([]);
	const [filter, setFilter] = useState({
		createdAt: sanitizePeriod(definePeriod(initialPeriod)),
		status: ['waiting', 'preparing', 'waitingPickUp', 'waitingDelivery', 'delivering', 'delivered']
	});

	const {
		data: { companiesReport = null } = {},
		loading: loadingReport,
	} = useQuery(GET_COMPANIES_REPORT, { variables: { filter, companiesIds: userRole === 'master' ? companies : [selectedCompany] } });

	function handleChangePeriod(e) {
		const value = e.target.value;
		
		const period = definePeriod(value);

		setPeriod(period)
		setFilter({ ...filter, createdAt: sanitizePeriod(period) });

		setPeriodSelected(value);
	}

	function handleChange (e, newValue) {
		const name = e.target.name;
		if (newValue)
			setFilter({ ...filter, status: [...filter.status, name] })
		else {
			const newStatus = filter.status.filter(s => s !== name);
			setFilter({ ...filter, status: newStatus });
		}
	}

	return (
		<Container maxWidth={false}>
			<MuiPickersUtilsProvider utils={DateFnsUtils} locale={brLocale}>
				<Grid container spacing={6}>
					{userRole === 'master' && <Grid item>
						<CompanyAutoComplete setCompanies={setCompanies} />
					</Grid>}
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
							onClick={()=>setFilter({ ...filter, createdAt: sanitizePeriod(period) })}
						>
							Filtrar
						</Button>
						{loadingReport && <CircularProgress />}
					</Grid>
				</Grid>
				<Grid container spacing={6}>
					<Grid item sm={12}>
						<div>
							<FormGroup style={{ display: 'flex', flexDirection: 'row' }}>
								<FormControlLabel
									control={<Checkbox onChange={handleChange} checked={filter.status.includes('waiting')} name="waiting" />}
									label="Aguardando"
								/>
								<FormControlLabel
									control={<Checkbox onChange={handleChange} checked={filter.status.includes('preparing')} name="preparing" />}
									label="Preparando"
								/>
								<FormControlLabel
									control={<Checkbox onChange={handleChange} checked={filter.status.includes('waitingDelivery')} name="waitingDelivery" />}
									label="Aguardando entregador"
								/>
								<FormControlLabel
									control={<Checkbox onChange={handleChange} checked={filter.status.includes('waitingPickUp')} name="waitingPickUp" />}
									label="Aguardando retirada"
								/>
								<FormControlLabel
									control={<Checkbox onChange={handleChange} checked={filter.status.includes('delivering')} name="delivering" />}
									label="A caminho"
								/>
								<FormControlLabel
									control={<Checkbox onChange={handleChange} checked={filter.status.includes('delivered')} name="delivered" />}
									label="Entregue"
								/>
								<FormControlLabel
									control={<Checkbox onChange={handleChange} checked={filter.status.includes('canceled')} name="canceled" />}
									label="Cancelado"
								/>
							</FormGroup>
						</div>
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
							{userRole === 'master' && <ListItem button component={Link} selected={isSelected('empresas')} to={`${url}/empresas`}>
								<ListItemText primary="Lista de empresas" />
							</ListItem>}
							<ListItem button component={Link} selected={isSelected('pedidos')} to={`${url}/pedidos`}>
								<ListItemText primary="Lista de pedidos" />
							</ListItem>
							{userRole === 'master' &&
								<>
									<Divider />
									<ListItem button component={Link} selected={isSelected('resumo-entregas')} to={`${url}/resumo-entregas`}>
										<ListItemText primary="Resumo de entregas" />
									</ListItem>
									<ListItem button component={Link} selected={isSelected('entregadores')} to={`${url}/entregadores`}>
										<ListItemText primary="Entregadores" />
									</ListItem>
								</>}
						</List>
					</Grid>
					<Grid item sm={10}>
						<Redirect from="/" to={`${url}/resumo`} />
						<Route path={`${path}/resumo`} component={(props)=><Summary {...props} report={companiesReport} period={period} />} />
						{userRole === 'master' && <Route path={`${path}/empresas`} component={(props)=><ListCompanies {...props} report={companiesReport} period={period} />} />}
						<Route path={`${path}/pedidos`} component={(props)=><ListOrders {...props} report={companiesReport} period={period} />} />
						
						<Route path={`${path}/resumo-entregas`} component={(props)=><DeliverySummary {...props} report={companiesReport} period={period} filter={filter} />} />
						<Route path={`${path}/entregadores`} component={(props)=><ListDeliveryMen {...props} report={companiesReport} period={period} filter={filter} />} />
					</Grid>
				</Grid>
			}
		</Container>
	)
}