import React from 'react'

import { Grid, Card, CardContent, Typography } from '@material-ui/core'
import numeral from 'numeral';


export default function Summary({ deliveries }) {

	const countDeliveries = deliveries.length;
	const totalValue = deliveries.reduce((total, delivery)=>delivery.value+total, 0);
	const avarageValue = totalValue / countDeliveries;

	return (
		<>
			<Grid spacing={5} container>
				<Grid item sm={4} lg={2}>
					<Card style={{ height: 130 }} variant='outlined'>
						<CardContent>
							<Typography style={{ fontSize: 13 }} color="textSecondary">Número de entregas</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 16 }} color='primary'>{countDeliveries}</Typography>
							{/* <Typography style={{ fontSize: 13 }} color="textSecondary">Pedidos</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 16 }} color='primary'>{report.countOrders}</Typography> */}
						</CardContent>
					</Card>
				</Grid>
				<Grid item sm={4} lg={2}>
					<Card style={{ height: 130 }} variant='outlined'>
						<CardContent>
							<Typography style={{ fontSize: 13 }} color="textSecondary">Valor total</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 16 }} color='primary'>{numeral(totalValue).format('$0,00.00')}</Typography>
							<Typography style={{ fontSize: 13 }} color="textSecondary">Ticket médio</Typography>
							<Typography style={{ fontWeight: 'bold', fontSize: 16 }} color='primary'>{numeral(avarageValue).format('$0,00.00')}</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</>
	)
}
