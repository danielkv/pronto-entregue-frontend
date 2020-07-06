import React, { useRef } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Typography, Divider, Button, FormHelperText, CircularProgress, Grid, TextField, MenuItem, IconButton } from '@material-ui/core';
import { mdiAlertCircle, mdiVolumeHigh } from '@mdi/js';
import Icon from '@mdi/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { tField } from '../../layout/components';

import { useSelectedCompany } from '../../controller/hooks';
import { LoadingBlock, ErrorBlock } from '../../layout/blocks';
import { setPageTitle } from '../../utils';
import { getErrors } from '../../utils/error';
import { extractMetas, sanitizeMetas } from '../../utils/metas';

import { GET_COMPANY_GENERAL_SETTINGS, UPDATE_COMPANY } from '../../graphql/companies';
import { DELIVERY_GLOBAL_ACTIVE, AVAILABLE_SOUNDS } from '../../graphql/config';

const validationSchema = Yup.object().shape({
	//metas: Yup.array().of()
	deliveryTime: Yup.object().shape({
		value: Yup.number().required('Campo Obrigatório')
	})
})

function Page () {
	setPageTitle('Configurações - Formas de pagamento');

	const notificationRef = useRef(null);

	const metaTypes = ['deliveryTime', 'deliveryType', 'notificationSound'];

	//carrega métodos pagamento ativos na filial
	const selectedCompany = useSelectedCompany();
	const {
		data: { company = {} } = {},
		loading: loadingCompanySettings
	} = useQuery(GET_COMPANY_GENERAL_SETTINGS, { variables: { id: selectedCompany, keys: metaTypes } });
	
	const { data: { availableSounds = [] } ={}, loading: loadingSounds } = useQuery(AVAILABLE_SOUNDS);

	const { data: { deliveryGlobalActive = false } = {} } = useQuery(DELIVERY_GLOBAL_ACTIVE, { variables: { id: selectedCompany, keys: metaTypes } });

	const [updateSettings, { loading: loadingUpdateSettings, error: updatingError }] = useMutation(UPDATE_COMPANY, { variables: { id: selectedCompany }, refetchQueries: [{ query: GET_COMPANY_GENERAL_SETTINGS, variables: { id: selectedCompany, keys: metaTypes } }] } );

	function onSubmit(result) {
		const data = { published: result.published, metas: sanitizeMetas(metaTypes, result) };
		return updateSettings({ variables: { data } });
	}

	if (updatingError) return <ErrorBlock error={getErrors(updatingError)} />;
	if (loadingCompanySettings) return <LoadingBlock />;

	const initialValues = {
		published: company.published,
		...extractMetas(metaTypes, company.metas)
	}

	if (initialValues.deliveryType.action === 'new_empty') {
		initialValues.deliveryType.action = 'create'
		initialValues.deliveryType.value = 'delivery'
	}
	
	if (initialValues.notificationSound.action === 'new_empty') {
		initialValues.notificationSound.action = 'create'
		const sound = availableSounds.find(s=>s.slug === 'default')
		initialValues.notificationSound.value = { ...sound, volume: 1 }
	}

	function playNotification () {
		if (!notificationRef.current) return;

		notificationRef.current.load();
		notificationRef.current.play()
	}
	
	return (
		<Paper style={{ padding: 20 }}>
			<Formik
				enableReinitialize
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			>
				{({ isSubmitting, values, setFieldValue }) => (
					<Form>
						<Grid container spacing={4}>
							<Grid item sm={7}>
								<Typography>Configurações gerais</Typography>
								<Field type='number' component={tField} action='deliveryTime.action' label='Prazo de entrega' name='deliveryTime.value' />
								<FormHelperText>Tempo em minutos, incluindo a entrega.</FormHelperText>
							</Grid>

							<Grid item sm={7}>

								<div style={{ display: 'flex', flexDirection: 'row',  }}>
									<TextField
										select
										label='Som de notificação'
										disabled={loadingSounds}
										value={values.notificationSound.value.slug}
										onChange={(e)=>{
											const value = e.target.value;
											let sound = availableSounds.find(s=>s.slug === value)
											if (!sound) sound = { slug: 'none', name: 'Nenhum', url: '', volume: 0 }

											setFieldValue('notificationSound.value', { ...values.notificationSound.value,  ...sound })
											if (values.notificationSound.action === 'editable') setFieldValue('notificationSound.action', 'update')
										}}>
										<MenuItem key='none' value='none'>Nenhum</MenuItem>
										{availableSounds.map(sound=>(<MenuItem key={sound.slug} value={sound.slug}>{sound.name}</MenuItem>))}
									</TextField>
								

									<IconButton variant='contained' onClick={playNotification} title='Testar áudio'>
										<Icon path={mdiVolumeHigh} size={.9} color='#ccc' />
									</IconButton>
								</div>

								<audio ref={notificationRef}>
									<source src={values.notificationSound.value.url} type="audio/mpeg" />
								</audio>

							</Grid>

							<Grid item sm={7}>
								<TextField
									select
									label='Pronto, Entregue fica responsável para entregas?'
									disabled={!deliveryGlobalActive}
									value={deliveryGlobalActive ? values.deliveryType.value : 'delivery'}
									onChange={(e)=>{
										setFieldValue('deliveryType.value', e.target.value)
										if (values.deliveryType.action === 'editable') setFieldValue('deliveryType.action', 'update')
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
							</Grid>
						
							<Grid item sm={12}>
								<Divider style={{ margin: '20px 0' }} />

								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<Button variant='contained' color={values.published ? 'default' : 'secondary'} onClick={()=>setFieldValue('published', !values.published)}>
											{values.published ? 'Esconder' : 'Publicar'}
										</Button>
										<Typography style={{ marginLeft: 15 }} variant='caption'>Status: {company.published ? 'Publicada' : 'Rascunho'}</Typography>
									</div>
									<Button variant='contained' color='primary' type='submit' disabled={isSubmitting}>
										{loadingUpdateSettings
											? <CircularProgress />
											: 'Salvar'}
									</Button>
								</div>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>
		</Paper>
	)
}

export default Page;