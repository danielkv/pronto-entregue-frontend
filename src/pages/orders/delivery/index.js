import React, { useState, useEffect } from 'react'

import { useMutation, useQuery } from '@apollo/react-hooks';
import { Paper, InputLabel, Select, MenuItem, FormControl, FormHelperText, Button, CircularProgress } from '@material-ui/core';
import { useFormikContext, Field } from 'formik';
import { useSnackbar } from 'notistack';

import MapContainer from '../../../components/MapContainer';
import { BlockHeader, BlockTitle, FormRow, FieldControl, tField, Block } from '../../../layout/components';

import { useSelectedCompany, useLoggedUserRole } from '../../../controller/hooks';
import { LoadingBlock } from '../../../layout/blocks';
import googleMapsClient from '../../../services/googleMapsClient';

import { LOAD_COMPANY } from '../../../graphql/companies';
import { CHECK_DELIVERY_LOCATION } from '../../../graphql/orders';

let timeOutDeliveryPrice = null;

export default function Delivery() {
	const [loadingLocation, setLoadingLocation] = useState(false);
	const { values: { address, type, user }, handleChange, errors, setFieldValue, isSubmitting, initialValues } = useFormikContext();
	const selectedCompany = useSelectedCompany();
	const { data: { company: { acceptTakeout = false } = {} } = {}, loading: loadingCompany } = useQuery(LOAD_COMPANY, { variables: { id: selectedCompany } });
	const { enqueueSnackbar } = useSnackbar();

	const loggedUserRole = useLoggedUserRole();
	const canChangeStatus = loggedUserRole === 'master' || !['delivered', 'canceled'].includes(initialValues.status)
	const inputDisabled = !canChangeStatus || isSubmitting;

	const handleSelectAddress = ({ name, street, number, zipcode, complement, district, city, state, location }) => {
		setFieldValue('address', {
			name,
			street,
			number,
			zipcode,
			complement,
			district,
			city,
			state,
			location,
		})
	}

	async function searchGeoCode({ street, number, state, city, district }) {
		// case user didn't fill street or number
		if (!street && !city && state) return enqueueSnackbar('Preencha o endereço antes de buscar a localização', { variant: 'error' });

		setLoadingLocation(true);

		const { json: { results } } = await googleMapsClient.geocode({
			address: `${street}, ${number}, ${district}, ${city} ${state}`
		}).asPromise();

		setLoadingLocation(false);

		// if no location is found
		if (!results.length) return enqueueSnackbar('Nenhuma localização encontrada', { variant: 'error' });

		const { location } = results[0].geometry;

		setFieldValue('address.location[0]', location.lat);
		setFieldValue('address.location[1]', location.lng);
	}

	const [checkDeliveryLocation, { loading: loadingdeliveryPrice }] = useMutation(CHECK_DELIVERY_LOCATION, { variables: { companyId: selectedCompany } });

	useEffect(()=>{
		if (timeOutDeliveryPrice) clearTimeout(timeOutDeliveryPrice);
		if (!address) return;

		const { location = null } = address;

		if (type !== 'takeout' && location && location[0] !== '' && location[1] !== '') {
			timeOutDeliveryPrice = setTimeout(()=>{
				checkDeliveryLocation({ variables: { location, type } })
					.then(({ data: { checkDeliveryLocation: area } }) => {
						setFieldValue('deliveryPrice', area.price);
						setFieldValue('deliveryOk', true);
					})
					.catch(()=> {
						setFieldValue('deliveryPrice', 0);
						setFieldValue('deliveryOk', false);
					})
			}, 2000)
		}
	}, [type, address, checkDeliveryLocation, setFieldValue]);

	if (loadingCompany) return <LoadingBlock />

	return (
		<Block>
			<BlockHeader>
				<BlockTitle>Retirada do pedido</BlockTitle>
			</BlockHeader>
			<Paper>
				<FormRow>
					<FieldControl style={{ flex: .3 }}>
						<FormControl>
							<InputLabel htmlFor="type">Tipo</InputLabel>
							<Select
								disableUnderline={true}
								disabled={!acceptTakeout || loadingdeliveryPrice || inputDisabled}
								name='type'
								value={type}
								error={!!errors.type}
								onChange={handleChange}
								inputProps={{
									name: 'type',
									id: 'type',
								}}
							>
								<MenuItem value='delivery'>Entrega</MenuItem>
								<MenuItem value='peDelivery'>Entrega (Pronto, entregue!)</MenuItem>
								<MenuItem value='takeout'>Retirada no local</MenuItem>
							</Select>
							{!!errors.type && <FormHelperText error>{errors.type}</FormHelperText>}
						</FormControl>
					</FieldControl>
					{type !== 'takeout' &&
						<FieldControl>
							<FormControl>
								<InputLabel htmlFor="user_addresses">Endereços cadastrados</InputLabel>
								<Select
									disableUnderline={true}
									disabled={loadingdeliveryPrice || inputDisabled}
									value={''}
									onChange={(e)=>handleSelectAddress(user.addresses[e.target.value])}
									inputProps={{
										name: 'user_addresses',
										id: 'user_addresses',
									}}
								>
									{!!user && !!user.addresses && user.addresses.map((address, index)=>(
										<MenuItem key={index} value={index}>{`${address.street}, ${address.number} (${address.city} ${address.state})`}</MenuItem>
									))}
								</Select>
							</FormControl>
						</FieldControl>}
				</FormRow>
				{type !== 'takeout' &&
						<>
							<FormRow>
								<FieldControl style={{ flex: .3 }}>
									<Field controldisabled={loadingdeliveryPrice || inputDisabled} name='address.street' component={tField} label='Rua' />
								</FieldControl>
								<FieldControl style={{ flex: .3 }}>
									<Field controldisabled={loadingdeliveryPrice || inputDisabled} type='number' name='address.number' component={tField} label='Número' />
								</FieldControl>
								<FieldControl style={{ flex: .3 }}>
									<Field controldisabled={loadingdeliveryPrice || inputDisabled} name='address.complement' component={tField} label='Complemento' />
								</FieldControl>
								<FieldControl style={{ flex: .3 }}>
									<FormControl>
										<Field controldisabled={loadingdeliveryPrice || inputDisabled} name='address.zipcode' type='number' component={tField} label='CEP (apenas número)' />
										{!!errors.zipcodeOk && <FormHelperText error>{errors.zipcodeOk}</FormHelperText>}
									</FormControl>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<Field controldisabled={loadingdeliveryPrice || inputDisabled} name='address.district' component={tField} label='Bairro' />
								</FieldControl>
								<FieldControl>
									<Field controldisabled={loadingdeliveryPrice || inputDisabled} name='address.city' component={tField} label='Cidade' />
								</FieldControl>
								<FieldControl>
									<Field controldisabled={loadingdeliveryPrice || inputDisabled} name='address.state' component={tField} label='Estado' />
								</FieldControl>
								<FieldControl>
									<Field controldisabled={loadingdeliveryPrice || inputDisabled} name='address.reference' component={tField} label='Ponto de referência' />
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<Button variant='outlined' color='primary' disabled={loadingLocation || inputDisabled} onClick={()=>searchGeoCode(address)}>
										{loadingLocation
											? <CircularProgress />
											: 'Buscar localização no mapa'}
									</Button>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									{(address && address.location && address.location[0] && address.location[1]) &&
									<MapContainer
										center={{ lat: address.location[0], lng: address.location[1] }}
										onRepositionMarker={(result)=>{setFieldValue('address.location[0]', result.latLng.lat()); setFieldValue('address.location[1]', result.latLng.lng());}}
										marker={loadingdeliveryPrice ? <CircularProgress /> : null}
										disabled={loadingdeliveryPrice || inputDisabled}
									/>}
								</FieldControl>
							</FormRow>
						</>}
			</Paper>
		</Block>
	)
}
