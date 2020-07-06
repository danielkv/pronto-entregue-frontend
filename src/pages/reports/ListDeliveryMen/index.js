import React, { useState, useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Container, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import numeral from 'numeral';

import { LoadingBlock } from '../../../layout/blocks';

import { GET_DELIVERY_MEN } from '../../../graphql/deliveries';

function hidratateDeliveryMen(users) {
	return users.map(user=>{
		const countDeliveries = user.deliveries.length
		const deliveriesValue = user.deliveries.reduce((total, delivery)=>delivery.value+total, 0);
		const avarageValue = deliveriesValue / countDeliveries;

		return {
			avarageValue,
			countDeliveries,
			deliveriesValue,
			...user
		}
	});
}

export default function ListCompanies({ period }) {

	const [filter, setFilter] = useState({ status: ['waiting', 'waitingDelivery', 'delivering', 'delivered'] });

	useEffect(()=>{
		setFilter(f => ({ ...f, createdAt: { '$between': [period.start, period.end] } }))
	}, [period, setFilter])

	const { data: { users = [] }={}, loading: loadingDeliveries } = useQuery(GET_DELIVERY_MEN, { variables: { userFilter: { role: 'deliveryMan' }, deliveryFilter: filter }, fetchPolicy: 'cache-and-network' })

	function handleChange (e, newValue) {
		const name = e.target.name;
		if (newValue)
			setFilter({ ...filter, status: [...filter.status, name] })
		else {
			const newStatus = filter.status.filter(s => s !== name);
			setFilter({ ...filter, status: newStatus });
		}
	}

	if (loadingDeliveries && !users) return <LoadingBlock />
	if (!users) return false;
	
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
			<Paper>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell style={{ width: 30, paddingRight: 10 }}></TableCell>
							<TableCell>Entregador</TableCell>
							<TableCell>Número de entregas</TableCell>
							<TableCell>Média</TableCell>
							<TableCell>Faturamento</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{hidratateDeliveryMen(users).map(row => (
							<TableRow key={row.id}>
								<TableCell style={{ width: 30, paddingLeft: 40, paddingRight: 10 }}><Avatar alt={row.fullName} src={row.image} /></TableCell>
								<TableCell>{row.fullName}</TableCell>
								<TableCell>{row.countDeliveries}</TableCell>
								<TableCell>{numeral(row.avarageValue).format('$0,0.00')}</TableCell>
								<TableCell>{numeral(row.deliveriesValue).format('$0,0.00')}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Paper>
		</Container>
	)
}
