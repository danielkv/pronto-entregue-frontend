import React from 'react';
import {Paper, TextField, IconButton, FormControlLabel, Switch, ButtonGroup, Button} from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiPlusCircle, mdiDelete} from '@mdi/js';
import {Formik, FieldArray, Form} from 'formik';
import { useQuery } from '@apollo/react-hooks';

import {setPageTitle} from '../../utils';
import Layout from '../../layout';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl} from '../../layout/components';

function Page (props) {
	setPageTitle('Nova empresa');

	const edit = !!props.match.params.id;
	const meta_model = {id:0, meta_type:'phone', meta_value:'', action:'create'};
	let loading = false;
	
	let company = {
		name:'',
		display_name:'',
		active:true,
		document:'',
		contact:'',
		address:{
			street:'',
			number:'',
			district:'',
			zipcode:'',
			city:'',
			state:'',
		},
		phones:[{id:0, meta_type:'phone', meta_value:'', action:'create'}],
		emails:[{id:0, meta_type:'phone', meta_value:'', action:'create'}],
	};

	/* if (edit) {
		let {data:companyData, loading} = useQuery(GET);
	} */

	function onSubmit(values) {
		console.log(values)
	}
	
	return (
		<Layout>
			<Formik
				initialValues={company}
				onSubmit={onSubmit}
				>
				{({values:{name, display_name, document, contact, active, address, phones, emails}, setFieldValue, handleChange})=> {
				return (<Form>
					<Content>
						<Block>
							<BlockHeader>
								<BlockTitle>Nova empresa</BlockTitle>
							</BlockHeader>
							<Paper>
								<FormRow>
									<FieldControl>
										<TextField value={display_name} name='display_name' onChange={(e)=>handleChange(e)} label='Nome Fantasia' />
									</FieldControl>
									<FieldControl>
										<TextField value={name} name='name' onChange={(e)=>handleChange(e)} label='Razão Social' />
									</FieldControl>
								</FormRow>
								<FormRow>
									<FieldControl>
										<TextField value={document} name='document' onChange={(e)=>handleChange(e)} label='CNPJ' />
									</FieldControl>
									<FieldControl>
										<TextField value={contact} name='contact' onChange={(e)=>handleChange(e)} label='Responsável' />
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
										<TextField value={address.street} name='address.street' onChange={(e)=>handleChange(e)} label='Rua' />
									</FieldControl>
									<FieldControl style={{flex:.3}}>
										<TextField value={address.number} name='address.number' onChange={(e)=>handleChange(e)} label='Número' />
									</FieldControl>
									<FieldControl style={{flex:.3}}>
										<TextField value={address.zipcode} name='address.zipcode' onChange={(e)=>handleChange(e)} label='CEP' />
									</FieldControl>
								</FormRow>
								<FormRow>
									<FieldControl>
										<TextField value={address.district} name='address.district' onChange={(e)=>handleChange(e)} label='Bairro' />
									</FieldControl>
									<FieldControl>
										<TextField value={address.city} name='address.city' onChange={handleChange} label='Cidade' />
									</FieldControl>
									<FieldControl>
										<TextField value={address.state} name='address.state' onChange={handleChange} label='Estado' />
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
									{ ({insert, remove}) => (
										phones.filter((row)=>row.action !== 'delete').map((phone, index) => {
											
											return (<FormRow key={index}>
												<FieldControl>
													<TextField value={phone.meta_value} name={`phones.${index}.meta_value`} onChange={handleChange} label='Telefone' />
												</FieldControl>
												<FieldControl>
													{index === 0 && <IconButton onClick={()=>insert(index+1, meta_model)}>
														<Icon path={mdiPlusCircle} size='18' color='#363E5E' />
													</IconButton>}
													{index > 0 && <IconButton onClick={()=>{if (phone.action ==='create') return remove(index); setFieldValue(`phones.${index}.action`, 'delete')}}>
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
														<TextField value={email.meta_value} name={`emails.${index}.meta_value`} onChange={handleChange} label='Email' />
													</FieldControl>
													<FieldControl>
														{index === 0 && <IconButton onClick={()=>insert(index+1, meta_model)}>
															<Icon path={mdiPlusCircle} size='18' color='#363E5E' />
														</IconButton>}
														{index > 0 && <IconButton onClick={()=>{if (email.action ==='create') return remove(index); setFieldValue(`emails.${index}.action`, 'delete')}}>
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
													<Switch size='small' color='primary' checked={active} name='active' onChange={handleChange}  />
												}
												label="Ativo"
											/>
										</FieldControl>
									</FormRow>
									<FormRow>
										<FieldControl>
											<ButtonGroup fullWidth>
												<Button color='secondary'>Cancelar</Button>
												<Button type="submit" variant="contained" color='secondary'>Salvar</Button>
											</ButtonGroup>
										</FieldControl>
									</FormRow>
								</BlockSeparator>
							</Sidebar>
						</Block>
					</SidebarContainer>
				</Form>)}}
			</Formik>
		</Layout>
	)
}

export default Page;