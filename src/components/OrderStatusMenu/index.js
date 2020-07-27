import React from 'react'

import { Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core'

import { useLoggedUserRole } from '../../controller/hooks'
import OrderController from '../../controller/order';

export default function OrderStatusMenu({ availableStatus, anchorEl, open, onClose, onClick, selected }) {
	const loggedUserRole = useLoggedUserRole();
	
	const handleOnClick = (status) => () => {
		onClick(status)
	}

	return (
		<Menu
			id="statusMenu"
			anchorEl={anchorEl}
			keepMounted
			open={open}
			onClose={onClose}
		>
			{availableStatus.map(status => {
				const canChangeOrderStatus = loggedUserRole === 'master' ||  OrderController.canChangeStatus(availableStatus, selected, status.slug);
				return (
					<MenuItem disabled={!canChangeOrderStatus} key={status.slug} onClick={handleOnClick(status)} selected={selected===status.slug} dense>
						<ListItemIcon>{status.IconComponent}</ListItemIcon>
						<ListItemText>{status.label}</ListItemText>
					</MenuItem>
				)
			})}
		</Menu>
	)
}
