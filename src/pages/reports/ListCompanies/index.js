import React from 'react'

import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Avatar, TableFooter, Typography } from '@material-ui/core';
import numeral from 'numeral';

export default function ListCompanies({ report }) {
	const companies = report.companies;
	
	companies.sort((a, b) => {
		return a.orders.length > b.orders.length ? -1 : 1;
	});

	return (
		<Paper>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell style={{ width: 30, paddingRight: 10 }}></TableCell>
						<TableCell><Typography variant='caption'>Estabelecimento</Typography></TableCell>
						<TableCell><Typography variant='caption'>Pedidos</Typography></TableCell>
						<TableCell><Typography variant='caption'>Faturamento</Typography></TableCell>
						<TableCell><Typography variant='caption'>Cupons</Typography></TableCell>
						<TableCell><Typography variant='caption'>Descontos</Typography></TableCell>
						<TableCell><Typography variant='caption'>Entregas</Typography></TableCell>
						<TableCell><Typography variant='caption'>Taxa</Typography></TableCell>
						<TableCell><Typography variant='caption'>Repasse</Typography></TableCell>
						<TableCell><Typography variant='caption'>Remuneração</Typography></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{companies.map(row => (
						<TableRow key={row.id}>
							<TableCell style={{ width: 30, paddingLeft: 40, paddingRight: 10 }}><Avatar alt={row.displayName} src={row.image} /></TableCell>
							<TableCell>{row.displayName}</TableCell>
							<TableCell>{row.orders.length}</TableCell>
							<TableCell>{numeral(row.revenue).format('$0,0.00')}</TableCell>
							<TableCell>{numeral(row.coupons).format('$0,0.00')}</TableCell>
							<TableCell>{numeral(row.totalDiscount).format('$0,0.00')}</TableCell>
							<TableCell>{`${numeral(row.deliveryPaymentValue).format('$0,0.00')} (${row.countPeDelivery})`}</TableCell>
							<TableCell>{numeral(row.tax).format('$0,0.00')}</TableCell>
							<TableCell>{numeral(row.refund).format('$0,0.00')}</TableCell>
							<TableCell>{numeral(row.payment).format('$0,0.00')}</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell></TableCell>
						<TableCell></TableCell>
						<TableCell>{report.countOrders}</TableCell>
						<TableCell>{numeral(report.revenue).format('$0,0.00')}</TableCell>
						<TableCell>{numeral(report.coupons).format('$0,0.00')}</TableCell>
						<TableCell>{numeral(report.totalDiscount).format('$0,0.00')}</TableCell>
						<TableCell>{numeral(report.deliveryPaymentValue).format('$0,0.00')}</TableCell>
						<TableCell>{numeral(report.tax).format('$0,0.00')}</TableCell>
						<TableCell>{numeral(report.refund).format('$0,0.00')}</TableCell>
						<TableCell>{numeral(report.payment).format('$0,0.00')}</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
			{/* <TablePagination
				component="div"
				backIconButtonProps={{
					'aria-label': 'previous page',
				}}
				nextIconButtonProps={{
					'aria-label': 'next page',
				}}
				count={countCompanies}
				rowsPerPage={pagination.rowsPerPage}
				page={pagination.page}
				onChangePage={(e, newPage)=>{setPagination({ ...pagination, page: newPage })}}
				onChangeRowsPerPage={(e)=>{setPagination({ ...pagination, page: 0, rowsPerPage: e.target.value });}}
			/> */}
		</Paper>
	)
}
