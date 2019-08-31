import React, { useState } from 'react';
import Icon from '@mdi/react';
import { mdiViewDashboard, mdiStore, mdiSourceBranch, mdiViewList,  mdiShape, mdiBasket, mdiAccountMultiple, mdiSettings } from '@mdi/js';
import {Popper, Paper} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {withRouter } from 'react-router-dom';

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

function Navigation(props) {
	const {path} = props.match;
	const [popperOpen, setPopperOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [popperText, setPopperText] = useState(null);
	const classes = useStyles();

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
		setPopperOpen(prev => prev ? false : true);
		setPopperText(event.currentTarget.getAttribute('alt'));
	};

	return (
		<NavigationContainer>
			<Popper className={classes.root} open={popperOpen} anchorEl={anchorEl} placement='right' modifiers={{arrow:{enabled:true}}}>
				<Paper className={classes.paper}>
					{popperText}
				</Paper>
			</Popper>
			<nav>
				<NavItem to='/' selected={path==='/'?true:false} onMouseOver={handleClick} onMouseOut={handleClick} alt='Dashboard'>
					<Icon className='teste' path={mdiViewDashboard} size='22' color='#707070' />
				</NavItem>
				<NavItem to='/empresas' selected={path==='/empresas'?true:false} onMouseOver={handleClick} onMouseOut={handleClick} alt='Empresas'>
					<Icon path={mdiStore} size='22' color='#707070' />
				</NavItem>
				<NavItem to='/filiais' selected={path==='/filiais'?true:false} onMouseOver={handleClick} onMouseOut={handleClick} alt='Filiais'>
					<Icon path={mdiSourceBranch} size='22' color='#707070' />
				</NavItem>
				<NavItem to='/pedidos' selected={path==='/pedidos'?true:false} onMouseOver={handleClick} onMouseOut={handleClick} alt='Pedidos'>
					<Icon path={mdiViewList} size='22' color='#707070' />
				</NavItem>
				<NavItem to='/categorias' selected={path==='/categorias'?true:false} onMouseOver={handleClick} onMouseOut={handleClick} alt='Categorias'>
					<Icon path={mdiShape} size='22' color='#707070' />
				</NavItem>
				<NavItem to='/produtos' selected={path==='/produtos'?true:false} onMouseOver={handleClick} onMouseOut={handleClick} alt='Produtos'>
					<Icon path={mdiBasket} size='22' color='#707070' />
				</NavItem>
				<NavItem to='/usuarios' selected={path==='/usuarios'?true:false} onMouseOver={handleClick} onMouseOut={handleClick} alt='usuários'>
					<Icon path={mdiAccountMultiple} size='22' color='#707070' />
				</NavItem>

				<NavItem className='settings' selected={path==='/configuracoes'?true:false} onMouseOver={handleClick} onMouseOut={handleClick} to='/configuracoes' alt='Configurações'>
					<Icon path={mdiSettings} size='22' color='#707070' />
				</NavItem>
			</nav>
		</NavigationContainer>
	)
}

export default withRouter(Navigation);