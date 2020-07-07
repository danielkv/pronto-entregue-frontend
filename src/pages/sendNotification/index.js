import React, { useState, useEffect } from 'react'

import { useQuery, useMutation } from '@apollo/react-hooks'
import { Grid,  } from '@material-ui/core'

import { LoadingBlock } from '../../layout/blocks'
import { setPageTitle } from '../../utils'
import NotificationForm from './NotificationForm'
import Segmentation from './Segmentation'

import { GET_COMPANIES } from '../../graphql/companies'
import { COUNT_USERS_TOKENS, SEND_NOTIFICATION } from '../../graphql/notifications'


export default function Deliveries() {
	const [filter, setFilter] = useState({});
	
	setPageTitle('Enviar notificação')

	const { data: { countTokensUsers = null } = {}, loading: loadingCount } = useQuery(COUNT_USERS_TOKENS, { variables: { filter } })
	const { data: { companies = [] } = {}, loading: loadingCompanies } = useQuery(GET_COMPANIES, { variables: { filter: {} } })

	const [sendNotification] = useMutation(SEND_NOTIFICATION);

	function handleSendNotification({ title, body }) {
		return sendNotification({
			variables: {
				filter,
				title,
				body
			}
		})
	}

	useEffect(()=>{
		console.log(filter);
	}, [filter])

	if (loadingCompanies || (loadingCount && !countTokensUsers)) return <LoadingBlock />

	return (
		<Grid container spacing={6}>
			<Grid item sm={4}>
				<Segmentation
					setFilter={setFilter}
					countTokensUsers={countTokensUsers}
					companies={companies}
					loading={loadingCount}
				/>
			</Grid>
			
			<Grid item sm={4}>
				<NotificationForm onSubmit={handleSendNotification} />
			</Grid>
		</Grid>
	)
}
