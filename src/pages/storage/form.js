import React from 'react';
import {Paper, FormControlLabel, Switch, Button} from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField} from '../../layout/components';

const branchSchema = Yup.object().shape({
	name: Yup.string().required('Obrigatório'),
	description: Yup.string().notRequired(),
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
									<Field disabled={isSubmitting} name='name' component={tField} label='Nome do item' />
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<Field disabled={isSubmitting} name='description' component={tField} label='Descrição' />
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
												<Switch disabled={isSubmitting} size='small' color='primary' checked={active} onChange={()=>{setFieldValue('active', !active)}} value="includeDisabled" />
											}
											label="Ativo"
										/>
									</FieldControl>
								</FormRow>
								<FormRow>
									<FieldControl>
										<Button disabled={isSubmitting} fullWidth type='submit' variant="contained" color='secondary'>Salvar</Button>
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