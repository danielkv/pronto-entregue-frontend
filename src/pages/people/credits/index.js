import React, { useState } from 'react'

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Paper, Table, TableHead, TableRow, TableCell, TextField, TableBody, TablePagination, CircularProgress, Button, InputAdornment, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core'
import { useFormik } from 'formik'
import moment from 'moment';
import numeral from 'numeral';
import * as Yup from 'yup';

import { Block, BlockHeader, BlockTitle, BlockSeparator, FormRow, FieldControl } from '../../../layout/components'

import { sanitizeCreditHistory } from '../../../utils/creditHistory';
import { getErrors } from '../../../utils/error';

import { LOAD_USER_CREDIT_HISTORY, CREATE_CREDIT_HISTORY } from '../../../graphql/creditHistory';

const validationSchema = Yup.object().shape({
	history: Yup.string().required('Campo obrigatório'),
	value: Yup.number().typeError('Valor inválido').required('Campo obrigatório'),
})
const initialValues = {
	history: '',
	value: '',
}

export default function Credits({ userId }) {
	const [errorDialog, setErrorDialog] = useState(null);
	const [pagination, setPagination] = useState({
		page: 0,
		rowsPerPage: 10,
	});

	const { data: { user: { creditHistory = [], countCreditHistory = 0, creditBalance = 0 } = {} } = {}, loading: loadingCreditHistory } = useQuery(LOAD_USER_CREDIT_HISTORY, { variables: { id: userId, pagination } });
	const [createCreditHistory] = useMutation(CREATE_CREDIT_HISTORY, { variables: { userId }, refetchQueries: [{ query: LOAD_USER_CREDIT_HISTORY, variables: { id: userId, pagination } }] })

	function onSubmit(result, { resetForm }) {
		const data = sanitizeCreditHistory(result);
		return createCreditHistory({ variables: { data } })
			.then(() => {
				resetForm();
			})
			.catch((err)=>{
				setErrorDialog(getErrors(err));
			})
	}

	function handleCloseDialog() {
		setErrorDialog(null);
	}

	const { handleSubmit, handleChange, isSubmitting, errors, values } = useFormik({
		validationSchema,
		initialValues,
		onSubmit
	})

	return (
		<Block>
			<Dialog
				open={Boolean(errorDialog)}
				onClose={handleCloseDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">Ocorreu durante o envio do histórico</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{errorDialog}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="primary"autoFocus>Ok</Button>
				</DialogActions>
			</Dialog>
			<BlockHeader>
				<BlockTitle>Créditos</BlockTitle>
				{loadingCreditHistory ? <CircularProgress /> : <Chip color='primary' label={numeral(creditBalance).format('$0,00.00')} />}
			</BlockHeader>
			<Paper>
				<BlockSeparator>
					<FormRow>
						<FieldControl style={{ flex: .5 }}>
							<TextField
								disabled={isSubmitting}
								name='history'
								error={Boolean(errors.history)}
								helperText={Boolean(errors.history) && errors.history}
								value={values.history}
								onChange={handleChange}
								label='Histórico'
							/>
						</FieldControl>
						<FieldControl style={{ flex: .25 }}>
							<TextField
								disabled={isSubmitting}
								name='value'
								type='number'
								error={Boolean(errors.value)}
								helperText={Boolean(errors.value) && errors.value}
								value={values.value}
								onChange={handleChange}
								InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
								label='Valor'
							/>
						</FieldControl>
						<FieldControl style={{ alignItems: 'flex-start', marginTop: 16, flex: .25 }}>
							<Button fullWidth color='primary' disabled={isSubmitting} onClick={handleSubmit} variant='contained'>
								{isSubmitting
									? <CircularProgress />
									: 'Adicionar ao histórico'}
							</Button>
						</FieldControl>
					</FormRow>
				</BlockSeparator>
				{Boolean(creditHistory.length) && (
					<BlockSeparator>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell style={{ width: 30 }}></TableCell>
									<TableCell>Data</TableCell>
									<TableCell>Hitórico</TableCell>
									<TableCell>Valor</TableCell>
								</TableRow>
							</TableHead>
							{creditHistory.map(hist => {
								const createdAt = moment(hist.createdAt);
								const displayDate = moment().diff(createdAt, 'minute') >= 5 ? createdAt.format('DD/MM/YY HH:mm') : createdAt.fromNow();

								return (
									<TableBody key={hist.id}>
										<TableRow>
											<TableCell></TableCell>
											<TableCell>{displayDate}</TableCell>
											<TableCell>{hist.history}</TableCell>
											<TableCell>{numeral(hist.value).format('$0,0.00')}</TableCell>
										</TableRow>
									</TableBody>
								)
							})}
						</Table>
						<TablePagination
							component="div"
							backIconButtonProps={{
								'aria-label': 'previous page',
							}}
							nextIconButtonProps={{
								'aria-label': 'next page',
							}}
							count={countCreditHistory}
							rowsPerPage={pagination.rowsPerPage}
							page={pagination.page}
							onChangePage={(e, newPage)=>{setPagination({ ...pagination, page: newPage })}}
							onChangeRowsPerPage={(e)=>{setPagination({ ...pagination, page: 0, rowsPerPage: e.target.value });}}
						/>
					</BlockSeparator>
				)}
			</Paper>
		</Block>
	)
}
