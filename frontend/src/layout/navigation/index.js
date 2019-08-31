import React, { useState } from 'react';
import Icon from '@mdi/react';
import { mdiViewDashboard, mdiStore, mdiSourceBranch, mdiViewList,  mdiShape, mdiBasket, mdiAccountMultiple, mdiSettings } from '@mdi/js';
import {Popper, Paper} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

import {NavigationContainer, NavItem} from './styles';

const useStyles = makeStyles(theme => ({
	root : {
		marginLeft: theme.spacing()
	},
	paper:{
		padding:'8px 10px',
		backgroundColor:'#444',
		color:'#fff',
		fontSize:12
	}
}))

export default function Navigation() {
	const [popperOpen, setPopperOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [popperText, setPopperText] = useState(null);
	const classes = useStyles();

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
		setPopperOpen(prev => prev ? false : true);
		setPopperText(event.currentTarget.getAttribute('title'));
	};

	return (
		<NavigationContainer>
			<Popper className={classes.root} open={popperOpen} anchorEl={anchorEl} placement='right' modifiers={{arrow:{enabled:true}}}>
				<Paper className={classes.paper}>
					{popperText}
				</Paper>
			</Popper>
			<nav>
				<NavItem to='/' onMouseOver={handleClick} onMouseOut={handleClick} alt='Dashboard' title='Dashboard'>
					<Icon className='teste' path={mdiViewDashboard} size='22' color='#707070' />
				</NavItem>
				<NavItem to='/empresas' onMouseOver={handleClick} onMouseOut={handleClick} alt='Empresas' title='Empresas'>
					<Icon path={mdiStore} size='22' color='#707070' />
				</NavItem>
				<NavItem to='/filiais' onMouseOver={handleClick} onMouseOut={handleClick} alt='Filiais' title='Filiais'>
					<Icon path={mdiSourceBranch} size='22' color='#707070' />
				</NavItem>
				<NavItem to='/pedidos' onMouseOver={handleClick} onMouseOut={handleClick} alt='Pedidos' title='Pedidos'>
					<Icon path={mdiViewList} size='22' color='#707070' />
				</NavItem>
				<NavItem to='/categorias' onMouseOver={handleClick} onMouseOut={handleClick} alt='Categorias' title='Categorias'>
					<Icon path={mdiShape} size='22' color='#707070' />
				</NavItem>
				<NavItem to='/produtos' onMouseOver={handleClick} onMouseOut={handleClick} alt='Produtos' title='Produtos'>
					<Icon path={mdiBasket} size='22' color='#707070' />
				</NavItem>
				<NavItem to='/usuarios' onMouseOver={handleClick} onMouseOut={handleClick} alt='usuários' title='Usuários'>
					<Icon path={mdiAccountMultiple} size='22' color='#707070' />
				</NavItem>

				<NavItem className='settings' onMouseOver={handleClick} onMouseOut={handleClick} to='/configuracoes' alt='Configurações' title='Configurações'>
					<Icon path={mdiSettings} size='22' color='#707070' />
				</NavItem>
			</nav>
		</NavigationContainer>
	)
}