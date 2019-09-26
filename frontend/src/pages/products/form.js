import React from 'react';
import {Paper, FormControlLabel, Switch, Button, FormLabel, FormControl, FormHelperText} from '@material-ui/core';

import * as Yup from 'yup';
import { Formik, FieldArray, Form, Field} from 'formik';

import ImagePlaceHolder from '../../assets/images/image_placeholder.png';
import {setPageTitle} from '../../utils';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField} from '../../layout/components';

import OptionsGroups from './options_groups';

const productSchema = Yup.object().shape({
	name: Yup.string().required('Obrigatório'),
	description: Yup.string().required('Obrigatório'),
	options_groups: Yup.array().of(Yup.object().shape({
		options: Yup.array().of(Yup.object().shape({
			price: Yup.number().required('Obrigatório')
		})),
	})),
});

export default function PageForm ({initialValues, onSubmit, pageTitle, validateOnChange}) {
	setPageTitle('Novo produto');

	/* const options_groups = [
		{
			name : 'Extras',
			type: 'multi',
			max_select_restrained_by: null,
			min_select: 0,
			max_select:2,
			active:true,
			order:1,
			options: [
				{
					name:'Bacon',
					max_select_restrain_other : null,
					active:true,
					price:5.30,
				},
				{
					name:'Hamburguer extra',
					max_select_restrain_other : null,
					active:false,
					price:4.30,
				},
			]
		}
	] */
	return (
		<Formik
			validationSchema={productSchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={validateOnChange}
			validateOnBlur={false}
		>
			{({values:{active, options_groups}, setFieldValue, handleChange, isSubmitting, errors}) => (
			<Form>
				<Content>
					<Block>
						<BlockHeader>
							<BlockTitle>{pageTitle}</BlockTitle>
						</BlockHeader>
						<Paper>
							<FormRow>
								<FieldControl>
									<Field component={tField} name='name' label='Nome do produto' />
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<Field component={tField} name='description' label='Descrição' />
								</FieldControl>
							</FormRow>
						</Paper>
					</Block>
					<Block>
						<BlockHeader>
							<BlockTitle>Opções</BlockTitle>
						</BlockHeader>
						<Paper>
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<FormControl>
											{/* <TextField select label='Grupo de opções'>
												<MenuItem value='1'>Grupo 1</MenuItem>
												<MenuItem value='2'>Grupo 2</MenuItem>
												<MenuItem value='3'>Grupo 3</MenuItem>
											</TextField> */}
											<FormHelperText>Crie um grupo novo ou copie um grupo já existente</FormHelperText>
										</FormControl>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
							<BlockSeparator>
								<FieldArray name={`options_groups`}>
									{({insert, remove}) => (
										options_groups.map((group, groupIndex)=>{
											const props = {
												groups: options_groups,
												group,
												groupIndex,
												insertGroup:insert,
												removeGroup:remove,

												setFieldValue,
												handleChange,
												errors
											}
											return <OptionsGroups key={group.id} {...props} />
										})
									)}
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
												<Switch size='small' color='primary' checked={true} onChange={()=>{}} value="includeDisabled" />
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
										<FormControl>
											<FormLabel>Imagem</FormLabel>
											<img src={ImagePlaceHolder} alt='Clique para adicionar uma imagem' />
										</FormControl>
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