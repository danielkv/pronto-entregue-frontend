import React, { useState, useEffect } from 'react';

import { useMutation } from '@apollo/react-hooks';
import { Paper, IconButton, FormControlLabel, Switch, Button, TextField, List, ListItem, CircularProgress, ListItemIcon, ListItemText, FormControl, FormHelperText, DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { mdiPlusCircle, mdiDelete, mdiGroup } from '@mdi/js';
import Icon from '@mdi/react';
import Downshift from 'downshift';
import { FieldArray, Form, Field } from 'formik';
import { isEmpty } from 'lodash';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField } from '../../layout/components';

import googleMapsClient from '../../services/googleMpasClient';
import { errorObjectsToArray } from '../../utils/error';
import { metaModel } from '../../utils/metas';
import MapContainer from './maps';

import { SEARCH_COMPANY_TYPES } from '../../graphql/companyTypes';

export default function PageForm ({ values: { active, phones, emails, type, address }, errors, setFieldValue, handleChange, isSubmitting, pageTitle, isValidating }) {
	const [errorDialog, setErrorDialog] = useState(false);
	const [searchCompanyTypes, { data: { searchCompanyTypes: companyTypesFound = [] } = {}, loading: loadingCompanyTypes }] = useMutation(SEARCH_COMPANY_TYPES);

	function handleSelect(item) {
		setFieldValue('type', item);
	}

	function handleSearch(value) {
		searchCompanyTypes({ variables: { search: value } })
	}

	async function searchGeoCode({ street, number, state, city, district }) {
		const { json: { results } } = await googleMapsClient.geocode({
			address: `${street}, ${number}, ${district}, ${city} ${state}`
		}).asPromise();

		const { location } = results[0].geometry;

		setFieldValue('address.location[0]', location.lat);
		setFieldValue('address.location[1]', location.lng);
	}
	
	function handleCloseDialog() {
		setErrorDialog(false)
	}
	useEffect(()=>{
		if (isValidating && !isEmpty(errors)) setErrorDialog(true);
	}, [isValidating, errors])
	
	return (
		<Form>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>{pageTitle}</BlockTitle>
					</BlockHeader>
					<Paper>
						<FormRow>
							<FieldControl>
								<Field name='displayName' component={tField} label='Nome Fantasia' />
							</FieldControl>
							<FieldControl>
								<Field name='name' component={tField} label='Razão Social' />
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<Field name='document.value' action='document.action' component={tField} label='CNPJ' />
							</FieldControl>
							<FieldControl>
								<Field name='contact.value' action='contact.action' component={tField} label='Responsável' />
							</FieldControl>
						</FormRow>
					</Paper>
				</Block>
				<Block>
					<BlockHeader>
						<BlockTitle>Endereço</BlockTitle>
					</BlockHeader>
					<Paper>
						<FormRow>
							<FieldControl style={{ flex: .3 }}>
								<Field name='address.name' component={tField} label='Identificação' />
							</FieldControl>
							<FieldControl style={{ flex: .4 }}>
								<Field name='address.street' component={tField} label='Rua' />
							</FieldControl>
							<FieldControl style={{ flex: .2 }}>
								<Field name='address.number' component={tField} label='Número' />
							</FieldControl>
							<FieldControl style={{ flex: .2 }}>
								<Field name='address.zipcode' component={tField} label='CEP' />
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
							<Field type='hidden' name='address.location[0]' />
							<Field type='hidden' name='address.location[1]' />
							<Button onClick={()=>searchGeoCode(address)}>Buscar</Button>
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
								/>}
							</FieldControl>
						</FormRow>
					</Paper>
				</Block>
				<Block>
					<BlockHeader>
						<BlockTitle>Outros dados da empresa</BlockTitle>
					</BlockHeader>
					<Paper>
						<BlockSeparator>
							<FieldArray name='phones'>
								{ ({ insert, remove }) => (
									phones.filter((row)=>row.action !== 'delete').map((phone, index) => {
								
										return (<FormRow key={index}>
											<FieldControl>
												<Field name={`phones.${index}.value`} action={`phones.${index}.action`} component={tField} label='Telefone' />
											</FieldControl>
											<FieldControl>
												{index === 0 && <IconButton disabled={isSubmitting} onClick={(e)=>{e.preventDefault(); insert(index+1, metaModel('phone')); return false}}>
													<Icon path={mdiPlusCircle} size='18' color='#363E5E' />
												</IconButton>}
												{index > 0 && <IconButton disabled={isSubmitting} onClick={(e)=>{e.preventDefault(); if (phone.action ==='create') return remove(index); setFieldValue(`phones.${index}.action`, 'delete')}}>
													<Icon path={mdiDelete} size='18' color='#707070' />
												</IconButton>}
											</FieldControl>
										</FormRow>)
									}))
								}
							</FieldArray>
						</BlockSeparator>
						<BlockSeparator>
							<FieldArray name='emails'>
								{ ({ insert, remove }) => (
									emails.filter((row)=>row.action !== 'delete').map((email, index) => {
										return (<FormRow key={index}>
											<FieldControl>
												<Field name={`emails.${index}.value`}  action={`emails.${index}.action`} component={tField} label='Email' />
											</FieldControl>
											<FieldControl>
												{index === 0 && <IconButton disabled={isSubmitting} onClick={(e)=>{e.preventDefault(); insert(index+1, metaModel('email'))}}>
													<Icon path={mdiPlusCircle} size='18' color='#363E5E' />
												</IconButton>}
												{index > 0 && <IconButton disabled={isSubmitting} onClick={(e)=>{e.preventDefault(); if (email.action ==='create') return remove(index); setFieldValue(`emails.${index}.action`, 'delete');}}>
													<Icon path={mdiDelete} size='18' color='#707070' />
												</IconButton>}
											</FieldControl>
										</FormRow>)
									}))
								}
							</FieldArray>
						</BlockSeparator>
					</Paper>
				</Block>
			</Content>
			<SidebarContainer>
				<Block>
					<BlockHeader>
						<BlockTitle>Configuração</BlockTitle>
					</BlockHeader>
					<Sidebar>
						<BlockSeparator>
							<FormRow>
								<FieldControl style={{ justifyContent: 'flex-end', paddingRight: 7 }}>
									<FormControlLabel
										labelPlacement='start'
										control={
											<Switch disabled={isSubmitting} size='small' color='primary' checked={active} name='active' onChange={handleChange}  />
										}
										label="Ativo"
									/>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<Button fullWidth disabled={isSubmitting} type="submit" variant="contained" color='secondary'>Salvar</Button>
								</FieldControl>
							</FormRow>
						</BlockSeparator>
						<BlockSeparator>
							<FormRow>
								<FieldControl>
									<FormControl>
										<Downshift
											onChange={handleSelect}
											itemToString={(item => item ? item.name : '')}
											onInputValueChange={handleSearch}
											initialSelectedItem={type}
											initialInputValue={type.name}
										>
											{({
												getInputProps,
												getItemProps,
												getMenuProps,
												isOpen,
												highlightedIndex,
											})=>(
												<div style={{ width: '100%' }}>
													<TextField label='Buscar ramo' {...getInputProps()} disabled={isSubmitting} />
													{!!errors.type && <FormHelperText error>{errors.type.name}</FormHelperText>}
													{isOpen && (
														<List {...getMenuProps()} className="dropdown">
															{loadingCompanyTypes && <div style={{ padding: 20 }}><CircularProgress /></div>}
															{!companyTypesFound.length
																? <ListItem>Nenhum ramo de atividade encontrado</ListItem>
																: companyTypesFound.map((type, index) => (
																	<ListItem
																		className="dropdown-item"
																		selected={highlightedIndex === index}
																		key={type.id}
																		{...getItemProps({ key: type.id, index, item: type })}
																	>
																		<ListItemIcon><Icon path={mdiGroup} color='#707070' size='22' /></ListItemIcon>
																		<ListItemText style={{ display: 'flex', alignItems: 'center' }}>
																			{type.name}
																		</ListItemText>
																	</ListItem>
																))}
														</List>
													)}
												</div>
											)}
										</Downshift>
									</FormControl>
								</FieldControl>
							</FormRow>
						</BlockSeparator>
					</Sidebar>
				</Block>
			</SidebarContainer>
			<Dialog
				open={errorDialog && !isEmpty(errors)}
				onClose={handleCloseDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">Hmm! Parece que seu formulário tem alguns erros</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						<ul>
							{errorObjectsToArray(errors).map((err, index) => (<li key={index}>{err}</li>))}
						</ul>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="primary"autoFocus>Ok</Button>
				</DialogActions>
			</Dialog>
		</Form>
	)
}