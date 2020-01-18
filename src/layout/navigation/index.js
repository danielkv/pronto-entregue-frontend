import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Popper, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { mdiViewDashboard, mdiStore, mdiViewList,  mdiShape, mdiBasket, mdiAccountTie , mdiSettings } from '@mdi/js';
import Icon from '@mdi/react';

import { NavigationContainer, NavItem } from './styles';

const useStyles = makeStyles(theme => ({
	root: {
		marginLeft: theme.spacing()
	},
	paper: {
		padding: '8px 10px',
		backgroundColor: '#444',
		color: '#fff',
		fontSize: 12
	}
}))

function Navigation() {
	const location = useLocation();
	
	const [popperOpen, setPopperOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [popperText, setPopperText] = useState(null);
	const classes = useStyles();

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
		setPopperOpen(prev => prev ? false : true);
		setPopperText(event.currentTarget.getAttribute('alt'));
	};

	
	function isSelected(match) {
		if (!location.pathname) return '';
		const currentLocation = location.pathname.substr(1).split('/')[0];
		return currentLocation === match ? 'selected' : '';
	}

	return (
		<NavigationContainer>
			<Popper className={classes.root} open={popperOpen} anchorEl={anchorEl} placement='right' modifiers={{ arrow: { enabled: true } }}>
				<Paper className={classes.paper}>
					{popperText}
				</Paper>
			</Popper>
			<nav>
				<NavItem to='/dashboard' className={isSelected('dashboard')} onMouseOver={handleClick} onMouseOut={handleClick} alt='Dashboard'>
					<Icon className='teste' path={mdiViewDashboard} size='22' color='#707070' />
				</NavItem>
				<NavItem to='/empresas' className={isSelected('empresas')} onMouseOver={handleClick} onMouseOut={handleClick} alt='Empresas'>
					<Icon path={mdiStore} size='22' color='#707070' />
				</NavItem>
				<NavItem to='/pedidos' className={isSelected('pedidos')} onMouseOver={handleClick} onMouseOut={handleClick} alt='Pedidos'>
					<Icon path={mdiViewList} size='22' color='#707070' />
				</NavItem>
				<NavItem to='/categorias' className={isSelected('categorias')} onMouseOver={handleClick} onMouseOut={handleClick} alt='Categorias'>
					<Icon path={mdiShape} size='22' color='#707070' />
				</NavItem>
				<NavItem to='/produtos' className={isSelected('produtos')} onMouseOver={handleClick} onMouseOut={handleClick} alt='Produtos'>
					<Icon path={mdiBasket} size='22' color='#707070' />
				</NavItem>
				<NavItem to='/usuarios' className={isSelected('usuarios')} onMouseOver={handleClick} onMouseOut={handleClick} alt='usuários'>
					<Icon path={mdiAccountTie } size='22' color='#707070' />
				</NavItem>

				<NavItem className={`settings ${isSelected('configuracoes')}`} onMouseOver={handleClick} onMouseOut={handleClick} to='/configuracoes' alt='Configurações'>
					<Icon path={mdiSettings} size='22' color='#707070' />
				</NavItem>
			</nav>
		</NavigationContainer>
	)
}

export default Navigation;