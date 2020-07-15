import React, { useState } from 'react'

import { Paper, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Typography } from '@material-ui/core';
import moment from 'moment';
import numeral from 'numeral';

export default function ListOrders({ report }) {
	const [pagination, setPagination] = useState({
		page: 0,
		rowsPerPage: 25
	})

	const orders = report.companies.reduce((allOrders, company)=>[...allOrders, ...company.orders], []);

	const offset = pagination.page * pagination.rowsPerPage;
	const limit = offset + pagination.rowsPerPage

	return (
		<>
			<TablePagination
				component="div"
				backIconButtonProps={{
					'aria-label': 'previous page',
				}}
				nextIconButtonProps={{
					'aria-label': 'next page',
				}}
				count={orders.length}
				rowsPerPage={pagination.rowsPerPage}
				page={pagination.page}
				onChangePage={(e, newPage)=>{setPagination({ ...pagination, page: newPage })}}
				onChangeRowsPerPage={(e)=>{setPagination({ ...pagination, page: 0, rowsPerPage: e.target.value });}}
			/>
			<Paper>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell><Typography variant='caption'>Data / Hora</Typography></TableCell>
							<TableCell><Typography variant='caption'>Faturamento</Typography></TableCell>
							<TableCell><Typography variant='caption'>Descontos</Typography></TableCell>
							<TableCell><Typography variant='caption'>Créditos</Typography></TableCell>
							<TableCell><Typography variant='caption'>Cupons</Typography></TableCell>
							<TableCell><Typography variant='caption'>Valor taxável</Typography></TableCell>
							<TableCell><Typography variant='caption'>Taxa cobrada</Typography></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{orders
							.slice(offset, limit)
							.map(row => (
								<TableRow key={row.id}>
									<TableCell>{moment(row.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
									<TableCell>{numeral(row.price).format('$0,0.00')}</TableCell>
									<TableCell>{numeral(row.discount).format('$0,0.00')}</TableCell>
									<TableCell>{row.creditHistory ? numeral(Math.abs(row.creditHistory.value)).format('$0,0.00') : '--'}</TableCell>
									<TableCell>{row.coupon ? `${numeral(row.couponValue).format('$0,0.00')} (${numeral(row.taxableCoupon).format('$0,0.00')})` : '--'}</TableCell>
									<TableCell>{numeral(row.taxable).format('$0,0.00')}</TableCell>
									<TableCell>{numeral(row.tax).format('$0,0.00')}</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</Paper>
			<TablePagination
				component="div"
				backIconButtonProps={{
					'aria-label': 'previous page',
				}}
				nextIconButtonProps={{
					'aria-label': 'next page',
				}}
				count={orders.length}
				rowsPerPage={pagination.rowsPerPage}
				page={pagination.page}
				onChangePage={(e, newPage)=>{setPagination({ ...pagination, page: newPage })}}
				onChangeRowsPerPage={(e)=>{setPagination({ ...pagination, page: 0, rowsPerPage: e.target.value });}}
			/>
		</>
	)
}