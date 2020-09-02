import React, { useState } from 'react'

import { useMutation } from '@apollo/react-hooks';
import { TextField, CircularProgress, Chip, Avatar } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { SEARCH_COMPANIES } from '../../graphql/companies';

let searchTimeout = null;

export default function CompanyAutoComplete({ title='Estabelecimentos', setCompanies }) {
	const [open, setOpen] = useState(false);
	
	const [searchCompanies, { data: { searchCompanies: companies = [] } ={}, loading: loadingCompanies }] = useMutation(SEARCH_COMPANIES, { fetchPolicy: 'no-cache' });

	function handleSearch(text) {
		if (searchTimeout) clearTimeout(searchTimeout);

		searchTimeout = setTimeout(()=>{
			searchCompanies({ variables: { search: text.trim() } });
		}, 800);
	}

	function handleChange (e, valueArg) {
		if (!setCompanies) return;
		setCompanies(valueArg.map(company => company.id))
	}

	return (
		<div>
			<Autocomplete
				id="searchUser"
				style={{ minWidth: 300, maxWidth: 400 }}
				multiple
				open={Boolean(open && companies.length)}
				onOpen={() => {
					setOpen(true);
				}}
				onClose={() => {
					setOpen(false);
				}}
				onInputChange={(e, text)=>handleSearch(text)}
				onChange={handleChange}
				getOptionLabel={(option) => option.displayName}
				options={companies}
				loading={loadingCompanies}
				renderTags={(options, getTagProps)=>{
					return options.map((option, index)=>
						<Chip
							{...getTagProps(index)}
							key={option.id}
							avatar={<Avatar alt={option.displayName} src={option.image} />}
							label={option.displayName}
						/>
					)
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						label={title}
						variant='outlined'
						size='small'
						InputProps={{
							...params.InputProps,
							endAdornment: (
								<React.Fragment>
									{loadingCompanies ? <CircularProgress color="inherit" size={20} /> : null}
									{params.InputProps.endAdornment}
								</React.Fragment>
							),
						}}
					/>
				)}
			/>
		</div>
	)
}
