import React, { useState, useEffect } from 'react'

import { useMutation } from '@apollo/react-hooks';
import { TextField, CircularProgress } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { SEARCH_USERS } from '../../../graphql/users';

let searchTimeout = null;

export default function UserAutoComplete({ setUser }) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);

	useEffect(()=>{
		if (!setUser || !value) return;
		setUser(value);
		setValue(null)
	}, [value, setUser]);

	const [searchUsers, { data: { searchUsers: users = [] } ={}, loading: loadingUsers }] = useMutation(SEARCH_USERS, { fetchPolicy: 'no-cache' });

	function handleSearch(text) {
		if (searchTimeout) clearTimeout(searchTimeout);

		searchTimeout = setTimeout(()=>{
			searchUsers({ variables: { search: text.trim() } });
		}, 800);
	}

	return (
		<div>
			<Autocomplete
				id="searchUser"
				
				open={Boolean(open && users.length)}
				onOpen={() => {
					setOpen(true);
				}}
				onClose={() => {
					setOpen(false);
				}}
				onInputChange={(e, text)=>handleSearch(text)}
				onChange={(e, returnedValue)=>{setValue(returnedValue)}}
				getOptionLabel={(option) => option.fullName}
				options={users}
				loading={loadingUsers}
				/* renderTags={(options, getTagProps)=>{
					return options.map((option, index)=>
						<Chip
							{...getTagProps(index)}
							key={option.id}
							avatar={<Avatar alt={option.fullName} src={option.image} />}
							label={option.fullName}
						/>
					)
				}} */
				renderInput={(params) => (
					<TextField
						{...params}
						label="Definir entregador"
						variant='outlined'
						size='small'
						InputProps={{
							...params.InputProps,
							endAdornment: (
								<React.Fragment>
									{loadingUsers ? <CircularProgress color="inherit" size={20} /> : null}
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
