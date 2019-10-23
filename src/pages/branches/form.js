import React from 'react';
import {Paper, IconButton, FormControlLabel, Switch, Button} from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiPlusCircle, mdiDelete} from '@mdi/js';
import * as Yup from 'yup';
import { Formik, Form, Field, FieldArray } from 'formik';

import {meta_model} from '../../utils';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField} from '../../layout/components';

const branchSchema = Yup.object().shape({
	name: Yup.string().required('Obrigatório'),
	document : Yup.object().shape({
			meta_value:Yup.string().required('Obrigatório')
		}),
	address : Yup.object().shape({
		meta_value: Yup.object().shape({
				street: Yup.string().required('Obrigatório'),
				number: Yup.number().typeError('Deve ser um número').required('Obrigatório'),
				zipcode: Yup.string().required('Obrigatório'),
				district: Yup.string().required('Obrigatório'),
				city: Yup.string().required('Obrigatório'),
				state: Yup.string().required('Obrigatório'),
			})
		}),
	phones: Yup.array().of(Yup.object().shape({
			meta_value:Yup.string().required('Obrigatório')
		})).min(1),
	emails: Yup.array().of(Yup.object().shape({
			meta_value:Yup.string().required('Obrigatório').email('Email não é válido'),
		})).min(1),
});

export default function PageForm ({initialValues, onSubmit, pageTitle, validateOnChange}) {
	return (
		<Formik
			validationSchema={branchSchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={validateOnChange}
			validateOnBlur={false}
		>
			{({values:{active, phones, emails}, setFieldValue, handleChange, isSubmitting}) => (
			<Form>
				<Content>
					<Block>
						<BlockHeader>
							<BlockTitle>{pageTitle}</BlockTitle>
						</BlockHeader>
						<Paper>
							<FormRow>
								<FieldControl>
									<Field name='name' component={tField} label='Nome da Filial' />
								</FieldControl>
								<FieldControl>
									<Field name='document.meta_value' action='document.action' component={tField} label='CNPJ' />
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
									<Field name='address.meta_value.street' action='address.action' component={tField} label='Rua' />
								</FieldControl>
								<FieldControl style={{flex:.3}}>
									<Field name='address.meta_value.number' action='address.action' component={tField} label='Número' />
								</FieldControl>
								<FieldControl style={{flex:.3}}>
									<Field name='address.meta_value.zipcode' action='address.action' component={tField} label='CEP' />
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<Field name='address.meta_value.district' action='address.action' component={tField} label='Bairro' />
								</FieldControl>
								<FieldControl>
									<Field name='address.meta_value.city' action='address.action' component={tField} label='Cidade' />
								</FieldControl>
								<FieldControl>
									<Field name='address.meta_value.state' action='address.action' component={tField} label='Estado' />
								</FieldControl>
							</FormRow>
						</Paper>
					</Block>
					<Block>
						<BlockHeader>
							<BlockTitle>Outros dados da filial</BlockTitle>
						</BlockHeader>
						<Paper>
							<BlockSeparator>
								<FieldArray name='phones'>
								{ ({insert, remove}) => (
									phones.filter((row)=>row.action !== 'delete').map((phone, index) => {
										
										return (<FormRow key={index}>
											<FieldControl>
												<Field name={`phones.${index}.meta_value`} action={`phones.${index}.action`} component={tField} label='Telefone' />
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
														setFieldValue(`phones.${index}.action`, 'delete')
													}}>
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
									{ ({insert, remove}) => (
										emails.filter((row)=>row.action !== 'delete').map((email, index) => {
											return (<FormRow key={index}>
												<FieldControl>
													<Field name={`emails.${index}.meta_value`} action={`emails.${index}.action`} component={tField} label='Email' />
												</FieldControl>
												<FieldControl>
													{index === 0 && <IconButton disabled={isSubmitting} onClick={(e)=>{e.preventDefault(); insert(index+1, meta_model('email'))}}>
														<Icon path={mdiPlusCircle} size='18' color='#363E5E' />
													</IconButton>}
													{index > 0 && <IconButton disabled={isSubmitting} onClick={(e)=>{
														e.preventDefault();
														if (email.action ==='create' || email.action ==='new_empty')
															return remove(index);
														else
															setFieldValue(`emails.${index}.action`, 'delete');
														}}>
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
									<FieldControl style={{justifyContent:'flex-end', paddingRight:7}}>
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
										<Button fullWidth disabled={isSubmitting} type='submit' variant="contained" color='secondary'>Salvar</Button>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
						</Sidebar>
					</Block>
				</SidebarContainer>
			</Form>)}
		</Formik>
		
	)
}