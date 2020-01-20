import React from 'react';
import { useLocation } from 'react-router-dom';

import { useQuery } from '@apollo/react-hooks';
import { ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import { mdiViewDashboard, mdiStore, mdiViewList,  mdiShape, mdiBasket, mdiAccountTie , mdiSettings } from '@mdi/js';
import Icon from '@mdi/react';

import { LoadingBlock } from '../blocks';
import { Container, NavigationContainer, NavItem } from './styles';

import { LOGGED_USER_ID, GET_USER } from '../../graphql/authentication';

function Navigation() {
	const location = useLocation();

	const { data: { loggedUserId } } = useQuery(LOGGED_USER_ID);
	const { data: { user: { role = null } = {} } = {}, loading: loadingUser } = useQuery(GET_USER, { variables: { id: loggedUserId } });
	
	function isSelected(match) {
		if (!location.pathname) return '';
		const currentLocation = location.pathname.substr(1).split('/')[0];
		return currentLocation === match ? true : false;
	}

	if (loadingUser) return <LoadingBlock />;

	return (
		<Container>
			<NavigationContainer>
				<NavItem to='/dashboard' selected={isSelected('dashboard')} alt='Dashboard'>
					<ListItemIcon>
						<Icon className='teste' path={mdiViewDashboard} size='22' color='#707070' />
					</ListItemIcon>
					<ListItemText>
						Inicio
					</ListItemText>
				</NavItem>
				<NavItem to='/pedidos' selected={isSelected('pedidos')} alt='Pedidos'>
					<ListItemIcon>
						<Icon path={mdiViewList} size='22' color='#707070' /></ListItemIcon>
					<ListItemText>
						Pedidos
					</ListItemText>
				</NavItem>
				<NavItem to='/categorias' selected={isSelected('categorias')} alt='Categorias'>
					<ListItemIcon>
						<Icon path={mdiShape} size='22' color='#707070' /></ListItemIcon>
					<ListItemText>
						Categorias
					</ListItemText>
				</NavItem>
				<NavItem to='/produtos' selected={isSelected('produtos')} alt='Produtos'>
					<ListItemIcon>
						<Icon path={mdiBasket} size='22' color='#707070' /></ListItemIcon>
					<ListItemText>
						Produtos
					</ListItemText>
				</NavItem>
				<NavItem to='/usuarios' selected={isSelected('usuarios')} alt='usuários'>
					<ListItemIcon>
						<Icon path={mdiAccountTie } size='22' color='#707070' /></ListItemIcon>
					<ListItemText>
						Usuários
					</ListItemText>
				</NavItem>

				

				<NavItem selected={isSelected('configuracoes')} className={`settings`} to='/configuracoes' alt='Configurações'>
					<ListItemIcon>
						<Icon path={mdiSettings} size='22' color='#707070' /></ListItemIcon>
					<ListItemText>
						Configurações
					</ListItemText>
				</NavItem>
			</NavigationContainer>

			{role === 'master' && (
				<>
					<Divider />

					<NavigationContainer dense={true}>
						<NavItem to='/empresas' selected={isSelected('empresas')} alt='Empresas'>
							<ListItemIcon>
								<Icon path={mdiStore} size='22' color='#707070' /></ListItemIcon>
							<ListItemText>
								Empresas
							</ListItemText>
						</NavItem>
					</NavigationContainer>
				</>
			)}
		</Container>
	)
}

export default Navigation;