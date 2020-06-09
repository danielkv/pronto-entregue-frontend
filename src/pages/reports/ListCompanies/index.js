import React from 'react'

import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Avatar, TableFooter } from '@material-ui/core';
import numeral from 'numeral';

export default function ListCompanies({ report }) {
	return (
		<Paper>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell style={{ width: 30, paddingRight: 10 }}></TableCell>
						<TableCell>Estabelecimento</TableCell>
						<TableCell>Faturamento último mês</TableCell>
						<TableCell>Descontos</TableCell>
						<TableCell>Créditos</TableCell>
						<TableCell>Cupons</TableCell>
						<TableCell>Valor taxável</TableCell>
						<TableCell>Taxa cobrada</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{report.companies.map(row => (
						<TableRow key={row.id}>
							<TableCell style={{ width: 30, paddingLeft: 40, paddingRight: 10 }}><Avatar alt={row.displayName} src={row.image} /></TableCell>
							<TableCell>{row.displayName}</TableCell>
							<TableCell>{numeral(row.revenue).format('$0,0.00')}</TableCell>
							<TableCell>{numeral(row.companyDiscount).format('$0,0.00')}</TableCell>
							<TableCell>{row.credits ? numeral(row.credits).format('$0,0.00')  : '--'}</TableCell>
							<TableCell>{row.coupons ? `${numeral(row.coupons).format('$0,0.00')} (${numeral(row.taxableCoupon).format('$0,0.00')})` : '--'}</TableCell>
							<TableCell>{numeral(row.taxable).format('$0,0.00')}</TableCell>
							<TableCell>{numeral(row.tax).format('$0,0.00')}</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell></TableCell>
						<TableCell></TableCell>
						<TableCell>{numeral(report.revenue).format('$0,0.00')}</TableCell>
						<TableCell>{numeral(report.companyDiscount).format('$0,0.00')}</TableCell>
						<TableCell>{numeral(report.credits).format('$0,0.00')}</TableCell>
						<TableCell>{numeral(report.taxable).format('$0,0.00')}</TableCell>
						<TableCell>{numeral(report.tax).format('$0,0.00')}</TableCell>
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
