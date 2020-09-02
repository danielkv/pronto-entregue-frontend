import React from 'react';
import { useLocation, useRouteMatch, matchPath } from 'react-router-dom';

import { ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import { mdiViewDashboard, mdiStore, mdiViewList,  mdiShape, mdiBasket, mdiAccountTie , mdiSettings, mdiAccountMultiple, mdiGroup, mdiFormatListText, mdiFileChart, mdiTicketPercent, mdiRacingHelmet, mdiBell, mdiReceipt } from '@mdi/js';
import Icon from '@mdi/react';

import { useLoggedUserRole } from '../../controller/hooks';
import { Container, NavigationContainer, NavItem } from './styles';

function Navigation() {
	const location = useLocation();
	const loggedUserRole = useLoggedUserRole();
	const { path, url } = useRouteMatch();
	
	function isSelected(match) {
		return matchPath(location.pathname, {
			path: `${path}/${match}`,
			exact: false
		})
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
				<NavItem to={`${url}/cupons`} selected={isSelected('cupons')} alt='Cupons'>
					<ListItemIcon>
						<Icon path={mdiTicketPercent} size={1} color='#707070' />
					</ListItemIcon>
					<ListItemText>
						Cupons
					</ListItemText>
				</NavItem>
				<NavItem to={`${url}/relatorios`} selected={isSelected('relatorios')} alt='Relatórios'>
					<ListItemIcon>
						<Icon path={mdiFileChart} size={1} color='#707070' /></ListItemIcon>
					<ListItemText>
								Relatórios
					</ListItemText>
				</NavItem>
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

					<NavigationContainer dense>
						<NavItem to={`${url}/todos-pedidos`} selected={isSelected('todos-pedidos')} alt='Todos pedidos'>
							<ListItemIcon>
								<Icon path={mdiFormatListText} size={1} color='#707070' /></ListItemIcon>
							<ListItemText>
								Todos pedidos
							</ListItemText>
						</NavItem>
						<NavItem to={`${url}/entregas`} selected={isSelected('entregas')} alt='Entregas'>
							<ListItemIcon>
								<Icon path={mdiReceipt} size={1} color='#707070' /></ListItemIcon>
							<ListItemText>
								Entregas
							</ListItemText>
						</NavItem>
						<NavItem to={`${url}/entregadores`} selected={isSelected('entregadores')} alt='Entregadores'>
							<ListItemIcon>
								<Icon path={mdiRacingHelmet} size={1} color='#707070' /></ListItemIcon>
							<ListItemText>
								Entregadores
							</ListItemText>
						</NavItem>
						<NavItem to={`${url}/empresas`} selected={isSelected('empresas')} alt='Empresas'>
							<ListItemIcon>
								<Icon path={mdiStore} size={1} color='#707070' /></ListItemIcon>
							<ListItemText>
								Empresas
							</ListItemText>
						</NavItem>
						<NavItem to={`${url}/enviar-notificacoes`} selected={isSelected('enviar-notificacoes')} alt='Enviar Notificacoes'>
							<ListItemIcon>
								<Icon path={mdiBell} size={1} color='#707070' /></ListItemIcon>
							<ListItemText>
								Enviar Notificações
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