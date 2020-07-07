import React from 'react'

import { Card, CardContent, TextField, Container, Typography, FormControl, Button, CircularProgress } from '@material-ui/core'
import { useFormik } from 'formik'
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
	title: Yup.string().required('O título da notificação é obrigatório'),
	body: Yup.string().required('A mensagem da notificação é obrigatória'),
})

export default function NotificationForm({ onSubmit }) {
	const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormik({
		initialValues: { title: '', body: '' },
		validationSchema,
		onSubmit
	});
	return (
		<Container>
			<Typography variant='h6' component='h3'>Mensagem</Typography>
			<Card>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FormControl>
							<TextField
								disabled={isSubmitting}
								label='Título'
								name='title'
								error={!!errors.title}
								helperText={!!errors.body && errors.title}
								onChange={handleChange}
								value={values.title}
							/>
						</FormControl>
						<FormControl style={{ marginTop: 10 }}>
							<TextField
								disabled={isSubmitting}
								name='body'
								error={!!errors.body}
								helperText={!!errors.body && errors.body}
								onChange={handleChange}
								value={values.body}
								multiline
								label='Mensagem'
							/>
						</FormControl>
						<FormControl style={{ marginTop: 20 }}>
							<Button
								disabled={isSubmitting}
								variant='contained'
								type='submit'
								color='primary'
							>
								{isSubmitting
									? <CircularProgress size={15} style={{ margin: 5 }} />
									: 'Enviar'}
							</Button>
						</FormControl>
					</form>
				</CardContent>
			</Card>
		</Container>
	)
}
