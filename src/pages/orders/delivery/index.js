import React, { useState, useEffect } from 'react'

import { useMutation } from '@apollo/react-hooks';
import { Paper, InputLabel, Select, MenuItem, FormControl, FormHelperText, Button, CircularProgress } from '@material-ui/core';
import { useFormikContext, Field } from 'formik';

import MapContainer from '../../../components/MapContainer';
import { BlockHeader, BlockTitle, FormRow, FieldControl, tField } from '../../../layout/components';

import { useSelectedCompany } from '../../../controller/hooks';
import googleMapsClient from '../../../services/googleMpasClient';

import { CALCULATE_DELIVERY_PRICE } from '../../../graphql/orders';


export default function Delivery() {
	const [loadingLocation, setLoadingLocation] = useState(false);
	const { values: { address, type, user }, handleChange, errors, setFieldValue } = useFormikContext();
	const selectedCompany = useSelectedCompany();

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
		setLoadingLocation(true);

		const { json: { results } } = await googleMapsClient.geocode({
			address: `${street}, ${number}, ${district}, ${city} ${state}`
		}).asPromise();

		setLoadingLocation(false);

		const { location } = results[0].geometry;

		setFieldValue('address.location[0]', location.lat);
		setFieldValue('address.location[1]', location.lng);
	}

	const [calculateDeliveryPrice, { loading: loadingdeliveryPrice }] = useMutation(CALCULATE_DELIVERY_PRICE, { variables: { companyId: selectedCompany } });

	useEffect(()=>{
		calculateDeliveryPrice({ variables: { address } })
			.then(({ data: { calculateDeliveryPrice: area } }) => {
				setFieldValue('deliveryPrice', area.price);
				setFieldValue('zipcodeOk', true);
			})
			.catch(()=> {
				setFieldValue('deliveryPrice', 0);
				setFieldValue('zipcodeOk', false);
			})
	}, [address]);

	return (
		<>
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
								<MenuItem value='takeout'>Retirada no local</MenuItem>
							</Select>
							{!!errors.type && <FormHelperText error>{errors.type}</FormHelperText>}
						</FormControl>
					</FieldControl>
					{type === 'delivery' &&
						<FieldControl>
							<FormControl>
								<InputLabel htmlFor="user_addresses">Endereços cadastrados</InputLabel>
								<Select
									disableUnderline={true}
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
				{type === 'delivery' &&
						<>
							<FormRow>
								<FieldControl style={{ flex: .3 }}>
									<Field name='address.name' component={tField} label='Identificação' />
								</FieldControl>
								<FieldControl style={{ flex: .3 }}>
									<Field name='address.street' component={tField} label='Rua' />
								</FieldControl>
								<FieldControl style={{ flex: .3 }}>
									<Field type='number' name='address.number' component={tField} label='Número' />
								</FieldControl>
								<FieldControl style={{ flex: .3 }}>
									<FormControl>
										<Field name='address.zipcode' type='number' component={tField} label='CEP (apenas número)' />
										{!!errors.zipcodeOk && <FormHelperText error>{errors.zipcodeOk}</FormHelperText>}
									</FormControl>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<Field name='address.district' component={tField} label='Bairro' />
								</FieldControl>
								<FieldControl>
									<Field name='address.city' component={tField} label='Cidade' />
								</FieldControl>
								<FieldControl>
									<Field name='address.state' component={tField} label='Estado' />
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<Button variant='outlined' color='secondary' disabled={loadingLocation} onClick={()=>searchGeoCode(address)}>
										{loadingLocation
											? <CircularProgress />
											: 'Buscar localização no mapa'}
									</Button>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									{(address && address.location && address.location[0] && address.location[1]) && <MapContainer
										googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GMAPS_KEY}&v=3.exp&libraries=geometry,drawing,places`}
										loadingElement={<div style={{ height: `100%` }} />}
										containerElement={<div style={{ width: '100%', height: `400px` }} />}
										mapElement={<div style={{ height: `100%` }} />}
										center={{ lat: address.location[0], lng: address.location[1] }}
										onRepositionMarker={(result)=>{setFieldValue('address.location[0]', result.latLng.lat()); setFieldValue('address.location[1]', result.latLng.lng());}}
										marker={loadingdeliveryPrice ? <CircularProgress /> : null}
										disabled={loadingdeliveryPrice}
									/>}
								</FieldControl>
							</FormRow>
						</>}
			</Paper>
		</>
	)
}
