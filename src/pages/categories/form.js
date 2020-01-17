import React from 'react';

import { Paper, FormControlLabel, Switch, Button, FormLabel, FormControl, FormHelperText } from '@material-ui/core';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField } from '../../layout/components';

import { DropzoneBlock } from '../../layout/blocks';

const FILE_SIZE = 500 * 1024;

export default function PageForm ({ initialValues, onSubmit, pageTitle, validateOnChange, edit }) {
	const categorySchema = Yup.object().shape({
		name: Yup.string().required('Obrigatório'),
		description: Yup.string().required('Obrigatório'),
		file: Yup.lazy(() => {
			if (!edit) {
				return Yup.mixed().required('Selecione uma imagem')
					.test('fileSize', 'Essa imagem é muito grande. Máximo 500kb', value => value && value.size <= FILE_SIZE)
			}
			
			return Yup.mixed().notRequired();
		}),
	});

	const handleDropFile = (setFieldValue) => (acceptedFiles) => {
		if ( Array.isArray(acceptedFiles)) {
			const file = acceptedFiles[0];
			const preview = URL.createObjectURL(file);
			setFieldValue('preview', preview);
			setFieldValue('file', file);
		}
	}

	return (
		<Formik
			validationSchema={categorySchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={validateOnChange}
			validateOnBlur={false}
		>
			{({ values: { active, preview }, setFieldValue, isSubmitting }) => (
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
										<FieldControl style={{ justifyContent: 'flex-end', paddingRight: 7 }}>
											<FormControlLabel
												labelPlacement='start'
												control={
													<Switch disabled={isSubmitting} size='small' color='primary' checked={active} onChange={()=>{setFieldValue('active', !active)}} value="includeDisabled" />
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
												<DropzoneBlock preview={preview} onDrop={handleDropFile(setFieldValue)} />
												<FormHelperText error><ErrorMessage name="file" /></FormHelperText>
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