import React from 'react';
import {Paper, TextField, IconButton, FormControlLabel, Switch, ButtonGroup, Button} from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiPlusCircle} from '@mdi/js';

import {setPageTitle} from '../../utils';
import Layout from '../../layout';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl} from '../../layout/components';

function Page () {
	setPageTitle('Nova empresa');
	return (
		<Layout>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Nova empresa</BlockTitle>
					</BlockHeader>
					<Paper>
						<FormRow>
							<FieldControl>
								<TextField label='Nome Fantasia' />
							</FieldControl>
							<FieldControl>
								<TextField label='Razão Social' />
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<TextField label='CNPJ' />
							</FieldControl>
							<FieldControl>
								<TextField label='Responsável' />
							</FieldControl>
						</FormRow>
					</Paper>
				</Block>
				<Block>
					<BlockHeader>
						<BlockTitle>Endereço</BlockTitle>
					</BlockHeader>
					<Paper>
						<FormRow>
							<FieldControl>
								<TextField label='Rua' />
							</FieldControl>
							<FieldControl style={{flex:.3}}>
								<TextField type='number' label='Número' />
							</FieldControl>
							<FieldControl style={{flex:.3}}>
								<TextField label='CEP' />
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<TextField label='Bairro' />
							</FieldControl>
							<FieldControl>
								<TextField label='Cidade' />
							</FieldControl>
							<FieldControl>
								<TextField label='Estado' />
							</FieldControl>
						</FormRow>
					</Paper>
				</Block>
				<Block>
					<BlockHeader>
						<BlockTitle>Outros dados da empresa</BlockTitle>
					</BlockHeader>
					<Paper>
						<BlockSeparator>
							<FormRow>
								<FieldControl>
									<TextField label='Telefone' />
								</FieldControl>
								<FieldControl>
									<IconButton>
										<Icon path={mdiPlusCircle} size='18' color='#363E5E' />
									</IconButton>
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
					</Sidebar>
				</Block>
			</SidebarContainer>
		</Layout>
	)
}

export default Page;