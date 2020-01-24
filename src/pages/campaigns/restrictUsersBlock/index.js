import React, { useState } from 'react'

import { useMutation } from '@apollo/react-hooks';
import { Paper, FormHelperText, TextField, List, ListItem, ListItemIcon, CircularProgress, ListItemText, FormControl, Chip, Avatar, ListItemSecondaryAction } from '@material-ui/core'
import { mdiFaceProfile } from '@mdi/js';
import Icon from '@mdi/react';
import Downshift from 'downshift';
import { useFormikContext } from 'formik';
import { cloneDeep } from 'lodash';

import { Block, BlockHeader, BlockTitle, FormRow, FieldControl } from '../../../layout/components'

import { SEARCH_USERS } from '../../../graphql/users';

export default function RestrictProductsBlock() {
	const { values: { users }, setFieldValue, isSubmitting } = useFormikContext();
	const [usersFound, setUsersFound] = useState([]);

	const [searchUsers, { loading: loadingUsers }] = useMutation(SEARCH_USERS, { variables: { exclude: users.map(c=>c.id) }, fetchPolicy: 'no-cache' });

	function handleSelect (selected, { setState }) {
		if (!selected) return;
		setFieldValue('users', [...users, selected]);
		setState({ inputValue: '', selectedItem: null });
	}
	
	const handleDelete = (index) => () => {
		const newUsers = cloneDeep(users);
		newUsers.splice(index, 1);
		setFieldValue('users', newUsers);
	}

	async function handleSearch (search) {
		const { data: { searchUsers: searchResult } } = await searchUsers({ variables: { search } });

		setUsersFound(searchResult);
	}

	return (
		<Block>
			<BlockHeader>
				<BlockTitle>Restringir Usuários {!!users.length && `(${users.length})`}</BlockTitle>
			</BlockHeader>
			<Paper>
				<FormRow>
					<FieldControl>
						<FormControl>
							<Downshift
								onChange={handleSelect}
								itemToString={(item => item ? item.fullName : '')}
								onInputValueChange={(value)=>{handleSearch(value)}}
							>
								{({
									getInputProps,
									getItemProps,
									getMenuProps,
									isOpen,
									highlightedIndex,
								})=>(
									<div style={{ width: '100%' }}>
										<TextField label='Buscar usuário'  {...getInputProps()} disabled={isSubmitting} />
										{isOpen && (
											<List {...getMenuProps()} className="dropdown">
												{loadingUsers && <div style={{ padding: 20 }}><CircularProgress /></div>}
												{!usersFound.length
													? <ListItem>Nenhum usuário encontrado</ListItem>
													: usersFound.map((user, index) => (
														<ListItem
															className="dropdown-item"
															selected={highlightedIndex === index}
															key={user.id}
															{...getItemProps({ key: user.id, index, item: user })}
														>
															<ListItemIcon><Icon path={mdiFaceProfile} color='#707070' size='22' /></ListItemIcon>
															<ListItemText>{user.fullName}</ListItemText>
															<ListItemSecondaryAction><small>{user.email}</small></ListItemSecondaryAction>
														</ListItem>
													))}
											</List>
										)}
									</div>
								)}
							</Downshift>
						</FormControl>
					</FieldControl>
				</FormRow>
				<FormRow>
					<FieldControl>
						{users.map((company, index) => (
							<Chip
								key={company.id}
								onDelete={handleDelete(index)}
								label={company.fullName}
								avatar={<Avatar>{company.fullName.substr(0, 1)}</Avatar>}
							/>
						))}
					</FieldControl>
				</FormRow>
			</Paper>
			<FormHelperText>A campanha ficará ativa para os usuários selecionados. Caso nenhum for selecionado, ficará ativa para todos.</FormHelperText>
		</Block>
	)
}
