import React from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';

import { ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import { mdiViewDashboard, mdiStore, mdiViewList,  mdiShape, mdiBasket, mdiAccountTie , mdiSettings, mdiAccountMultiple, mdiGroup } from '@mdi/js';
import Icon from '@mdi/react';

import { useLoggedUserRole } from '../../controller/hooks';
import { Container, NavigationContainer, NavItem } from './styles';

function Navigation() {
	const location = useLocation();
	const loggedUserRole = useLoggedUserRole();
	const { path, url } = useRouteMatch();
	
	function isSelected(match) {
		return location.pathname === `${path}/${match}`
	}

	return (
		<Container>
			<NavigationContainer>
				<NavItem to={`${url}`} selected={location.pathname === `${path}`} alt='Dashboard'>
					<ListItemIcon>
						<Icon className='teste' path={mdiViewDashboard} size={1} color='#707070' />
					</ListItemIcon>
					<ListItemText>
						Inicio
					</ListItemText>
				</NavItem>
				<NavItem to={`${url}/pedidos`} selected={isSelected('pedidos')} alt='Pedidos'>
					<ListItemIcon>
						<Icon path={mdiViewList} size={1} color='#707070' /></ListItemIcon>
					<ListItemText>
						Pedidos
					</ListItemText>
				</NavItem>
				<NavItem to={`${url}/produtos`} selected={isSelected('produtos')} alt='Produtos'>
					<ListItemIcon>
						<Icon path={mdiBasket} size={1} color='#707070' /></ListItemIcon>
					<ListItemText>
						Produtos
					</ListItemText>
				</NavItem>
				<NavItem to={`${url}/categorias`} selected={isSelected('categorias')} alt='Categorias'>
					<ListItemIcon>
						<Icon path={mdiShape} size={1} color='#707070' /></ListItemIcon>
					<ListItemText>
								Categorias
					</ListItemText>
				</NavItem>
				<NavItem to={`${url}/usuarios`} selected={isSelected('usuarios')} alt='usuários'>
					<ListItemIcon>
						<Icon path={mdiAccountTie } size={1} color='#707070' /></ListItemIcon>
					<ListItemText>
						Usuários
					</ListItemText>
				</NavItem>
				{/* <NavItem to={`${url}/campanhas`} selected={isSelected('campanhas')} alt='Campanhas'>
					<ListItemIcon>
						<Icon path={mdiSale} size={1} color='#707070' /></ListItemIcon>
					<ListItemText>
						Campanhas
					</ListItemText>
				</NavItem> */}
				{/* <NavItem to={`${url}/pontuacao`} selected={isSelected('pontuacao')} alt='pontuacao'>
					<ListItemIcon>
						<Icon path={mdiStar} size={1} color='#707070' /></ListItemIcon>
					<ListItemText>
						Pontuação
					</ListItemText>
				</NavItem> */}

				

				<NavItem selected={isSelected('configuracoes')} className={`settings`} to={`${url}/configuracoes`} alt='Configurações'>
					<ListItemIcon>
						<Icon path={mdiSettings} size={1} color='#707070' /></ListItemIcon>
					<ListItemText>
						Configurações
					</ListItemText>
				</NavItem>
			</NavigationContainer>

			{loggedUserRole === 'master' && (
				<>
					<Divider />

					<NavigationContainer dense={true}>
						<NavItem to={`${url}/empresas`} selected={isSelected('empresas')} alt='Empresas'>
							<ListItemIcon>
								<Icon path={mdiStore} size={1} color='#707070' /></ListItemIcon>
							<ListItemText>
								Empresas
							</ListItemText>
						</NavItem>
						<NavItem to={`${url}/ramos`} selected={isSelected('ramos')} alt='Ramos de atividade'>
							<ListItemIcon>
								<Icon path={mdiGroup} size={1} color='#707070' /></ListItemIcon>
							<ListItemText>
								Ramos de atividade
							</ListItemText>
						</NavItem>
						<NavItem to={`${url}/pessoas`} selected={isSelected('pessoas')} alt='Pessoas'>
							<ListItemIcon>
								<Icon path={mdiAccountMultiple} size={1} color='#707070' /></ListItemIcon>
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