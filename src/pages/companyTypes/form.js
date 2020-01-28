import React from 'react';

import { Paper, FormControlLabel, Switch, Button, FormLabel, FormControl, FormHelperText } from '@material-ui/core';
import { Form, Field, ErrorMessage } from 'formik';

import { Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField } from '../../layout/components';

import { DropzoneBlock } from '../../layout/blocks';

export default function PageForm ({ values: { active, preview }, setFieldValue, isSubmitting, pageTitle }) {
	const handleDropFile = (setFieldValue) => (acceptedFiles) => {
		if ( Array.isArray(acceptedFiles)) {
			const file = acceptedFiles[0];
			const preview = URL.createObjectURL(file);
			setFieldValue('preview', preview);
			setFieldValue('file', file);
		}
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
		</Form>
	);
}