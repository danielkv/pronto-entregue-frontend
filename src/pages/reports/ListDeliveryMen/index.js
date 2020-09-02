import React from 'react'

import { useQuery } from '@apollo/react-hooks';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Container } from '@material-ui/core';
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

export default function ListCompanies({ filter }) {

	const { data: { users = [] }={}, loading: loadingDeliveries } = useQuery(GET_DELIVERY_MEN, { variables: { userFilter: { role: 'deliveryMan' }, deliveryFilter: filter }, fetchPolicy: 'cache-and-network' })


	if (loadingDeliveries && !users) return <LoadingBlock />
	if (!users) return false;
	
	return (
		<Container maxWidth={false}>
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
