import React, { useState } from 'react'
import { useParams } from 'react-router-dom';

import { useMutation } from '@apollo/react-hooks';
import { Paper, Typography, useTheme, TextField, Button, CircularProgress } from '@material-ui/core'
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup'

import { ReactComponent as CheckIcon } from '../../assets/icons/check-circle.svg';
import { ReactComponent as KeyIcon } from '../../assets/icons/key.svg';
import { ReactComponent as LogoSvg } from '../../assets/images/simbolo.svg';
import { getErrors } from '../../utils/error';

import { UPDATE_USER_PASSWORD } from '../../graphql/users';

const initialValues = {
	password: '',
	repeatPassword: '',
}

const validationSchema = Yup.object().shape({
	password: Yup.string().required('A senha é obrigatória'),
	repeatPassword: Yup.string().test('test-repeat-email', 'A senha está diferente', function(value){return value===this.parent.password})
});

export default function RecoverPassword() {
	const { token } = useParams();
	const { enqueueSnackbar } = useSnackbar();
	const { palette } = useTheme();
	const [updateUserPassword] = useMutation(UPDATE_USER_PASSWORD, { variables: { token } })
	const [recovered, setRecovered] = useState(false);

	function onSubmit (result) {
		return updateUserPassword({ variables: { newPassword: result.password } })
			.then(()=>setRecovered(true))
			.catch((err)=>{
				enqueueSnackbar(getErrors(err), { variant: 'error' })
			})
	}

	const { isSubmitting, handleSubmit, handleChange, values: { password, repeatPassword }, errors } = useFormik({
		onSubmit,
		initialValues,
		validationSchema
	})

	return (
		<div style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 40, display: 'flex', boxSizing: 'border-box', height: '100%', backgroundColor: '#EFE8DA', flexDirection: 'column' }}>
			<LogoSvg title='Pronto, Entregue!' style={{ width: 80, height: 'auto', maxWidth: '20%', marginTop: '1%', marginBottom: '1%' }} />
			<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', marginTop: 40, marginBottom: 35 }}>
				<KeyIcon style={{ color: palette.primary.main, height: 30, width: 30, marginRight: 20 }} />
				<Typography style={{ color: palette.primary.main, fontSize: 24, fontWeight: 'bold' }}>Criar nova senha</Typography>
			</div>
			{recovered
				? (
					<Paper style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', padding: 35 }}>
						<CheckIcon style={{ color: palette.primary.main, height: 30, width: 30, marginRight: 20 }} />
						<Typography style={{ fontSize: 20 }}>Sua nova senha foi salva!</Typography>
					</Paper>
				)
				: (
					<form onSubmit={handleSubmit} style={{ display: 'contents' }}>
						<Paper style={{ width: 350, maxWidth: '100%', marginRight: 10, marginLeft: 10, boxSizing: 'border-box', padding: 35 }} elevation={5}>
							<Typography style={{ textAlign: 'center', fontSize: 18 }}>Digite abaixo sua senha</Typography>

							<TextField
								name='password'
								value={password}
								onChange={handleChange}
								label='Nova senha'
								error={!!errors.password}
								helperText={errors.password}
								style={{ marginTop: 15 }}
							/>
							<TextField
								name='repeatPassword'
								value={repeatPassword}
								onChange={handleChange}
								label='Repita a nova senha'
								error={!!errors.repeatPassword}
								helperText={errors.repeatPassword}
								style={{ marginTop: 10 }}
							/>
							<div style={{ marginTop: 20 }}>
								<Button type='submit' disabled={isSubmitting} variant='contained' color='primary' fullWidth>
									{isSubmitting
										? <CircularProgress color='primary' />
										: 'Salvar'}
								</Button>
							</div>
						</Paper>
						<Typography variant='caption' style={{ marginTop: 10 }}>Não é possível desfazer esta ação</Typography>
					</form>
				)}
		</div>
	)
}
