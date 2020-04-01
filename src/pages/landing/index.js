import React from 'react'

import { Typography, Container, Button } from '@material-ui/core';

import { ReactComponent as PackageIcon } from '../../assets/icons/package.svg';
import { ReactComponent as PhoneIcon } from '../../assets/icons/phone.svg';
import { ReactComponent as SmartphoneIcon } from '../../assets/icons/smartphone.svg';
import { ReactComponent as TruckIcon } from '../../assets/icons/truck.svg';
import appImage from '../../assets/images/app-android-iosios.png';
import desktopImage from '../../assets/images/app-desktop.png';
import appStoreImage from '../../assets/images/app-store.png';
import googlePlayImage from '../../assets/images/google-play.png';
import logoUrl from '../../assets/images/logo.png';
import statusImage from '../../assets/images/status-control.png';
import {
	Header,
	HeaderContentContainer,
	LogoImg,
	TopContent,
	TopNav,
	Feature,
	FeaturesContainer,
	FeatureDetailsContainer,
	BackgroudLine,
	FeatureDetails,
	FeaturedContent,
	FeaturedTitle,
	FeaturedDescription,
	FeaturedImage,
	Dot,
	Footer,
	PhoneNumber,
	AppsDownloadContainer
} from './styles';

export default function Landing() {
	return (
		<Container maxWidth={false} style={{ padding: 0 }}>
			<Header>
				<HeaderContentContainer>
					<Container style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
						<TopNav>
							<LogoImg src={logoUrl} />
							<Button variant='contained' color='primary'>Acessar Dashboard</Button>
						</TopNav>
						<TopContent>
							<Typography variant='h1' style={{ fontSize: '3em', textTransform: 'uppercase' }}>Sistema para <b>entrega</b></Typography>
							<Typography variant='h3' style={{ fontSize: '2em', fontWeight: 'bold' }}>Completo para seu <b>Delivery</b></Typography>
							<FeaturesContainer>
								<Feature>
									<div><PackageIcon /></div>
									<Typography variant='caption'>Tudo em um só lugar</Typography>
								</Feature>
								<Feature>
									<div><TruckIcon /></div>
									<Typography variant='caption'>Controle de status para entrega</Typography>
								</Feature>
								<Feature>
									<div><SmartphoneIcon /></div>
									<Typography variant='caption'>Aplicativo IOS e Android</Typography>
								</Feature>
							</FeaturesContainer>
							<AppsDownloadContainer style={{ marginTop: 30 }}>
								<img src={appStoreImage} alt='App Store' />
								<img src={googlePlayImage} alt='Google Play' />
							</AppsDownloadContainer>
						</TopContent>
					</Container>
				</HeaderContentContainer>
			</Header>
			<FeatureDetailsContainer>
				<BackgroudLine />
				<Container>
					<FeatureDetails >
						<FeaturedContent position='left'>
							<FeaturedTitle>
								<PackageIcon style={{ width: 40, height: 40 }} />
								<Typography variant='h3'>Tudo em um só lugar</Typography>
								<Dot />
							</FeaturedTitle>
							<FeaturedDescription>
								<Typography variant='body1'>Tenha o controle de todos seus pedidos, produtos e configurações em um só lugar.</Typography>
								<Typography variant='body1'>Controle promoções, adicione produtos, veja suas avaliações e configure os <b>locais de entrega</b>.</Typography>
								<Typography variant='body1'>Na <b>Dashboard</b> você terá o controle completo de sua empresa dentro do app <b>Pronto Entregue!</b></Typography>
							</FeaturedDescription>
						</FeaturedContent>
						<FeaturedImage src={desktopImage} type='desktop' />
					</FeatureDetails>
					<FeatureDetails style={{ justifyContent: 'flex-end' }}>
						<FeaturedContent position='right'>
							<FeaturedTitle>
								<TruckIcon style={{ width: 40, height: 40 }} />
								<Typography variant='h3'>Controle de Status</Typography>
								<Dot />
							</FeaturedTitle>
							<FeaturedDescription>
								<Typography variant='body1'>Dentro da <b>Dashboard</b> você pode ver quem fez o pedido, analisar quais opcionais o cliente pediu e controlar o status do pedido. Dessa maneiro o usuário sabe tudo que está acontecendo.</Typography>
							</FeaturedDescription>
						</FeaturedContent>
						<FeaturedImage src={statusImage} type='status' />
					</FeatureDetails>
					<FeatureDetails>
						<FeaturedContent position='left'>
							<FeaturedTitle>
								<SmartphoneIcon style={{ width: 40, height: 40 }} />
								<Typography variant='h3'>Aplicativo IOS e Android</Typography>
								<Dot />
							</FeaturedTitle>
							<FeaturedDescription>
								<Typography variant='body1'>APP totalmente desenvolvido pensando no <b>usuário final</b>. Intuitivo e prático, dando prioridade para objetividade na hora da compra.</Typography>
							</FeaturedDescription>
						</FeaturedContent>
						<FeaturedImage src={appImage} type='app' />
					</FeatureDetails>
				</Container>
			</FeatureDetailsContainer>
			<Footer>
				<Typography variant='h4' color='primary' style={{ fontWeight: 'bold', marginBottom: 20 }}>Baixe nosso APP</Typography>
				<AppsDownloadContainer>
					<img src={appStoreImage} alt='App Store' />
					<img src={googlePlayImage} alt='Google Play' />
				</AppsDownloadContainer>
				<Typography variant='h5' color='primary' >Quer saber mais? Entre em contato</Typography>
				<PhoneNumber>
					<div><PhoneIcon /></div>
					<Typography variant='body1'>48 99189 3016</Typography>
				</PhoneNumber>
				<Typography variant='caption'>Desenvolvido por <a href='http://flaker.me/' target='new'>Flaker</a></Typography>
			</Footer>
		</Container>
	)
}
