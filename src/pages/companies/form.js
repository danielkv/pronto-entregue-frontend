import React from 'react';

import { useMutation } from '@apollo/react-hooks';
import { Paper, IconButton, FormControlLabel, Switch, ButtonGroup, Button, TextField, List, ListItem, CircularProgress, ListItemIcon, ListItemText, FormControl } from '@material-ui/core';
import { mdiPlusCircle, mdiDelete, mdiGroup } from '@mdi/js';
import Icon from '@mdi/react';
import Downshift from 'downshift';
import { FieldArray, Form, Field } from 'formik';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField } from '../../layout/components';

import { metaModel } from '../../utils/metas';

import { SEARCH_COMPANY_TYPES } from '../../graphql/companyTypes';

export default function PageForm ({ values: { active, phones, emails, type }, setFieldValue, handleChange, isSubmitting, pageTitle }) {

	const [searchCompanyTypes, { data: { searchCompanyTypes: companyTypesFound = [] } = {}, loading: loadingCompanyTypes }]= useMutation(SEARCH_COMPANY_TYPES);

	function handleSelect(item) {
		setFieldValue('type', item);
	}

	function handleSearch(value) {
		searchCompanyTypes({ variables: { search: value } })
	}
	
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
							<FieldControl>
								<Field name='address.value.street' action='address.action' component={tField} label='Rua' />
							</FieldControl>
							<FieldControl style={{ flex: .3 }}>
								<Field name='address.value.number' action='address.action' component={tField} label='Número' />
							</FieldControl>
							<FieldControl style={{ flex: .3 }}>
								<Field name='address.value.zipcode' action='address.action' component={tField} label='CEP' />
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<Field name='address.value.district' action='address.action' component={tField} label='Bairro' />
							</FieldControl>
							<FieldControl>
								<Field name='address.value.city' action='address.action' component={tField} label='Cidade' />
							</FieldControl>
							<FieldControl>
								<Field name='address.value.state' action='address.action' component={tField} label='Estado' />
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
									<ButtonGroup fullWidth>
										<Button disabled={isSubmitting} onClick={(e)=>{e.preventDefault()}} color='secondary'>Cancelar</Button>
										<Button disabled={isSubmitting} type="submit" variant="contained" color='secondary'>Salvar</Button>
									</ButtonGroup>
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
		</Form>)
}