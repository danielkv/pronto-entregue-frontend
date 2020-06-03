import React, { useState } from 'react';

import { useQuery } from '@apollo/react-hooks';
import DateFnsUtils from '@date-io/date-fns';
import { Grid, Button, Typography, Card, CardContent, CircularProgress, Container } from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import brLocale from 'date-fns/locale/pt-BR';
import moment from 'moment';
import numeral from 'numeral';

import { setPageTitle } from '../../utils';

import { GET_COMPANIES_REPORT } from '../../graphql/report';

const initialFilter = {
	period: {
		start: moment().subtract(1, 'month').startOf('month'),
		end: moment().subtract(1, 'month').endOf('month'),
	}
}

export default function Reports ({ match: { url } }) {
	setPageTitle('Relatórios');
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

			{!loadingReport &&
				<>
					<Grid spacing={5} container>
						<Grid item sm={4} lg={2}>
							<Card style={{ height: 110 }} variant='outlined'>
								<CardContent>
									<Typography style={{ fontSize: 13 }} color="textSecondary">Estabelecimentos</Typography>
									<Typography style={{ fontWeight: 'bold', fontSize: 16 }} color='Primary'>{companiesReport.companies.length}</Typography>
									<Typography style={{ fontSize: 13 }} color="textSecondary">Pedidos</Typography>
									<Typography style={{ fontWeight: 'bold', fontSize: 16 }} color='Primary'>{companiesReport.countOrders}</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item sm={4} lg={2}>
							<Card style={{ height: 110 }} variant='outlined'>
								<CardContent>
									<Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>Ticket médio</Typography>
									<Typography style={{ fontWeight: 'bold', fontSize: 18, color: '#333' }} gutterBottom>{numeral(companiesReport.revenue/companiesReport.countOrders).format('$0,00.00')}</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item sm={4} lg={2}>
							<Card style={{ height: 110 }} variant='outlined'>
								<CardContent>
									<Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>Faturamento do período</Typography>
									<Typography style={{ fontWeight: 'bold', fontSize: 18, color: '#333' }}>{numeral(companiesReport.revenue).format('$0,00.00')}</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item sm={4} lg={2}>
							<Card style={{ height: 110 }} variant='outlined'>
								<CardContent>
									<Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>Créditos utilizados</Typography>
									<Typography style={{ fontWeight: 'bold', fontSize: 18, color: '#333' }} >{numeral(companiesReport.credits).format('$0,00.00')}</Typography>
									<Typography style={{ fontSize: 13 }} color="textSecondary">Valor em créditos (não taxado)</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item sm={4} lg={2}>
							<Card style={{ height: 110 }} variant='outlined'>
								<CardContent>
									<Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>Valor taxável</Typography>
									<Typography style={{ fontWeight: 'bold', fontSize: 18, color: '#333' }}>{numeral(companiesReport.taxable).format('$0,00.00')}</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item sm={4} lg={2}>
							<Card style={{ height: 110 }} variant='outlined'>
								<CardContent>
									<Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>Taxa</Typography>
									<Typography style={{ fontWeight: 'bold', fontSize: 18, color: '#333' }}>{numeral(companiesReport.tax).format('$0,00.00')}</Typography>
									<Typography style={{ fontSize: 13 }} color="textSecondary">Mensalidades inclusas*</Typography>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</>
			}
		</Container>
	)
}