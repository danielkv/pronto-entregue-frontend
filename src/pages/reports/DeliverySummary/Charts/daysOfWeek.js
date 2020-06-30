import React, { useEffect, useState } from 'react'

import { Card, CardContent, Typography } from '@material-ui/core';
import moment from 'moment';
import { VictoryChart, VictoryAxis, VictoryBar } from 'victory';

import chartTheme from '../../../../layout/chartTheme';

function arrangeData(deliveries) {
	return new Promise((resolve, reject)=>{
		try {
			// rearrenge data
			const data = [];

			for (let day=0; day <= 6; day++) {
				const dateString = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][day];
				const ordersInDate = deliveries.filter(delivery => moment(delivery.createdAt).format('d') === day.toString());
				const countOrders = ordersInDate.length;
				data.push({ x: dateString, y: countOrders, label: countOrders });
			}

			return resolve(data);
		} catch (err) {
			return reject(err)
		}
	})
}
	
export default function ChartDaysOfWeek({ deliveries }) {
	const [chartData, setChartData] = useState(null);

	useEffect(()=>{
		arrangeData(deliveries)
			.then((data)=>{
				setChartData(data);
			});
	}, [deliveries])

	if (!chartData) return false;

	return (
		<Card>
			<CardContent>
				<Typography style={{ fontSize: 20, fontWeight: 'bold' }} color="primary">Entregas / dias da semana</Typography>
				<VictoryChart
					theme={chartTheme}
					domainPadding={20}
				>
					<VictoryAxis />
					<VictoryAxis dependentAxis />
					<VictoryBar data={chartData} />
				</VictoryChart>
			</CardContent>
		</Card>
	)
}
