import React from 'react'

import { Grid, Card, CardContent, Typography } from '@material-ui/core'
import numeral from 'numeral';


export default function Summary({ report }) {
	return (
		<>
			<Grid spacing={5} container>
				<Grid item sm={4} lg={2}>
					<Card style={{ height: 110 }} variant='outlined'>
						<CardContent>
							<Typography style={{ fontSize: 13 }} color="textSecondary">Estabelecimentos</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 16 }} color='primary'>{report.companies.length}</Typography>
							<Typography style={{ fontSize: 13 }} color="textSecondary">Pedidos</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 16 }} color='primary'>{report.countOrders}</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item sm={4} lg={2}>
					<Card style={{ height: 110 }} variant='outlined'>
						<CardContent>
							<Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>Ticket médio</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 18, color: '#333' }} gutterBottom>{numeral(report.revenue/report.countOrders).format('$0,00.00')}</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item sm={4} lg={2}>
					<Card style={{ height: 110 }} variant='outlined'>
						<CardContent>
							<Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>Faturamento do período</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 18, color: '#333' }}>{numeral(report.revenue).format('$0,00.00')}</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item sm={4} lg={2}>
					<Card style={{ height: 110 }} variant='outlined'>
						<CardContent>
							<Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>Créditos utilizados</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 18, color: '#333' }} >{numeral(report.credits).format('$0,00.00')}</Typography>
							<Typography style={{ fontSize: 13 }} color="textSecondary">Valor em créditos (não taxado)</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item sm={4} lg={2}>
					<Card style={{ height: 110 }} variant='outlined'>
						<CardContent>
							<Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>Valor taxável</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 18, color: '#333' }}>{numeral(report.taxable).format('$0,00.00')}</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item sm={4} lg={2}>
					<Card style={{ height: 110 }} variant='outlined'>
						<CardContent>
							<Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>Taxa</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 18, color: '#333' }}>{numeral(report.tax).format('$0,00.00')}</Typography>
							<Typography style={{ fontSize: 13 }} color="textSecondary">Mensalidades inclusas*</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</>
	)
}
