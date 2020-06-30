import React, { useEffect, useState } from 'react'

import { Card, CardContent, Typography } from '@material-ui/core';
import moment from 'moment';
import { VictoryChart, VictoryLine, VictoryScatter, VictoryAxis } from 'victory';

import chartTheme from '../../../../layout/chartTheme';

function arrangeData(deliveries, period) {
	return new Promise((resolve, reject)=>{
		try {
			// hidratate period
			const start = moment(period.start);
			const end = moment(period.end);
			const data = [];

			for (let day=start.clone(); day.isSameOrBefore(end, 'date'); day.add(1, 'day')) {
				const dateString = day.toDate();
				const ordersInDate = deliveries.filter(delivery => moment(delivery.createdAt).isSame(day, 'date'));
				const countOrders = ordersInDate.length;
				data.push({ x: dateString, y: countOrders, label: countOrders });
			}
			
			return resolve(data);
		} catch (err) {
			return reject(err)
		}
	})
}

export default function ChartDays({ deliveries, period }) {
	const [chartData, setChartData] = useState();

	useEffect(()=>{
		if (!deliveries || !period) return;
		
		arrangeData(deliveries, period)
			.then((data)=>{
				setChartData(data);
			});
	}, [deliveries, period])

	return (
		<Card>
			<CardContent>
				<Typography style={{ fontSize: 20, fontWeight: 'bold' }} color="primary">Entregas / dias</Typography>
				<VictoryChart
					theme={chartTheme}
				>
					<VictoryAxis tickFormat={(value)=>moment(value).format('DD/MM')} />
					<VictoryAxis dependentAxis />
					<VictoryLine data={chartData} />
					<VictoryScatter data={chartData} />
				</VictoryChart>
			</CardContent>
		</Card>
	)
}
