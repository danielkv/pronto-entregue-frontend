import React, { useEffect, useState } from 'react'

import { Card, CardContent, Typography } from '@material-ui/core';
import moment from 'moment';
import { VictoryChart, VictoryLine, VictoryScatter, VictoryAxis } from 'victory';

import chartTheme from '../../../../layout/chartTheme';

function arrangeData(report, period) {
	return new Promise((resolve, reject)=>{
		try {
			// get orders only
			const orders = report.companies.reduce((allOrders, company)=>[...allOrders, ...company.orders], []);

			// hidratate period
			const start = moment(period.start);
			const end = moment(period.end);
			const data = [];

			for (let day=start.clone(); day.isSameOrBefore(end, 'date'); day.add(1, 'day')) {
				const dateString = day.format('DD');
				const ordersInDate = orders.filter(order => moment(order.createdAt).isSame(day, 'date'));
				const countOrders = ordersInDate.length;
				data.push({ x: dateString, y: countOrders, label: countOrders });
			}
			
			return resolve(data);
		} catch (err) {
			return reject(err)
		}
	})
}

export default function ChartDays({ report, period }) {
	const [chartData, setChartData] = useState();

	useEffect(()=>{
		if (!report.companies.length || !period) return;
		
		arrangeData(report, period)
			.then((data)=>{
				setChartData(data);
			});
	}, [report, period])

	return (
		<Card>
			<CardContent>
				<Typography style={{ fontSize: 20, fontWeight: 'bold' }} color="primary">Pedidos / dias</Typography>
				<VictoryChart
					theme={chartTheme}
				>
					<VictoryAxis />
					<VictoryAxis dependentAxis />
					<VictoryLine data={chartData} />
					<VictoryScatter data={chartData} />
				</VictoryChart>
			</CardContent>
		</Card>
	)
}
