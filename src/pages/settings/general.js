import React, { useRef } from 'react';
import { Link as LinkComponent } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Divider, Button, FormHelperText, CircularProgress, TextField, MenuItem, IconButton, FormLabel, FormControl, Link, Typography } from '@material-ui/core';
import { mdiAlertCircle, mdiVolumeHigh, mdiPlusCircle, mdiMinusCircle } from '@mdi/js';
import Icon from '@mdi/react';
import { Formik, Form, FieldArray } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import { useSelectedCompany } from '../../controller/hooks';
import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import * as ConfigUtils from '../../utils/config';
import { getErrors } from '../../utils/error';
import { ConfigSection, ConfigSectionTitle, ConfigSectionContent } from './styles';

import { UPDATE_COMPANY, GET_COMPANY_CONFIG, SET_COMPANY_CONFIGS, GET_COMPANY } from '../../graphql/companies';
import { DELIVERY_GLOBAL_ACTIVE, AVAILABLE_SOUNDS } from '../../graphql/config';

const validationSchema = Yup.object().shape({
	deliveryTime: Yup.array().of(Yup.string().required('Campo Obrigatório')).min(1).test({
		name: 'testDeliveryTime',
		message: 'O tempo da primeira caixa deve ser menor que o tempo da segunda',
		test: (value) =>{
			if (value.length > 1) {
				const value1 = ConfigUtils.convertInputTimeToMinutes(value[0]);
				const value2 = ConfigUtils.convertInputTimeToMinutes(value[1]);
				if (value1 >= value2) return false;
			}
			
			return true
		}
	})
})

