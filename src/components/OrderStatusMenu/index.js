import React from 'react'

import { Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core'

import { useLoggedUserRole } from '../../controller/hooks'
import { canChangeStatus } from '../../controller/orderStatus';

export default function OrderStatusMenu({ availableStatus, anchorEl, open, onClose, onClick, selected }) {
	const loggedUserRole = useLoggedUserRole();
	

	return (
		<Menu
			id="simple-menu"
			anchorEl={anchorEl.current}
			keepMounted
			open={open}
			onClose={onClose}
		>
			{availableStatus.map(status => {
				const canChangeOrderStatus = loggedUserRole === 'master' || canChangeStatus(availableStatus, selected, status.slug);
				return (
					<MenuItem disabled={!canChangeOrderStatus} key={status.slug} onClick={onClick(status)} selected={selected===status.slug} dense>
						<ListItemIcon>{status.Icon}</ListItemIcon>
						<ListItemText>{status.label}</ListItemText>
					</MenuItem>
				)
			})}
		</Menu>
	)
}
