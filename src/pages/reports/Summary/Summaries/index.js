import React from 'react'

import { Grid, Card, CardContent, Typography, Tooltip } from '@material-ui/core'
import numeral from 'numeral';

import { useLoggedUserRole } from '../../../../controller/hooks';


export default function Summary({ report }) {
	const userRole = useLoggedUserRole()
	return (
		<>
			<Grid spacing={5} container>
				<Grid item sm={4} lg={2}>
					<Card style={{ height: 130 }} variant='outlined'>
						<CardContent>
							{userRole === 'master' &&
								<>
									<Typography style={{ fontSize: 13 }} color="textSecondary">Estabelecimentos</Typography>
									<Typography style={{ fontWeight: 'bold', fontSize: 16 }} color='primary'>{report.companies.length}</Typography>
								</>}
							<Typography style={{ fontSize: 13 }} color="textSecondary">Pedidos</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 16 }} color='primary'>{report.countOrders}</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item sm={4} lg={2}>
					<Card style={{ height: 130 }} variant='outlined'>
						<CardContent>
							<Typography style={{ fontSize: 14 }} color="textSecondary">Faturamento do período</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }} gutterBottom>{numeral(report.revenue).format('$0,00.00')}</Typography>
							<Typography style={{ fontSize: 14 }} color="textSecondary" >Ticket médio</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }}>{numeral(report.revenue/report.countOrders).format('$0,00.00')}</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item sm={4} lg={2}>
					<Card style={{ height: 130 }} variant='outlined'>
						<CardContent>
							<Typography style={{ fontSize: 14 }} color="textSecondary" >Cupons</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }} gutterBottom>{numeral(report.coupons).format('$0,00.00')}</Typography>
							<Typography style={{ fontSize: 14 }} color="textSecondary" >Créditos</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }} >{numeral(report.credits).format('$0,00.00')}</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item sm={4} lg={2}>
					<Card style={{ height: 130 }} variant='outlined'>
						<CardContent>
							<Tooltip title='Quantidade de entregas que o pronto entregue ficou responsável'>
								<Typography style={{ fontSize: 14 }} color="textSecondary">Entregas</Typography>
							</Tooltip>
							<Typography style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }}>{report.countPeDelivery}</Typography>
							<Typography style={{ fontSize: 14 }} color="textSecondary">Total</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }}>{numeral(report.deliveryPaymentValue).format('$0,00.00')}</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item sm={4} lg={2}>
					<Card style={{ height: 130 }} variant='outlined'>
						<CardContent>
							<Typography style={{ fontSize: 14 }} color="textSecondary">Valor taxável</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }} gutterBottom>{numeral(report.taxable).format('$0,00.00')}</Typography>
							<Typography style={{ fontSize: 14 }} color="textSecondary">Taxa</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }}>{numeral(report.tax).format('$0,00.00')}</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item sm={4} lg={2}>
					<Card style={{ height: 130 }} variant='outlined'>
						<CardContent>
							<Tooltip title='Valor estornado ao estabelecimento'>
								<Typography style={{ fontSize: 14 }} color="textSecondary">Repasse</Typography>
							</Tooltip>
							<Typography style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }}>{numeral(report.refund).format('$0,00.00')}</Typography>
							
							<Tooltip title='Valor que deve ser pago pelo estabelecimento'>
								<Typography style={{ fontSize: 14 }} color="textSecondary">Remuneração</Typography>
							</Tooltip>
							<Typography style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }}>{numeral(report.payment).format('$0,00.00')}</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</>
	)
}
