import React from 'react';

import { Grid, Container } from '@material-ui/core';

import ChartDays from './Charts/days';
import ChartDaysOfWeek from './Charts/daysOfWeek';
import ChartHours from './Charts/hours';
import Summary from './Summaries';


export default function Reports ({ report, period }) {

	if (!report) return false;
	
	return (
		<Container maxWidth={false}>
			
			<Summary report={report} />
			<Grid container spacing={6}>
				<Grid item sm={6}>
					<ChartDays report={report} period={period} />
				</Grid>
				<Grid item sm={6}>
					<ChartDaysOfWeek report={report} period={period} />
				</Grid>
				<Grid item sm={6}>
					<ChartHours report={report} period={period} />
				</Grid>
			</Grid>
			
		</Container>
	)
}