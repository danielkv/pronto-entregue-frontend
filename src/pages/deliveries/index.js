import React, { useState, useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks';
import { Grid } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { motion } from 'framer-motion'

import { Block, BlockHeader, BlockTitle } from '../../layout/components';

import { LoadingBlock } from '../../layout/blocks';
import DeliveryItem from './DeliveryItem';

import { GET_DELIVERIES, UPDATE_DELIVERY_SUBSCRIPTION } from '../../graphql/deliveries';

export default function Deliveries() {
	const [pagination, setPagination] = useState({
		page: 0,
		rowsPerPage: 8
	})
	const [firstLoaded, setFisrtLoaded] = useState(false);
	const { data: { deliveries = [], countDeliveries = 0 } = {}, loading: loadingDeliveries, subscribeToMore = null } = useQuery(GET_DELIVERIES, { notifyOnNetworkStatusChange: true, fetchPolicy: 'cache-and-network', variables: { pagination } });

	useEffect(()=>{
		if (!subscribeToMore) return;
		
		const unsubscribe = subscribeToMore({
			document: UPDATE_DELIVERY_SUBSCRIPTION,
			updateQuery(prev, data) {
				const { subscriptionData: { data: { delivery = null } } } = data;
				if (!delivery) return prev;

				const deliveryFoundIndex = prev.deliveries.findIndex(d => d.id === delivery.id)

				if (deliveryFoundIndex < 0) {
					const newDelivery = { ...delivery }
					return { ...prev, deliveries: [newDelivery, ...prev.deliveries] }
				}
			}
		})

		return unsubscribe;
	}, [subscribeToMore])

	useEffect(()=>{
		if (loadingDeliveries && firstLoaded) setFisrtLoaded(false);
		if (!loadingDeliveries && deliveries.length && !firstLoaded) setFisrtLoaded(true);
	}, [deliveries, firstLoaded, loadingDeliveries])

	if (loadingDeliveries) return <LoadingBlock />

	return (
		<div style={{ flex: 1 }}>
			<Block>
				<BlockHeader>
					<BlockTitle>Entregas</BlockTitle>
					<Pagination count={Math.ceil(countDeliveries/pagination.rowsPerPage)} page={pagination.page+1} onChange={(e, page)=>setPagination({ ...pagination, page: page-1 })} />
				</BlockHeader>
						

				<Grid container spacing={6}>
					{deliveries.map((delivery, index) => {
						return (<Grid
							key={delivery.id}
							component={motion.div}
							item
							xl={3} lg={4} md={6} sm={12}

							initial={firstLoaded ? { maxWidth: 0, opacity: 0 } : false}
							animate={{ maxWidth: 500, opacity: 1 }}
							transition={{ duration: .8 }}
						>
							<DeliveryItem orderIndex={index} item={delivery} />
						</Grid>)
						
					})}
				</Grid>
				
				<div style={{ marginTop: 15 }}>
					<Pagination count={Math.ceil(countDeliveries/pagination.rowsPerPage)} page={pagination.page+1} onChange={(e, page)=>setPagination({ ...pagination, page: page-1 })} />
				</div>
			</Block>
		</div>
	)
}
