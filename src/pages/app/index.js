import React from 'react'

import { useTheme, Typography } from '@material-ui/core'

import { ReactComponent as DownloadIcon } from '../../assets/icons/download.svg';
import { ReactComponent as AppStoreImage } from '../../assets/images/app-store.svg';
import { ReactComponent as LogoSvg } from '../../assets/images/simbolo.svg';
import { AppsDownloadContainer } from './styles';

export default function RecoverPassword() {
	const { palette } = useTheme();

	return (
		<div style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 40, display: 'flex', boxSizing: 'border-box', height: '100%', backgroundColor: '#EFE8DA', flexDirection: 'column' }}>
			<LogoSvg title='Pronto, Entregue!' style={{ width: 80, height: 'auto', maxWidth: '20%', marginTop: '1%', marginBottom: '1%' }} />
			<div style={{ marginTop: 40, marginBottom: 35, textAlign: "center" }}>
				<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
					<DownloadIcon style={{ color: palette.primary.main, height: 30, width: 30, marginRight: 20 }} />
					<Typography style={{ color: palette.primary.main, fontSize: 24, fontWeight: 'bold' }}>Baixe já o app</Typography>
				</div>
				<Typography style={{ fontSize: 16, marginTop: 10 }} color='textSecondary'>Escolha a loja abaixo</Typography>
			</div>
			<AppsDownloadContainer>
				<a target='_new' href='https://play.google.com/store/apps/details?id=com.flaker.prontoentregue&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
					<img  title='Disponível no Google Play' alt='Disponível no Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/pt-br_badge_web_generic.png'/>
				</a>
				<a style={{ paddingLeft: 26, paddingRight: 26 }} alt='Baixar na App Store' href='https://apps.apple.com/us/app/pronto-entregue/id1507295672?l=pt&ls=1' target='_new'>
					<AppStoreImage  title='Baixar na App Store' />
				</a>
			</AppsDownloadContainer>
		</div>
	)
}
