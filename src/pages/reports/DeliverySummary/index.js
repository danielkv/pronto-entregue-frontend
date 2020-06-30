import React, { useState, useEffect } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { Grid, Container, FormControlLabel, Checkbox, FormGroup } from '@material-ui/core';

import { LoadingBlock } from '../../../layout/blocks';
import ChartDays from './Charts/days';
import ChartDaysOfWeek from './Charts/daysOfWeek';
import ChartHours from './Charts/hours';
import Summary from './Summaries';

import { GET_DELIVERIES } from '../../../graphql/deliveries';

export default function DeliverySummary ({ period }) {

	const [filter, setFilter] = useState({ status: ['waiting', 'waitingDelivery', 'delivering', 'delivered'] });

	useEffect(()=>{
		setFilter(f => ({ ...f, createdAt: { '$between': [period.start, period.end] } }))
	}, [period, setFilter])

	console.log(filter);

	const { data: { deliveries = [] }={}, loading: loadingDeliveries } = useQuery(GET_DELIVERIES, { variables: { filter }, fetchPolicy: 'cache-and-network' })

	function handleChange (e, newValue) {
		const name = e.target.name;
		if (newValue)
			setFilter({ ...filter, status: [...filter.status, name] })
		else {
			const newStatus = filter.status.filter(s => s !== name);
			setFilter({ ...filter, status: newStatus });
		}
	}

	if (loadingDeliveries && !deliveries) return <LoadingBlock />
	if (!deliveries) return false;
	
	return (
		<Container maxWidth={false}>

			<div>
				<FormGroup style={{ display: 'flex', flexDirection: 'row' }}>
					<FormControlLabel
						control={<Checkbox onChange={handleChange} checked={filter.status.includes('waiting')} name="waiting" />}
						label="Aguardando"
					/>
					<FormControlLabel
						control={<Checkbox onChange={handleChange} checked={filter.status.includes('waitingDelivery')} name="waitingDelivery" />}
						label="Aguardando entregador"
					/>
					<FormControlLabel
						control={<Checkbox onChange={handleChange} checked={filter.status.includes('delivering')} name="delivering" />}
						label="A caminho"
					/>
					<FormControlLabel
						control={<Checkbox onChange={handleChange} checked={filter.status.includes('delivered')} name="delivered" />}
						label="Entregue"
					/>
					<FormControlLabel
						control={<Checkbox onChange={handleChange} checked={filter.status.includes('canceled')} name="canceled" />}
						label="Cancelado"
					/>
				</FormGroup>
			</div>
			
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