import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useQuery } from '@apollo/react-hooks';
import { Paper, TextField, FormControlLabel, Switch, Button, FormControl, FormHelperText, MenuItem, Table, TableBody, TableRow, TableCell, TableHead, IconButton, Grid, FormLabel, ListSubheader, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { mdiMapMarker, mdiPlusCircle, mdiDelete, mdiMapMarkerRadius } from '@mdi/js'
import Icon from '@mdi/react';
import { FieldArray, Form, Field } from 'formik';
import { isEmpty } from 'lodash';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField } from '../../layout/components';

import { useSelectedCompany, useLoggedUserRole, useLoggedUserId } from '../../controller/hooks';
import { errorObjectsToArray } from '../../utils/error';
import { metaModel } from '../../utils/metas';
import Credits from './credits';

import { LOAD_COMPANY } from '../../graphql/companies';
import { GET_ROLES } from '../../graphql/roles';

export default function PageForm ({ edit, pageTitle, errors, isValidating, values: { active, phones, role, assignCompany, addresses, forcePassword }, setFieldValue, handleChange, isSubmitting }) {
	const { id: editId } = useParams();
	const loggedUserId = useLoggedUserId();
	const [errorDialog, setErrorDialog] = useState(false);
	const loggedUserRole = useLoggedUserRole();
	const selectedCompany = useSelectedCompany();
	const { data: { company = null } = {} } = useQuery(LOAD_COMPANY, { variables: { id: selectedCompany } });

	const { data: { roles = [] } = {} } = useQuery(GET_ROLES);

	useEffect(() => {
		if (!assignCompany && (!['master', 'adm', 'deliveryMan'].includes(role))) setFieldValue('role', 'customer');
	}, [setFieldValue, assignCompany, role])

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
												<Button fullWidth onClick={()=>{setFieldValue('forcePassword', false); setFieldValue('password', '');}} variant='contained'>Cancelar</Button>
											</Grid>
										</Grid>
										:
										<Fragment>
											<Button onClick={()=>{setFieldValue('forcePassword', true)}} fullWidth={false} variant='contained' color='primary'>Forçar uma senha</Button>
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
													<Icon path={mdiPlusCircle} size={1} color='#363E5E' />
												</IconButton>}
												{index > 0 && <IconButton disabled={isSubmitting} onClick={(e)=>{
													e.preventDefault();
													if (phone.action ==='create' || phone.action ==='new_empty')
														return remove(index);
													else
														setFieldValue(`phones.${index}.action`, 'delete')}}>
													<Icon path={mdiDelete} size={1} color='#707070' />
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
								<FieldArray name='addresses'>
									{ ({ remove }) => (
										addresses.filter((row)=>row.action !== 'delete').map((address, index) => {
											return (
												<TableRow key={index}>
													<TableCell><Icon path={mdiMapMarker} color='#BCBCBC' size={1} /></TableCell>
													<TableCell>{address.name}</TableCell>
													<TableCell>{address.street}</TableCell>
													<TableCell>{address.district}</TableCell>
													<TableCell>{`${address.city} ${address.state}`}</TableCell>
													<TableCell>{address.zipcode}</TableCell>
													<TableCell>
														<IconButton disabled={isSubmitting} target='_new' href={`https://www.google.com/maps/place/${address.location[0]},${address.location[1]}/@${address.location[0]},${address.location[1]},17z`}>
															<Icon path={mdiMapMarkerRadius} color='#BCBCBC' size={1} />
														</IconButton>
														<IconButton disabled={isSubmitting} onClick={()=>{remove(index)}}>
															<Icon path={mdiDelete} color='#BCBCBC' size={1} />
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
				{Boolean(editId) && <Credits userId={editId} />}
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
											<Switch size='small' disabled={isSubmitting || loggedUserId === editId} color='primary' checked={active} onChange={()=>{setFieldValue('active', !active)}} />
										}
										label="Ativo"
									/>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<Button fullWidth type='submit' disabled={isSubmitting} variant="contained" color='primary'>Salvar</Button>
								</FieldControl>
							</FormRow>
						</BlockSeparator>
						<BlockSeparator>
							<FormRow>
								<FieldControl>
									<FormLabel>{`Administrador de ${company && company.name}`}</FormLabel>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl style={{ paddingLeft: 7 }}>
									<FormControlLabel
										labelPlacement='end'
										control={
											<Switch disabled={loggedUserId === editId} size='small' color='primary' checked={assignCompany} onChange={()=>{setFieldValue('assignCompany', !assignCompany)}} />
										}
										label={assignCompany ? 'Vinculado' : 'Desvinculado'}
									/>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<TextField disabled={loggedUserId === editId} name='role' value={role} onChange={handleChange} select label='Função'>
										{loggedUserRole === 'master' && <MenuItem key='master' value='master'>ADM (Master)</MenuItem>}
										{loggedUserRole === 'deliveryMan' && <MenuItem key='deliveryMan' value='deliveryMan'>Entregador</MenuItem>}
										<MenuItem key='customer' value='customer'>Cliente</MenuItem>
										{assignCompany && <ListSubheader>Permissões</ListSubheader>}
										{assignCompany &&
											roles.map(r => (<MenuItem key={r.id} value={r.name}>{r.displayName}</MenuItem>))
										}
									</TextField>
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
	);
}