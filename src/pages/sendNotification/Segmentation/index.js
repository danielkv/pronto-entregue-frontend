import React, { useState } from 'react'

import DateFnsUtils from '@date-io/date-fns';
import { Typography, ExpansionPanel, ExpansionPanelSummary, FormControlLabel, Checkbox, Grid, withStyles, ExpansionPanelDetails, FormGroup, Button, CircularProgress } from '@material-ui/core'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'
import { mdiChevronDown } from '@mdi/js'
import Icon from '@mdi/react'
import brLocale from 'date-fns/locale/pt-BR';
import moment from 'moment';

import UserAutoComplete from './userAutoComplete';

const ExpansionPanelDetailsStyled = withStyles({
	root: {
		backgroundColor: '#fafafa'
	}
})(ExpansionPanelDetails)

const initialSubscriptionPeriod = {
	selected: false,
	start: moment().startOf('week'),
	end: moment().endOf('week'),
}

const initialOrderPeriod = {
	selected: false,
	start: moment().subtract(1, 'week').startOf('week'),
	end: moment().endOf('week'),
}

const initialTypes = {
	selected: false,
	desktop: true,
	device: true
}

const initialCompanies = {
	selected: false,
	companies: []
}

const initialTo = {
	selected: false,
	to: []
}

export default function Segmentation({ setFilter, countTokensUsers, companies, loading }) {
	const [subscriptionPeriod, setSubscriptionPeriod] = useState(()=>initialSubscriptionPeriod)
	const [orderPeriod, setOrderPeriod] = useState(()=>initialOrderPeriod)
	const [companiesFilter, setCompaniesFilter] = useState(()=>initialCompanies)
	const [types, setTypes] = useState(()=>initialTypes)
	const [to, setTo] = useState(()=>initialTo);

	const handleSelectCompany = (companyId) => (e, newValue) => {
		if (newValue) {
			setCompaniesFilter(v => ({ ...v, companies: [...v.companies, companyId] }));
		} else {
			const foundIndex = companiesFilter.companies.findIndex(c => c === companyId);
			const newCompaniesFilter = [...companiesFilter.companies];

			newCompaniesFilter.splice(foundIndex, 1);
			setCompaniesFilter(v => ({ ...v, companies: newCompaniesFilter }));
		}
	}

	function applyFilter () {
		const filter = {}

		if (subscriptionPeriod.selected) {
			const formatedStart = moment(subscriptionPeriod.start).format('YYYY-MM-DD');
			const formatedEnd = moment(subscriptionPeriod.end).format('YYYY-MM-DD');

			filter['$user.createdAt$'] = { '$between': [`$DATE(${formatedStart})`, `$DATE(${formatedEnd})`] };
		}

		if (companiesFilter.selected) {
			filter['$orders.id$'] = { '$not': null };
			filter['$orders.companyId$'] = { '$or': companiesFilter.companies };
		}

		if (orderPeriod.selected) {
			const formatedStart = moment(orderPeriod.start).format('YYYY-MM-DD');
			const formatedEnd = moment(orderPeriod.end).format('YYYY-MM-DD');

			filter['$orders.id$'] = { '$not': null };
			filter['$orders.createdAt$'] = { '$between': [`$DATE(${formatedStart})`, `$DATE(${formatedEnd})`] };
		}

		if (types.selected) {
			filter.types = []
			if (types.device) filter.types.push('device');
			if (types.desktop) filter.types.push('desktop');
		} else {
			filter.types = ['device', 'desktop']
		}
		
		if (to.selected) {
			filter.to = to.to
		}

		setFilter(filter);
		return filter;
	}


	return (
		<div>
			<Typography variant='h6' component='h3'>Segmentação {loading && <CircularProgress size={20} />}</Typography>
			<div style={{ padding: 10 }}>
				<Typography variant='body2'><Typography style={{ fontWeight: 'bold', display: 'inline-block' }}>Dispositivos móveis:</Typography> {countTokensUsers.device}</Typography>
				<Typography variant='body2'><Typography style={{ fontWeight: 'bold', display: 'inline-block' }}>Desktop (navegadores):</Typography> {countTokensUsers.desktop}</Typography>
			</div>
			<ExpansionPanel expanded={subscriptionPeriod.selected}>
				<ExpansionPanelSummary>
					<div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<FormControlLabel
							control={<Checkbox checked={subscriptionPeriod.selected} onChange={()=>setSubscriptionPeriod(v=>({ ...v, selected: !v.selected }))} name="user-createdAt" />}
							label="Usuário cadastrou em"
						/>
						<Icon path={mdiChevronDown} size={.8} color='#333' />
					</div>
				</ExpansionPanelSummary>
				<ExpansionPanelDetailsStyled>
					<MuiPickersUtilsProvider utils={DateFnsUtils} locale={brLocale}>
						<Grid container spacing={6}>
							<Grid item sm={6}>
								<DatePicker
									ampm={false}
									variant='inline'
									format='dd/MM/yyyy'
									label="Início do periodo"
									value={subscriptionPeriod.start}
									onChange={(value)=>setSubscriptionPeriod({ ...subscriptionPeriod, start: value })}
								/>
							</Grid>
							<Grid item sm={6}>
								<DatePicker
									ampm={false}
									variant='inline'
									format='dd/MM/yyyy'
									label="Final do periodo"
									value={subscriptionPeriod.end}
									onChange={(value)=>setSubscriptionPeriod({ ...subscriptionPeriod, end: value })}
								/>
							</Grid>
						</Grid>
					</MuiPickersUtilsProvider>
				</ExpansionPanelDetailsStyled>
			</ExpansionPanel>
			<ExpansionPanel expanded={companiesFilter.selected}>
				<ExpansionPanelSummary>
					<div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<FormControlLabel
							control={<Checkbox checked={companiesFilter.selected} onChange={()=>setCompaniesFilter(v=>({ ...v, selected: !v.selected }))} name="gilad" />}
							label="Comprou em algum dos estabelecimentos"
						/>
						<Icon path={mdiChevronDown} size={.8} color='#333' />
					</div>
				</ExpansionPanelSummary>
				<ExpansionPanelDetailsStyled style={{ flexDirection: 'column' }}>
					{companies.map(company =>
						<div key={company.id}>
							<FormControlLabel
								onChange={handleSelectCompany(company.id)}
								control={<Checkbox checked={companiesFilter.companies.includes(company.id)} name={company.displayName} />}
								label={company.displayName}
							/>
						</div>
					)}
				</ExpansionPanelDetailsStyled>
			</ExpansionPanel>
			<ExpansionPanel expanded={orderPeriod.selected}>
				<ExpansionPanelSummary>
					<div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<FormControlLabel
							control={<Checkbox checked={orderPeriod.selected} onChange={()=>setOrderPeriod(v=>({ ...v, selected: !v.selected }))} name="gilad" />}
							label="Data do pedido"
						/>
						<Icon path={mdiChevronDown} size={.8} color='#333' />
					</div>
				</ExpansionPanelSummary>
				<ExpansionPanelDetailsStyled>
					<MuiPickersUtilsProvider utils={DateFnsUtils} locale={brLocale}>
						<Grid container spacing={6}>
							<Grid item sm={6}>
								<DatePicker
									ampm={false}
									variant='inline'
									format='dd/MM/yyyy'
									label="Início do periodo"
									value={orderPeriod.start}
									onChange={(value)=>setOrderPeriod({ ...orderPeriod, start: value })}
								/>
							</Grid>
							<Grid item sm={6}>
								<DatePicker
									ampm={false}
									variant='inline'
									format='dd/MM/yyyy'
									label="Início do periodo"
									value={orderPeriod.end}
									onChange={(value)=>setOrderPeriod({ ...orderPeriod, end: value })}
								/>
							</Grid>
						</Grid>
					</MuiPickersUtilsProvider>
				</ExpansionPanelDetailsStyled>
			</ExpansionPanel>
			<ExpansionPanel expanded={to.selected}>
				<ExpansionPanelSummary>
					<div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<FormControlLabel
							control={<Checkbox checked={to.selected} onChange={()=>setTo(v=>({ ...v, selected: !v.selected }))} />}
							label="Filtrar Usuários"
						/>
						<Icon path={mdiChevronDown} size={.8} color='#333' />
					</div>
				</ExpansionPanelSummary>
				<ExpansionPanelDetailsStyled>
					<UserAutoComplete setTo={setTo} />
				</ExpansionPanelDetailsStyled>
			</ExpansionPanel>
			<ExpansionPanel expanded={types.selected}>
				<ExpansionPanelSummary>
					<div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<FormControlLabel
							control={<Checkbox checked={types.selected} onChange={()=>setTypes(v=>({ ...v, selected: !v.selected }))} />}
							label="Filtrar dispositivo"
						/>
						<Icon path={mdiChevronDown} size={.8} color='#333' />
					</div>
				</ExpansionPanelSummary>
				<ExpansionPanelDetailsStyled>
					<FormControlLabel
						control={<Checkbox checked={types.device} onChange={()=>setTypes(v=>({ ...v, device: !v.device }))} />}
						label="Dispositívos móveis"
					/>
					<FormControlLabel
						control={<Checkbox checked={types.desktop} onChange={()=>setTypes(v=>({ ...v, desktop: !v.desktop }))} />}
						label="Desktop (navegador)"
					/>
				</ExpansionPanelDetailsStyled>
			</ExpansionPanel>

			<FormGroup style={{ marginTop: 20 }}>
				<Button

					variant='contained'
					onClick={applyFilter}
				>
					Filtrar
				</Button>
			</FormGroup>
		</div>
	)
}
