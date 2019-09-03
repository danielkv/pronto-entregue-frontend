import React from 'react';
import {Paper, TextField, FormControlLabel, Switch, ButtonGroup, Button} from '@material-ui/core';

import ImagePlaceHolder from '../../assets/images/image_placeholder.png';
import {setPageTitle} from '../../utils';
import Layout from '../../layout';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl} from '../../layout/components';

function Page () {
	setPageTitle('Nova categoria');
	return (
		<Layout>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Nova categoria</BlockTitle>
					</BlockHeader>
					<Paper>
						<FormRow>
							<FieldControl>
								<TextField label='Nome da categoria' />
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
						<BlockSeparator>
							<FormRow>
								<FieldControl>
									<label>Imagem</label>
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<img src={ImagePlaceHolder} alt='Clique para adicionar uma imagem' />
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