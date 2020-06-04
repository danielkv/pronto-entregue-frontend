import React, { useEffect, useState } from 'react'

import { Card, CardContent, Typography } from '@material-ui/core';
import moment from 'moment';
import { VictoryChart, VictoryAxis, VictoryBar } from 'victory';

import chartTheme from '../../../../layout/chartTheme';

function arrangeData(report) {
	return new Promise((resolve, reject)=>{
		try {
			// get orders only
			const orders = report.companies.reduce((allOrders, company)=>[...allOrders, ...company.orders], []);

			// rearrenga data
			const data = [];

			for (let hour=0; hour <= 23; hour++) {
				const dateString = hour < 10 ? '0' + hour : `${hour}`;
				const ordersInDate = orders.filter(order => moment(order.createdAt).format('H') === hour.toString());
				const countOrders = ordersInDate.length;
				data.push({ x: dateString, y: countOrders, label: countOrders });
			}

			console.log(data);

			return resolve(data);
		} catch (err) {
			return reject(err)
		}
	})
}

export default function ChartHours({ report }) {
	const [chartData, setChartData] = useState();

	useEffect(()=>{
		arrangeData(report)
			.then((data)=>{
				setChartData(data);
			});
	}, [report])

	return (
		<Card>
			<CardContent>
				<Typography style={{ fontSize: 20, fontWeight: 'bold' }} color="primary">Pedidos / Horário</Typography>
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
