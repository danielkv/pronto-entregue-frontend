import React, { useState, Fragment } from 'react';
import {Paper, TextField, FormControlLabel, Switch, Button, FormControl, FormHelperText, MenuItem, Table, TableBody, TableRow, TableCell, TableHead, IconButton, Grid, FormLabel} from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiSourceBranch, mdiMapMarker, mdiCloseCircle, mdiPlusCircle, mdiDelete } from '@mdi/js'
import * as Yup from 'yup';
import {Formik, FieldArray, Form, Field} from 'formik';
import { useQuery } from '@apollo/react-hooks';

import {meta_model} from '../../utils';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField, Loading} from '../../layout/components';
import gql from 'graphql-tag';

const GET_ROLES = gql`
	query  {
		roles {
			id
			name
			display_name
		}
	}
`;

export default function PageForm ({initialValues, onSubmit, pageTitle, validateOnChange, edit, selectedBranch, assignBranch}) {

	const userSchema = Yup.object().shape({
		first_name: Yup.string().required('Obrigatório'),
		last_name: Yup.string().required('Obrigatório'),
		email: Yup.string().required('Obrigatório'),
		password: Yup.lazy(value => {
				if (forcePassword)
					return Yup.string().required('Obrigatório');
				return Yup.string().notRequired();
			}),
		assigned_branches: Yup.lazy(value => {
				if (Array.isArray(value))
					return Yup.array().of(Yup.object().shape({
						user_relation: Yup.object().shape({
							role_id: Yup.string().required('Obrigatório')
						})
					}));
				return Yup.notRequired();
			}),
		document : Yup.object().shape({
				meta_value:Yup.string().required('Obrigatório')
			}),
		phones: Yup.array().of(Yup.object().shape({
				meta_value:Yup.string().required('Obrigatório')
			})).min(1),
	});

	const [forcePassword, setForcePassword] = useState(false);

	const {data:rolesData, loading:loadingRoles} = useQuery(GET_ROLES);

	if (loadingRoles) return <Loading />

	return (
		<Formik
			validationSchema={userSchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={validateOnChange}
			validateOnBlur={false}
		>
			{({values:{active, phones, role, assigned_branches, assigned_company, addresses}, errors, setFieldValue, handleChange, isSubmitting}) => {
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
									<Field name='first_name' component={tField} label='Primeiro nome' />
								</FieldControl>
								<FieldControl>
									<Field name='last_name' component={tField} label='Sobrenome' />
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
											<Grid item xs='6' style={{marginTop:17, paddingLeft:30}}>
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
										<Field name='document.meta_value' action='document.action' component={tField} label='CPF' />
									</FieldControl>
									<FieldControl>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
							<BlockSeparator>
								<FieldArray name='phones'>
									{ ({insert, remove}) => (
										phones.filter((row)=>row.action !== 'delete').map((phone, index) => {
											return (<FormRow key={index}>
												<FieldControl>
													<Field action={`phones.${index}.action`} name={`phones.${index}.meta_value`} component={tField} label='Telefone' />
												</FieldControl>
												<FieldControl>
													{index === 0 && <IconButton disabled={isSubmitting} onClick={(e)=>{e.preventDefault(); insert(index+1, meta_model('phone')); return false}}>
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
					<Block>
						<BlockHeader>
							<BlockTitle>Filiais vinculadas</BlockTitle>
						</BlockHeader>
						<FieldArray name='assigned_branches'>
							{({insert, remove}) => (
							<Paper>									
								<BlockSeparator>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell style={{width:30}}></TableCell>
												<TableCell>Filial</TableCell>
												<TableCell style={{width:200}}>Função</TableCell>
												<TableCell style={{width:100}}>Ações</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{assigned_branches.filter((row)=>row.action !== 'unassign').map((branch, index) => {
												return (
													<TableRow key={branch.id}>
														<TableCell><Icon path={mdiSourceBranch} color='#BCBCBC' size='18' /></TableCell>
														<TableCell>{branch.name}</TableCell>
														<TableCell>
															<TextField select disabled={isSubmitting}
																error={!!errors.assigned_branches && !!errors.assigned_branches[index] && !!errors.assigned_branches[index].user_relation.role_id}
																helperText={errors.assigned_branches && !!errors.assigned_branches[index] ? errors.assigned_branches[index].user_relation.role_id : ''}
																value={branch.user_relation.role_id}
																name={`assigned_branches.${index}.user_relation.role_id`}
																onChange={(e)=>{
																	handleChange(e);
																	if (branch.action === '') setFieldValue(`assigned_branches.${index}.action`, 'update');
																}}
															>
																{rolesData.roles.map(role=>
																<MenuItem key={role.id} value={role.id}>{role.display_name}</MenuItem>
																)}
															</TextField>
														</TableCell>
														<TableCell>
															<Switch
																checked={branch.user_relation.active}
																disabled={isSubmitting}
																onChange={()=>{
																	setFieldValue(`assigned_branches.${index}.user_relation.active`, !branch.user_relation.active);
																	if (branch.action === '') setFieldValue(`assigned_branches.${index}.action`, 'update');
																}}
																size='small'
															/>
															<IconButton
																disabled={isSubmitting}
																onClick={()=>{
																	if (branch.action === '')
																		setFieldValue(`assigned_branches.${index}.action`, 'unassign');
																	else
																		remove(index);
																}}
																>
																<Icon path={mdiCloseCircle} color='#BCBCBC' size='18' />
															</IconButton>
														</TableCell>
													</TableRow>)
											})}
										</TableBody>
									</Table>
								</BlockSeparator>
								{!assigned_branches.some(branch=> branch.id === selectedBranch) && 
								<BlockSeparator>
									<FormRow>
										<FieldControl>
											<Button disabled={isSubmitting} onClick={()=>{insert(assigned_branches.length, assignBranch)}} variant='contained'>Vincular filial selecionada</Button>
										</FieldControl>
									</FormRow>
								</BlockSeparator>}
							</Paper>)}
						</FieldArray>
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
												<TableCell style={{width:30}}></TableCell>
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
												{ ({insert, remove}) => (
													addresses.filter((row)=>row.action !== 'delete').map((address, index) => {
														return (
														<TableRow key={index}>
															<TableCell><Icon path={mdiMapMarker} color='#BCBCBC' size='18' /></TableCell>
															<TableCell>{address.meta_value.name}</TableCell>
															<TableCell>{address.meta_value.street}</TableCell>
															<TableCell>{address.meta_value.district}</TableCell>
															<TableCell>{`${address.meta_value.city} ${address.meta_value.state}`}</TableCell>
															<TableCell>{address.meta_value.zipcode}</TableCell>
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
									<FieldControl style={{justifyContent:'flex-end', paddingRight:7}}>
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
									<FieldControl style={{ paddingLeft:7}}>
										<FormControlLabel
											labelPlacement='end'
											control={
												<Switch size='small' color='primary' checked={assigned_company.active} onChange={()=>{setFieldValue('assigned_company.active', !assigned_company.active)}} />
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