function Page () {
	setPageTitle('Configurações - Formas de pagamento');
	const { enqueueSnackbar } = useSnackbar();

	const notificationRef = useRef(null);

	const metaTypes = [
		{ key: 'deliveryTime', type: 'string' },
		{ key: 'deliveryType', type: 'string' },
		{ key: 'notificationSound', type: 'json' },
		{ key: 'allowBuyClosed', type: 'string' },
		{ key: 'allowBuyClosedTimeBefore', type: 'integer' },
	];

	// load company settings
	const selectedCompany = useSelectedCompany();
	const {
		data: { companyConfig = {} } = {},
		loading: loadingCompanySettings,
		error: loadConfigError,
	} = useQuery(GET_COMPANY_CONFIG, { variables: { companyId: selectedCompany, keys: metaTypes.map(type=>type.key) } });

	// load company data
	const { data: { company=null }, loading: loadingCompany } = useQuery(GET_COMPANY, { variables: { id: selectedCompany } })
	
	// load available sounds
	const { data: { availableSounds = [] } ={}, loading: loadingSounds } = useQuery(AVAILABLE_SOUNDS);

	// load deliveryGlobalActive
	const { data: { deliveryGlobalActive = false } = {} } = useQuery(DELIVERY_GLOBAL_ACTIVE);

	// create update settings fn
	const [updateCofigs, { loading: loadingUpdateSettings }] = useMutation(SET_COMPANY_CONFIGS, { variables: { companyId: selectedCompany } } );

	// create update company fn
	const [updateCompany, { loading: loadingUpdateCompany }] = useMutation(UPDATE_COMPANY, { variables: { id: selectedCompany } })

	function onSubmit(result) {
		const data = ConfigUtils.serialize(metaTypes, result);
		return updateCofigs({ variables: { data } })
			.then(()=>{
				enqueueSnackbar('Configurações salvas', { variant: 'success' });
			})
			.catch((err)=>{
				enqueueSnackbar(getErrors(err), { variant: 'error' });
			})
	}

	if (loadingCompanySettings) return <LoadingBlock />;
	if (loadConfigError) return <ErrorBlock error={getErrors(loadConfigError)} />;

	const initialValues = ConfigUtils.deserealize(companyConfig)

	function playNotification () {
		if (!notificationRef.current) return;

		notificationRef.current.load();
		notificationRef.current.play();
	}
	
	return (
		<Paper style={{ padding: 20 }}>
			<Formik
				enableReinitialize
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			>
				{({ isSubmitting, values, setFieldValue, handleChange, errors }) => (
					<Form>
						<ConfigSection>
							
							<ConfigSectionTitle>Entregas</ConfigSectionTitle>
					
							<ConfigSectionContent>
								<FormLabel style={{ fontSize: 12 }}>Tempo de entrega</FormLabel>
								<FieldArray name='deliveryTime'>
									{({ insert, remove }) =>(
										<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
											{values.deliveryTime.map((value, index) =>
												<TextField
													key={index}
													disabled={isSubmitting}
													style={{ marginRight: 3, width: 150 }}
													name={`deliveryTime.${index}`}
													value={value}
													type='time'
													onChange={handleChange}
												/>
											)}
											{values.deliveryTime.length === 1
												?<IconButton onClick={()=>insert(1, '00:00')}>
													<Icon path={mdiPlusCircle} size={.8} />
												</IconButton>
												:<IconButton onClick={()=>remove(1)}>
													<Icon path={mdiMinusCircle} size={.8} color='red' />
												</IconButton>}
										</div>
									)}
								</FieldArray>
								<FormHelperText error={!!errors?.deliveryTime}>
									{errors?.deliveryTime || 'Intervalo ou tempo aproximado para entrega do pedido. Essa é mostrada no app.'}
								</FormHelperText>
							</ConfigSectionContent>
							<ConfigSectionContent>
								<FormControl>
									<TextField
										select
										label='Pronto, Entregue fica responsável para entregas'
										disabled={isSubmitting || !deliveryGlobalActive}
										value={deliveryGlobalActive ? values.deliveryType : 'delivery'}
										style={{ width: 380 }}
										onChange={(e)=>{
											setFieldValue('deliveryType', e.target.value)
										}}>
										<MenuItem value='delivery'>Não</MenuItem>
										<MenuItem value='peDelivery'>Sim</MenuItem>
									</TextField>
								
									{!deliveryGlobalActive &&
									<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 7 }}>
										<Icon path={mdiAlertCircle} size={.8} color='#fb0' style={{ marginRight: 5 }} />
										<FormHelperText>Essa função está desabilitada</FormHelperText>
									</div>
									}
								</FormControl>
							</ConfigSectionContent>
						</ConfigSection>
						<ConfigSection>
							<ConfigSectionTitle>Notificações</ConfigSectionTitle>
							<ConfigSectionContent>
								<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'  }}>
									<TextField
										select
										label='Som da notificação'
										disabled={isSubmitting || loadingSounds}
										value={values.notificationSound.slug}
										style={{ width: 200 }}
										onChange={(e)=>{
											const value = e.target.value;
											let sound = availableSounds.find(s=>s.slug === value)
											if (!sound) sound = { slug: 'none', name: 'Nenhum', url: '', volume: 0 }

											setFieldValue('notificationSound', sound)
										}}>
										<MenuItem key='none' value='none'>Nenhum</MenuItem>
										{availableSounds.map(sound=>(<MenuItem key={sound.slug} value={sound.slug}>{sound.name}</MenuItem>))}
									</TextField>
								

									<IconButton variant='contained' onClick={playNotification} title='Testar áudio'>
										<Icon path={mdiVolumeHigh} size={.9} color='#ccc' />
									</IconButton>
								</div>

								<audio ref={notificationRef}>
									<source src={values.notificationSound.url} type="audio/mpeg" />
								</audio>
							</ConfigSectionContent>
						</ConfigSection>

						<ConfigSection>
							<ConfigSectionTitle>Agendamento de pedidos</ConfigSectionTitle>
							<ConfigSectionContent>
								<TextField
									select
									label='Permitir pedidos com estabelecimento fechado'
									disabled={isSubmitting || !deliveryGlobalActive}
									value={values.allowBuyClosed}
									style={{ width: 350, marginRight: 20 }}
									onChange={(e)=>{
										setFieldValue('allowBuyClosed', e.target.value)
									}}>
									<MenuItem value='false'>Não</MenuItem>
									<MenuItem value='onlyScheduled'>Apenas encomendas</MenuItem>
									<MenuItem value='all'>Todos produtos</MenuItem>
								</TextField>
								<FormHelperText>O cliente irá ser avisado que o pedido será entregue conforme o horário de atendimento ou horário de entrega</FormHelperText>
							</ConfigSectionContent>
							<ConfigSectionContent>
								{<TextField
									disabled={isSubmitting || values.allowBuyClosed === 'false'}
									label='Permitir quanto tempo antes de abrir'
									style={{ marginRight: 3, width: 270 }}
									name={'allowBuyClosedTimeBefore'}
									value={values.allowBuyClosedTimeBefore}
									type='time'
									onChange={handleChange}
								/>}
							</ConfigSectionContent>
							<ConfigSectionContent>
								<Typography style={{ fontSize: 14 }}>
									Você pode configurar os horários de entrega para encomendas <Link component={LinkComponent} color="primary" to={'/dashboard/configuracoes/horarios-de-entrega'}>aqui</Link>
								</Typography>
							</ConfigSectionContent>
						</ConfigSection>
							
						<Divider style={{ margin: '20px 0' }} />

						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							{loadingCompany || loadingUpdateCompany
								? <CircularProgress />
								: <div style={{ display: 'flex', alignItems: 'center' }}>
									<Button
										variant='contained' color={company.published ? 'default' : 'secondary'}
										onClick={()=>updateCompany({ variables: { data: { published: !company.published } } })}>
										{company.published ? 'Esconder' : 'Publicar'}
									</Button>
								</div>}
							<Button variant='contained' color='primary' type='submit' disabled={isSubmitting}>
								{loadingUpdateSettings
									? <CircularProgress />
									: 'Salvar'}
							</Button>
						</div>
							
					</Form>
				)}
			</Formik>
		</Paper>
	)
}

export default Page;