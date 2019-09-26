import React from 'react';
import {Paper, TextField, FormControlLabel, Switch, ButtonGroup, Button, FormLabel, FormControl, FormHelperText, MenuItem, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, InputAdornment,  Table, TableBody, TableRow, TableCell, TableHead, IconButton} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { withStyles } from '@material-ui/core/styles';
import numeral from 'numeral';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import Icon from '@mdi/react';
import {mdiDrag, mdiDelete, mdiRadioboxMarked, mdiFormatListBulleted } from '@mdi/js'

import ImagePlaceHolder from '../../assets/images/image_placeholder.png';
import {setPageTitle} from '../../utils';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField} from '../../layout/components';

const CustomTextInput = withStyles({
	root : {
		'& .MuiInputBase-root' : {
			backgroundColor:"#fff",
		}
	}
})(TextField);

const productSchema = Yup.object().shape({
	name: Yup.string().required('Obrigatório'),
	description: Yup.string().required('Obrigatório'),
	options_groups: Yup.array().of(Yup.object().shape({
		options: Yup.array().of(Yup.object().shape({
			price: Yup.number().required('Obrigatório')
		})),
	})),
});

export default function PageForm ({initialValues, onSubmit, pageTitle, validateOnChange}) {
	setPageTitle('Novo produto');

	/* const options_groups = [
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
	] */
	return (
		<Formik
			validationSchema={productSchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={validateOnChange}
			validateOnBlur={false}
		>
			{({values:{active, options_groups}, setFieldValue, handleChange, isSubmitting}) => (
			<Form>
				<Content>
					<Block>
						<BlockHeader>
							<BlockTitle>{pageTitle}</BlockTitle>
						</BlockHeader>
						<Paper>
							<FormRow>
								<FieldControl>
									<Field component={tField} name='name' label='Nome do produto' />
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<Field component={tField} name='description' label='Descrição' />
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
											{/* <TextField select label='Grupo de opções'>
												<MenuItem value='1'>Grupo 1</MenuItem>
												<MenuItem value='2'>Grupo 2</MenuItem>
												<MenuItem value='3'>Grupo 3</MenuItem>
											</TextField> */}
											<FormHelperText>Crie um grupo novo ou copie um grupo já existente</FormHelperText>
										</FormControl>
									</FieldControl>
								</FormRow>
							</BlockSeparator>
							<BlockSeparator>
								{options_groups.map((group, GroupIndex)=>{
									return (
									<ExpansionPanel key={group.id} square expanded={true} onChange={()=>{}}>
										<ExpansionPanelSummary style={{minHeight:0, padding:0}}>
											<Table>
												<TableBody>
													<TableRow>
														<TableCell style={{width:15}}><Icon path={mdiDrag} size='20' color='#BCBCBC' /></TableCell>
														<TableCell>{group.name}</TableCell>
														<TableCell  style={{width:70}}>
															<FormControl>
																<FormLabel style={{fontSize:12, marginBottom:10}}>Tipo de seleção</FormLabel>
																<ToggleButtonGroup
																	value={group.type}
																	exclusive
																	onChange={(e, value)=>{setFieldValue(`options_groups.${GroupIndex}.type`, value);}}
																	aria-label="text alignment"
																>
																	<ToggleButton value="single" title="Única" aria-label="left aligned">
																		<Icon path={mdiRadioboxMarked} size='16' color='#707070' />
																	</ToggleButton>
																	<ToggleButton value="multiple" title="Múltipla" aria-label="left aligned">
																		<Icon path={mdiFormatListBulleted} size='16' color='#707070' />
																	</ToggleButton>
																</ToggleButtonGroup>
															</FormControl>
														</TableCell>
														<TableCell style={{width:210}}>
															{options_groups.length > 1 &&
															<TextField label='Restrito por outra opção' select value={group.max_select_restrained_by ? group.max_select_restrained_by.id : ''}>
																<MenuItem value=''>-- Não restringir --</MenuItem>
																{options_groups.filter(g=>g.id !== group.id).map(g=>{
																	return (<MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)
																})}
															</TextField>}
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
																onChange={()=>{setFieldValue(`options_groups.${GroupIndex}.active`, !group.active);}}
																value="checkedB"
																size='small'
															/>
															<IconButton>
																<Icon path={mdiDelete} size='16' color='#363E5E' />
															</IconButton>
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
										</ExpansionPanelSummary>
										<ExpansionPanelDetails style={{padding:0}}>
											<Table>
												<TableHead>
													<TableRow>
														<TableCell style={{width:15}}></TableCell>
														<TableCell>Nome</TableCell>
														<TableCell style={{width:70}}>Preço</TableCell>
														<TableCell style={{width:70}}>Vincular a item do estoque</TableCell>
														<TableCell style={{width:100}}>Ações</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{group.options.map((option, OptionIndex)=>(
														<TableRow key={option.id}>
															<TableCell><Icon path={mdiDrag} size='20' color='#BCBCBC' /> </TableCell>
															<TableCell>{option.name}</TableCell>
															<TableCell>
																<CustomTextInput value={numeral(option.price).format('0,0.00')} InputProps={{startAdornment:<InputAdornment position="start">R$</InputAdornment>}} />
															</TableCell>
															<TableCell>
																{/* <CustomTextInput select>
																	<MenuItem value='1'>Item 1</MenuItem>
																	<MenuItem value='2'>Item 2</MenuItem>
																	<MenuItem value='3'>Item 3</MenuItem>
																</CustomTextInput> */}
															</TableCell>
															<TableCell>
																<Switch
																	checked={option.active}
																	onChange={()=>{setFieldValue(`options_group.${GroupIndex}.options.${OptionIndex}.active`, !option.active)}}
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
								)})}
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
			</Form>)}
		</Formik>
	)
}