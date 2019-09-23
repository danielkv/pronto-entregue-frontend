import React from 'react';
import {Paper, FormControlLabel, Switch, Button, FormLabel, FormControl} from '@material-ui/core';
import {Formik, Form, Field} from 'formik';
import Dropzone from 'react-dropzone';
import * as Yup from 'yup';

import ImagePlaceHolder from '../../assets/images/image_placeholder.png';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField} from '../../layout/components';

const categorySchema = Yup.object().shape({
	name: Yup.string().required('Obrigatório'),
	description: Yup.string().required('Obrigatório'),
});

export default function PageForm ({initialValues, onSubmit, pageTitle, validateOnChange}) {
	const handleDropFile = () => {

	}

	return (
		<Formik
			validationSchema={categorySchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={validateOnChange}
			validateOnBlur={false}
		>
			{({values:{active}, setFieldValue, handleChange, isSubmitting}) => (
			<Form>
				<Content>
					<Block>
						<BlockHeader>
							<BlockTitle>{pageTitle}</BlockTitle>
						</BlockHeader>
						<Paper>
							<FormRow>
								<FieldControl>
									<Field name='name' component={tField} label='Nome da categoria' />
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<Field name='description' component={tField} label='Descrição' />
								</FieldControl>
							</FormRow>
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
												<Switch disabled={isSubmitting} size='small' color='primary' checked={true} onChange={()=>{}} value="includeDisabled" />
											}
											label="Ativo"
										/>
									</FieldControl>
								</FormRow>
								<FormRow>
									<FieldControl>
										<Button type='submit' disabled={isSubmitting} fullWidth variant="contained" color='secondary'>Salvar</Button>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
							<BlockSeparator>
								<FormRow>
									<FieldControl>
										<FormControl>
											<FormLabel>Imagem</FormLabel> 
											<Dropzone accept="image/*" onDropAccepted={handleDropFile}>
												{({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
												<div
													{...getRootProps()}
													isDragActive={isDragActive}
													isDragReject={isDragReject}
												>
													<input {...getInputProps()} />
													<img src={ImagePlaceHolder} alt='Clique para adicionar uma imagem' />
												</div>
												)}
											</Dropzone>
											
										</FormControl>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
						</Sidebar>
					</Block>
				</SidebarContainer>
		</Form>)} 
	</Formik>)
}