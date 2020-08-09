import React, { useState, useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks';
import { Grid } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { motion } from 'framer-motion'

import { Block, BlockHeader, BlockTitle } from '../../layout/components';

import { LoadingBlock } from '../../layout/blocks';
import DeliveryManItem from './DeliveryManItem';

import { GET_DELIVERY_MEN } from '../../graphql/deliveryMan';

export default function Deliveries() {
	const [pagination, setPagination] = useState({
		page: 0,
		rowsPerPage: 8
	})
	const [firstLoaded, setFirstLoaded] = useState(false);
	const { data: { deliveryMen = [], countDeliveryMen = 0 } = {}, loading: loadingDeliveryMen, subscribeToMore = null } = useQuery(GET_DELIVERY_MEN, { notifyOnNetworkStatusChange: true, fetchPolicy: 'cache-and-network', variables: { pagination } });

	/* useEffect(()=>{
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
	}, [subscribeToMore]) */

	useEffect(()=>{
		if (loadingDeliveryMen && firstLoaded) setFirstLoaded(false);
		if (!loadingDeliveryMen && deliveryMen.length && !firstLoaded) setFirstLoaded(true);
	}, [deliveryMen, firstLoaded, loadingDeliveryMen])

	if (loadingDeliveryMen) return <LoadingBlock />

	return (
		<div style={{ flex: 1 }}>
			<Block>
				<BlockHeader>
					<BlockTitle>Entregadores</BlockTitle>
					<Pagination count={Math.ceil(countDeliveryMen/pagination.rowsPerPage)} page={pagination.page+1} onChange={(e, page)=>setPagination({ ...pagination, page: page-1 })} />
				</BlockHeader>
				
				<Grid container spacing={6}>
					{deliveryMen.map((delivery, index) => {
						return (<Grid
							key={delivery.id}
							component={motion.div}
							item
							xl={3} lg={4} md={6} sm={12}

							initial={firstLoaded ? { maxWidth: 0, opacity: 0 } : false}
							animate={{ maxWidth: 500, opacity: 1 }}
							transition={{ duration: .8 }}
						>
							<DeliveryManItem orderIndex={index} item={delivery} />
						</Grid>)
						
					})}
				</Grid>
				
				<div style={{ marginTop: 15 }}>
					<Pagination count={Math.ceil(countDeliveryMen/pagination.rowsPerPage)} page={pagination.page+1} onChange={(e, page)=>setPagination({ ...pagination, page: page-1 })} />
				</div>
			</Block>
		</div>
	)
}
