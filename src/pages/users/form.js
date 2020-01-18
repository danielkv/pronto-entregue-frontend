import React, { useState, Fragment } from 'react';

import { Paper, TextField, FormControlLabel, Switch, Button, FormControl, FormHelperText, MenuItem, Table, TableBody, TableRow, TableCell, TableHead, IconButton, Grid, FormLabel } from '@material-ui/core';
import { mdiMapMarker, mdiPlusCircle, mdiDelete } from '@mdi/js'
import Icon from '@mdi/react';
import { Formik, FieldArray, Form, Field } from 'formik';
import * as Yup from 'yup';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField } from '../../layout/components';

import { metaModel } from '../../utils';

export default function PageForm ({ initialValues, onSubmit, pageTitle, validateOnChange, edit }) {

	const userSchema = Yup.object().shape({
		firstName: Yup.string().required('Obrigatório'),
		lastName: Yup.string().required('Obrigatório'),
		email: Yup.string().required('Obrigatório'),
		password: Yup.lazy(() => {
			if (forcePassword)
				return Yup.string().required('Obrigatório');
			return Yup.string().notRequired();
		}),
		document: Yup.object().shape({
			value: Yup.string().required('Obrigatório')
		}),
		phones: Yup.array().of(Yup.object().shape({
			value: Yup.string().required('Obrigatório')
		})).min(1),
	});

	const [forcePassword, setForcePassword] = useState(false);

	return (
		<Formik
			validationSchema={userSchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={validateOnChange}
			validateOnBlur={false}
		>
			{({ values: { active, phones, role, assignedCompany, addresses }, setFieldValue, handleChange, isSubmitting }) => {
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
											<Field name='firstName' component={tField} label='Primeiro nome' />
										</FieldControl>
										<FieldControl>
											<Field name='lastName' component={tField} label='Sobrenome' />
										</FieldControl>
									</FormRow>
									<FormRow>
										<FieldControl>
											<FormControl>
												<Field name='email' component={tField} label='Email' />
												<FormHelperText>Email para acesso ao sistema ou aplicativo</FormHelperText>
											</FormControl>
										</FieldControl>
										<FieldControl>
											<FormControl>
												{forcePassword ?
													<Grid container>
														<Grid item xs='6'>
															<Field name='password' type='password' component={tField} label='Senha' />
															<FormHelperText>Vocês irá forçar uma senha para esse usuário</FormHelperText>
														</Grid>
														<Grid item xs='6' style={{ marginTop: 17, paddingLeft: 30 }}>
															<Button fullWidth onClick={()=>{setForcePassword(false); setFieldValue('password', '');}} variant='contained'>Cancelar</Button>
														</Grid>
													</Grid>
													:
													<Fragment>
														<Button onClick={()=>{setForcePassword(true)}} fullWidth={false} variant='contained' color='primary'>Forçar uma senha</Button>
														<FormHelperText>Caso não forçar uma senha, o usuário receberá uma notificação para criar uma senha no primeiro acesso</FormHelperText>
													</Fragment>
												}
											</FormControl>
										</FieldControl>
									</FormRow>
								</Paper>
							</Block>
							<Block>
								<BlockHeader>
									<BlockTitle>Outros dados do usuário</BlockTitle>
								</BlockHeader>
								<Paper>
									<BlockSeparator>
										<FormRow>
											<FieldControl>
												<Field name='document.value' action='document.action' component={tField} label='CPF' />
											</FieldControl>
											<FieldControl>
											</FieldControl>
										</FormRow>
									</BlockSeparator>
									<BlockSeparator>
										<FieldArray name='phones'>
											{ ({ insert, remove }) => (
												phones.filter((row)=>row.action !== 'delete').map((phone, index) => {
													return (<FormRow key={index}>
														<FieldControl>
															<Field action={`phones.${index}.action`} name={`phones.${index}.value`} component={tField} label='Telefone' />
														</FieldControl>
														<FieldControl>
															{index === 0 && <IconButton disabled={isSubmitting} onClick={(e)=>{e.preventDefault(); insert(index+1, metaModel('phone')); return false}}>
																<Icon path={mdiPlusCircle} size='18' color='#363E5E' />
															</IconButton>}
															{index > 0 && <IconButton disabled={isSubmitting} onClick={(e)=>{
																e.preventDefault();
																if (phone.action ==='create' || phone.action ==='new_empty')
																	return remove(index);
																else
																	setFieldValue(`phones.${index}.action`, 'delete')}}>
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
							{!!edit &&
						<Block>
							<BlockHeader>
								<BlockTitle>Endereços</BlockTitle>
							</BlockHeader>
							<Paper>
								<BlockSeparator>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell style={{ width: 30 }}></TableCell>
												<TableCell>Identificação</TableCell>
												<TableCell>Rua</TableCell>
												<TableCell>Bairro</TableCell>
												<TableCell>Cidade / Estado</TableCell>
												<TableCell>CEP</TableCell>
												<TableCell>Ações</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											<FieldArray name='phones'>
												{ () => (
													addresses.filter((row)=>row.action !== 'delete').map((address, index) => {
														return (
															<TableRow key={index}>
																<TableCell><Icon path={mdiMapMarker} color='#BCBCBC' size='18' /></TableCell>
																<TableCell>{address.value.name}</TableCell>
																<TableCell>{address.value.street}</TableCell>
																<TableCell>{address.value.district}</TableCell>
																<TableCell>{`${address.value.city} ${address.value.state}`}</TableCell>
																<TableCell>{address.value.zipcode}</TableCell>
																<TableCell>
																	<IconButton disabled={isSubmitting} onClick={()=>{setFieldValue(`addresses.${index}.action`, 'delete')}}>
																		<Icon path={mdiDelete} color='#BCBCBC' size='18' />
																	</IconButton>
																</TableCell>
															</TableRow>)
													}))
												}
											</FieldArray>
										</TableBody>
									</Table>
								</BlockSeparator>
							</Paper>
						</Block>}
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
														<Switch size='small' color='primary' checked={active} onChange={()=>{setFieldValue('active', !active)}} />
													}
													label="Ativo"
												/>
											</FieldControl>
										</FormRow>
										<FormRow>
											<FieldControl>
												<Button fullWidth type='submit' variant="contained" color='secondary'>Salvar</Button>
											</FieldControl>
										</FormRow>
									</BlockSeparator>
									<BlockSeparator>
										<FormRow>
											<FieldControl>
												<FormLabel>Opções</FormLabel>
											</FieldControl>
										</FormRow>
										<FormRow>
											<FieldControl>
												<TextField name='role' value={role} onChange={handleChange} select label='Função'>
													<MenuItem value='adm'>Administrador</MenuItem>
													<MenuItem value='customer'>Cliente</MenuItem>
													<MenuItem value='default'>Padrão</MenuItem>
												</TextField>
											</FieldControl>
										</FormRow>
									</BlockSeparator>
									<BlockSeparator>
										<FormRow>
											<FieldControl>
												<FormLabel>Relação com a empresa</FormLabel>
											</FieldControl>
										</FormRow>
										<FormRow>
											<FieldControl style={{ paddingLeft: 7 }}>
												<FormControlLabel
													labelPlacement='end'
													control={
														<Switch size='small' color='primary' checked={assignedCompany.active} onChange={()=>{setFieldValue('assignedCompany.active', !assignedCompany.active)}} />
													}
													label="Ativo"
												/>
											</FieldControl>
										</FormRow>
									</BlockSeparator>
								</Sidebar>
							</Block>
						</SidebarContainer>
					</Form>)}}
		</Formik>
	);
}