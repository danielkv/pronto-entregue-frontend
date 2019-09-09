import React from 'react';
import {Paper, TextField, FormControlLabel, Switch, ButtonGroup, Button, FormLabel, FormControl, FormHelperText, MenuItem, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, InputAdornment,  Table, TableBody, TableRow, TableCell, TableHead, IconButton} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import numeral from 'numeral';
import Icon from '@mdi/react';
import {mdiDrag, mdiDelete, mdiRadioboxMarked, mdiFormatListBulleted } from '@mdi/js'

import ImagePlaceHolder from '../../assets/images/image_placeholder.png';
import {setPageTitle} from '../../utils';
import Layout from '../../layout';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl} from '../../layout/components';

const CustomTextInput = withStyles({
	root : {
		'& .MuiInputBase-root' : {
			backgroundColor:"#fff",
		}
	}
})(TextField);

function Page () {
	setPageTitle('Novo produto');

	const options_groups = [
		{
			name : 'Extras',
			type: 'multi',
			max_select_restrained_by: null,
			min_select: 0,
			max_select:2,
			active:true,
			order:1,
			options: [
				{
					name:'Bacon',
					max_select_restrain_other : null,
					active:true,
					price:5.30,
				},
				{
					name:'Hamburguer extra',
					max_select_restrain_other : null,
					active:false,
					price:4.30,
				},
			]
		}
	]
	return (
		<Layout>
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Novo produto</BlockTitle>
					</BlockHeader>
					<Paper>
						<FormRow>
							<FieldControl>
								<TextField label='Nome do produto' />
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<TextField label='Descrição' />
							</FieldControl>
						</FormRow>
					</Paper>
				</Block>
				<Block>
					<BlockHeader>
						<BlockTitle>Opções</BlockTitle>
					</BlockHeader>
					<Paper>
						<BlockSeparator>
							<FormRow>
								<FieldControl>
									<FormControl>
										<TextField select label='Grupo de opções'>
											<MenuItem value='1'>Grupo 1</MenuItem>
											<MenuItem value='2'>Grupo 2</MenuItem>
											<MenuItem value='3'>Grupo 3</MenuItem>
										</TextField>
										<FormHelperText>Crie um grupo novo ou copie um grupo já existente</FormHelperText>
									</FormControl>
								</FieldControl>
							</FormRow>
						</BlockSeparator>
						<BlockSeparator>
							{options_groups.map(group=>(
								<ExpansionPanel fullWidth={true} square expanded={true} onChange={()=>{}}>
									<ExpansionPanelSummary style={{minHeight:0, padding:0}}>
										<Table>
											<TableBody>
												<TableCell style={{width:15}}><Icon path={mdiDrag} size='20' color='#BCBCBC' /></TableCell>
												<TableCell>{group.name}</TableCell>
												<TableCell  style={{width:70}}>
													<FormControl>
														<FormLabel style={{fontSize:12, marginBottom:10}}>Tipo de seleção</FormLabel>
														<ButtonGroup>
															<Button variant="contained"><Icon path={mdiFormatListBulleted} size='16' color='#707070' /></Button>
															<Button variant="contained"><Icon path={mdiRadioboxMarked} size='16' color='#707070' /></Button>
														</ButtonGroup>
													</FormControl>
												</TableCell>
												<TableCell style={{width:210}}>
													<TextField label='Restrito por outra opção' />
												</TableCell>
												<TableCell style={{width:150}}>
													<TextField type='number' label='Seleção mínima' />
												</TableCell>
												<TableCell style={{width:150}}>
													<TextField type='number' label='Seleção máxima' />
												</TableCell>
												<TableCell style={{width:100}}>
													<Switch
														checked={group.active}
														onChange={()=>{}}
														value="checkedB"
														size='small'
													/>
													<IconButton>
														<Icon path={mdiDelete } size='16' color='#363E5E' />
													</IconButton>
												</TableCell>
											</TableBody>
										</Table>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails style={{padding:0}}>
										<Table>
											<TableHead>
												<TableCell style={{width:15}}></TableCell>
												<TableCell>Nome</TableCell>
												<TableCell style={{width:70}}>Preço</TableCell>
												<TableCell style={{width:70}}>Vincular a item do estoque</TableCell>
												<TableCell style={{width:100}}>Ações</TableCell>
											</TableHead>
											<TableBody>
												{group.options.map(option=>(
													<TableRow>
														<TableCell><Icon path={mdiDrag} size='20' color='#BCBCBC' /> </TableCell>
														<TableCell>{option.name}</TableCell>
														<TableCell>
															<CustomTextInput value={numeral(1.5).format('0,0.00')} InputProps={{startAdornment:<InputAdornment position="start">R$</InputAdornment>}} />
														</TableCell>
														<TableCell>
															<CustomTextInput select>
																<MenuItem value='1'>Item 1</MenuItem>
																<MenuItem value='2'>Item 2</MenuItem>
																<MenuItem value='3'>Item 3</MenuItem>
															</CustomTextInput>
														</TableCell>
														<TableCell>
															<Switch
																checked={option.active}
																onChange={()=>{}}
																value="checkedB"
																size='small'
															/>
															<IconButton>
																<Icon path={mdiDelete } size='16' color='#707070' />
															</IconButton>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</ExpansionPanelDetails>
								</ExpansionPanel>
							))}
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
										<FormLabel>Imagem</FormLabel>
										<img src={ImagePlaceHolder} alt='Clique para adicionar uma imagem' />
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