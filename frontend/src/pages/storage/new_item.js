import React from 'react';
import {Paper, TextField, FormControlLabel, Switch, ButtonGroup, Button} from '@material-ui/core';

import {setPageTitle} from '../../utils';
import Layout from '../../layout';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl} from '../../layout/components';

function Page () {
	setPageTitle('Novo item de estoque');
	return (
		<Layout>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Novo item de estoque</BlockTitle>
					</BlockHeader>
					<Paper>
						<FormRow>
							<FieldControl>
								<TextField label='Nome do item' />
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<TextField label='Descrição' />
							</FieldControl>
						</FormRow>
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