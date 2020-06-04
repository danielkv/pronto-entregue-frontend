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

			for (let day=0; day <= 6; day++) {
				const dateString = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][day];
				const ordersInDate = orders.filter(order => moment(order.createdAt).format('d') === day.toString());
				const countOrders = ordersInDate.length;
				data.push({ x: dateString, y: countOrders, label: countOrders });
			}

			return resolve(data);
		} catch (err) {
			return reject(err)
		}
	})
}
	
export default function ChartDaysOfWeek({ report }) {
	const [chartData, setChartData] = useState(null);

	useEffect(()=>{
		arrangeData(report)
			.then((data)=>{
				setChartData(data);
			});
	}, [report])

	if (!chartData) return false;

	return (
		<Card>
			<CardContent>
				<Typography style={{ fontSize: 20, fontWeight: 'bold' }} color="primary">Pedidos / dias da semana</Typography>
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
