import React from 'react';
import { useLocation } from 'react-router-dom';

import { ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import { mdiViewDashboard, mdiStore, mdiViewList,  mdiShape, mdiBasket, mdiAccountTie , mdiSettings, mdiAccountMultiple, mdiStar, mdiSale, mdiGroup } from '@mdi/js';
import Icon from '@mdi/react';

import { useLoggedUserRole } from '../../controller/hooks';
import { Container, NavigationContainer, NavItem } from './styles';

function Navigation() {
	const location = useLocation();
	const loggedUserRole = useLoggedUserRole();
	
	function isSelected(match) {
		if (!location.pathname) return '';
		const currentLocation = location.pathname.substr(1).split('/')[0];
		return currentLocation === match ? true : false;
	}

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
				<NavItem to='/produtos' selected={isSelected('produtos')} alt='Produtos'>
					<ListItemIcon>
						<Icon path={mdiBasket} size='22' color='#707070' /></ListItemIcon>
					<ListItemText>
						Produtos
					</ListItemText>
				</NavItem>
				<NavItem to='/categorias' selected={isSelected('categorias')} alt='Categorias'>
					<ListItemIcon>
						<Icon path={mdiShape} size='22' color='#707070' /></ListItemIcon>
					<ListItemText>
								Categorias
					</ListItemText>
				</NavItem>
				<NavItem to='/usuarios' selected={isSelected('usuarios')} alt='usuários'>
					<ListItemIcon>
						<Icon path={mdiAccountTie } size='22' color='#707070' /></ListItemIcon>
					<ListItemText>
						Usuários
					</ListItemText>
				</NavItem>
				<NavItem to='/campanhas' selected={isSelected('campanhas')} alt='Campanhas'>
					<ListItemIcon>
						<Icon path={mdiSale} size='22' color='#707070' /></ListItemIcon>
					<ListItemText>
						Campanhas
					</ListItemText>
				</NavItem>
				<NavItem to='/pontuacao' selected={isSelected('pontuacao')} alt='pontuacao'>
					<ListItemIcon>
						<Icon path={mdiStar} size='22' color='#707070' /></ListItemIcon>
					<ListItemText>
						Pontuação
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

			{loggedUserRole === 'master' && (
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
						<NavItem to='/ramos' selected={isSelected('ramos')} alt='Ramos de atividade'>
							<ListItemIcon>
								<Icon path={mdiGroup} size='22' color='#707070' /></ListItemIcon>
							<ListItemText>
								Ramos de atividade
							</ListItemText>
						</NavItem>
						<NavItem to='/pessoas' selected={isSelected('pessoas')} alt='Pessoas'>
							<ListItemIcon>
								<Icon path={mdiAccountMultiple} size='22' color='#707070' /></ListItemIcon>
							<ListItemText>
								Pessoas
							</ListItemText>
						</NavItem>
					</NavigationContainer>
				</>
			)}
		</Container>
	)
}

export default Navigation;