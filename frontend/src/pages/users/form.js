import React from 'react';
import {Paper, TextField, FormControlLabel, Switch, ButtonGroup, Button, FormControl, FormHelperText, MenuItem, Table, TableBody, TableRow, TableCell, TableHead, IconButton, Grid} from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiStore, mdiSourceBranch, mdiMapMarker, mdiCloseCircle, mdiPlusCircle, mdiDelete } from '@mdi/js'
import * as Yup from 'yup';
import {Formik, FieldArray, Form, Field} from 'formik';

import {meta_model} from '../../utils';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField} from '../../layout/components';

const userSchema = Yup.object().shape({
	first_name: Yup.string().required('Obrigatório'),
	last_name: Yup.string().required('Obrigatório'),
	email: Yup.string().required('Obrigatório'),
	document : Yup.object().shape({
			meta_value:Yup.string().required('Obrigatório')
		}),
	phones: Yup.array().of(Yup.object().shape({
			meta_value:Yup.string().required('Obrigatório')
		})).min(1),
});

export default function pageForm ({initialValues, onSubmit, pageTitle, validateOnChange, edit}) {
	return (
		<Formik
			validationSchema={userSchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={validateOnChange}
			validateOnBlur={false}
		>
			{({values:{active, phones}, setFieldValue, handleChange, isSubmitting}) => (
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
										<Button fullWidth={false} variant='contained' color='primary'>Forçar uma senha</Button>
										<FormHelperText>Caso não forçar uma senha, o usuário receberá uma notificação para criar uma senha no primeiro acesso</FormHelperText>
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
										<Field name='document.meta_value' component={tField} label='CPF' />
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
													<Field name={`phones.${index}.meta_value`} component={tField} label='Telefone' />
												</FieldControl>
												<FieldControl>
													{index === 0 && <IconButton disabled={isSubmitting} onClick={(e)=>{e.preventDefault(); insert(index+1, meta_model('phone')); return false}}>
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
						</Paper>
					</Block>
					<Block>
						<BlockHeader>
							<BlockTitle>Filiais vinculadas</BlockTitle>
						</BlockHeader>
						<Paper>
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<TextField label='Buscar filial' />
									</FieldControl>
								</FormRow>
							</BlockSeparator>
							<BlockSeparator>
								<Table>
									<TableBody>
										<TableRow>
											<TableCell style={{width:30}}>
												<Icon path={mdiSourceBranch} color='#BCBCBC' size='18' />
											</TableCell>
											<TableCell>Copeiro 1</TableCell>
											<TableCell style={{width:30}}><Icon path={mdiCloseCircle} color='#BCBCBC' size='18' /></TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</BlockSeparator>
						</Paper>
					</Block>
					{!!edit &&
						<Block>
							<BlockHeader>
								<BlockTitle>Enderços</BlockTitle>
							</BlockHeader>
							<Paper>
								<BlockSeparator>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell></TableCell>
												<TableCell>Identificação</TableCell>
												<TableCell>Rua</TableCell>
												<TableCell>Bairro</TableCell>
												<TableCell>Cidade / Estado</TableCell>
												<TableCell>CEP</TableCell>
												<TableCell>Ações</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											<TableRow>
												<TableCell style={{width:30}}><Icon path={mdiMapMarker} color='#BCBCBC' size='18' /></TableCell>
												<TableCell>Casa</TableCell>
												<TableCell>Rua João Quartieiro</TableCell>
												<TableCell>Centro</TableCell>
												<TableCell>Sombrio SC</TableCell>
												<TableCell>88960-000</TableCell>
												<TableCell style={{width:30}}>
													<IconButton>
														<Icon path={mdiDelete} color='#BCBCBC' size='18' />
													</IconButton>
												</TableCell>
											</TableRow>
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
												<Switch size='small' color='primary' checked={true} onChange={()=>{}} value="includeDisabled" />
											}
											label="Ativo"
										/>
									</FieldControl>
								</FormRow>
								<FormRow>
									<FieldControl>
										<ButtonGroup fullWidth>
											<Button color='secondary'>Cancelar</Button>
											<Button variant="contained" color='secondary'>Salvar</Button>
										</ButtonGroup>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<FormControl>
											<TextField select label='Função'>
												<MenuItem value='adm'>Administrador</MenuItem>
												<MenuItem value='branch_manager'>Gerente de Filiais</MenuItem>
												<MenuItem value='manager'>Gerente</MenuItem>
												<MenuItem value='seller'>Vendedor</MenuItem>
												<MenuItem value='customer'>Consumidor</MenuItem>
											</TextField>
										</FormControl>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
						</Sidebar>
					</Block>
				</SidebarContainer>
			</Form>)}
		</Formik>
	);
}