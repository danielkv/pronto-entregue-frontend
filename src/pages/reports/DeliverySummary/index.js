import React from 'react';

import { useQuery } from '@apollo/react-hooks';
import { Grid, Container } from '@material-ui/core';

import { LoadingBlock } from '../../../layout/blocks';
import ChartDays from './Charts/days';
import ChartDaysOfWeek from './Charts/daysOfWeek';
import ChartHours from './Charts/hours';
import Summary from './Summaries';

import { GET_DELIVERIES } from '../../../graphql/deliveries';

export default function DeliverySummary ({ period, filter }) {
	const { data: { deliveries = [] }={}, loading: loadingDeliveries } = useQuery(GET_DELIVERIES, { variables: { filter }, fetchPolicy: 'cache-and-network' })

	if (loadingDeliveries && !deliveries) return <LoadingBlock />
	if (!deliveries) return false;
	
	return (
		<Container maxWidth={false}>
			{loadingDeliveries
				? <LoadingBlock />
				: (<>
					<Summary deliveries={deliveries} />
					<Grid container spacing={6}>
						<Grid item sm={6}>
							<ChartDays deliveries={deliveries} period={period} />
						</Grid>
						<Grid item sm={6}>
							<ChartDaysOfWeek deliveries={deliveries} period={period} />
						</Grid>
						<Grid item sm={6}>
							<ChartHours deliveries={deliveries} period={period} />
						</Grid>
					</Grid>
				</>
				)}
			
		</Container>
	)
}