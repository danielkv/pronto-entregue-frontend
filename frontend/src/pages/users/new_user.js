import React from 'react';
import {Paper, TextField, FormControlLabel, Switch, ButtonGroup, Button, FormControl, FormHelperText, MenuItem, Table, TableBody, TableRow, TableCell, TableHead, IconButton, Grid} from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiStore, mdiSourceBranch, mdiMapMarker, mdiCloseCircle, mdiPlusCircle, mdiDelete } from '@mdi/js'

import {setPageTitle} from '../../utils';
import Layout from '../../layout';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl} from '../../layout/components';

function Page () {
	setPageTitle('Novo usuário');

	return (
		<Layout>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Novo usuário</BlockTitle>
					</BlockHeader>
					<Paper>
						<FormRow>
							<FieldControl>
								<TextField label='Primeiro nome' />
							</FieldControl>
							<FieldControl>
								<TextField label='Sobrenome' />
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<FormControl>
									<TextField type='email' label='email' />
									<FormHelperText>Email para acesso ao sistema ou aplicativo</FormHelperText>
								</FormControl>
							</FieldControl>
							<FieldControl>
								<FormControl>
									<Button fullWidth={false} variant='contained' color='primary'>Forçar uma senha</Button>
									<FormHelperText>Caso não forçar uma senha, o usuário receberá uma notificação para criar uma senha no primeiro acesso</FormHelperText>
								</FormControl>
							</FieldControl>
						</FormRow>
					</Paper>
				</Block>
				<Block>
					<BlockHeader>
						<BlockTitle>Outros dados do usuário</BlockTitle>
					</BlockHeader>
					<Paper>
						<BlockSeparator>
							<FormRow>
								<FieldControl>
									<TextField label='CPF' />
								</FieldControl>
								<FieldControl>
								</FieldControl>
							</FormRow>
						</BlockSeparator>
						<BlockSeparator>
							<FormRow>
								<FieldControl>
									<TextField label='Email' />
								</FieldControl>
								<FieldControl>
									<IconButton>
										<Icon path={mdiPlusCircle} size='18' color='#363E5E' />
									</IconButton>
								</FieldControl>
							</FormRow>
						</BlockSeparator>
					</Paper>
				</Block>
				<Grid container spacing={5}>
					<Grid item xs={6}>
						<Block>
							<BlockHeader>
								<BlockTitle>Empresas vinculadas</BlockTitle>
							</BlockHeader>
							<Paper>
								<BlockSeparator>
									<FormRow>
										<FieldControl>
											<TextField label='Buscar empresa' />
										</FieldControl>
									</FormRow>
								</BlockSeparator>
								<BlockSeparator>
									<Table>
										<TableBody>
											<TableRow>
												<TableCell style={{width:30}}>
													<Icon path={mdiStore} color='#BCBCBC' size='18' />
												</TableCell>
												<TableCell>Copeiro</TableCell>
												<TableCell style={{width:30}}><Icon path={mdiCloseCircle} color='#BCBCBC' size='18' /></TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</BlockSeparator>
							</Paper>
						</Block>
					</Grid>
					<Grid item xs={6}>
						<Block>
							<BlockHeader>
								<BlockTitle>Filiais vinculadas</BlockTitle>
							</BlockHeader>
							<Paper>
								<BlockSeparator>
									<FormRow>
										<FieldControl>
											<TextField label='Buscar filial' />
										</FieldControl>
									</FormRow>
								</BlockSeparator>
								<BlockSeparator>
									<Table>
										<TableBody>
											<TableRow>
												<TableCell style={{width:30}}>
													<Icon path={mdiSourceBranch} color='#BCBCBC' size='18' />
												</TableCell>
												<TableCell>Copeiro 1</TableCell>
												<TableCell style={{width:30}}><Icon path={mdiCloseCircle} color='#BCBCBC' size='18' /></TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</BlockSeparator>
							</Paper>
						</Block>
					</Grid>
				</Grid>
				<Block>
					<BlockHeader>
						<BlockTitle>Enderços</BlockTitle>
					</BlockHeader>
					<Paper>
						<BlockSeparator>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell></TableCell>
										<TableCell>Identificação</TableCell>
										<TableCell>Rua</TableCell>
										<TableCell>Bairro</TableCell>
										<TableCell>Cidade / Estado</TableCell>
										<TableCell>CEP</TableCell>
										<TableCell>Ações</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell style={{width:30}}><Icon path={mdiMapMarker} color='#BCBCBC' size='18' /></TableCell>
										<TableCell>Casa</TableCell>
										<TableCell>Rua João Quartieiro</TableCell>
										<TableCell>Centro</TableCell>
										<TableCell>Sombrio SC</TableCell>
										<TableCell>88960-000</TableCell>
										<TableCell style={{width:30}}>
											<IconButton>
												<Icon path={mdiDelete} color='#BCBCBC' size='18' />
											</IconButton>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</BlockSeparator>
					</Paper>
				</Block>
			</Content>
			<SidebarContainer>
				<Block>
					<BlockHeader>
						<BlockTitle>Configuração</BlockTitle>
					</BlockHeader>
					<Sidebar>
						<BlockSeparator>
							<FormRow>
								<FieldControl style={{justifyContent:'flex-end', paddingRight:7}}>
									<FormControlLabel
										labelPlacement='start'
										control={
											<Switch size='small' color='primary' checked={true} onChange={()=>{}} value="includeDisabled" />
										}
										label="Ativo"
									/>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<ButtonGroup fullWidth>
										<Button color='secondary'>Cancelar</Button>
										<Button variant="contained" color='secondary'>Salvar</Button>
									</ButtonGroup>
								</FieldControl>
							</FormRow>
						</BlockSeparator>
						<BlockSeparator>
							<FormRow>
								<FieldControl>
									<FormControl>
										<TextField select label='Função'>
											<MenuItem value='adm'>Administrador</MenuItem>
											<MenuItem value='branch_manager'>Gerente de Filiais</MenuItem>
											<MenuItem value='manager'>Gerente</MenuItem>
											<MenuItem value='seller'>Vendedor</MenuItem>
											<MenuItem value='customer'>Consumidor</MenuItem>
										</TextField>
									</FormControl>
								</FieldControl>
							</FormRow>
						</BlockSeparator>
					</Sidebar>
				</Block>
			</SidebarContainer>
		</Layout>
	)
}

export default Page;