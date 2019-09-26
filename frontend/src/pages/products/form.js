import React from 'react';
import gql from 'graphql-tag';
import {Paper, FormControlLabel, Switch, Button, FormLabel, FormControl, FormHelperText} from '@material-ui/core';

import * as Yup from 'yup';
import { Formik, FieldArray, Form, Field} from 'formik';
import { DragDropContext, Droppable} from 'react-beautiful-dnd';

import ImagePlaceHolder from '../../assets/images/image_placeholder.png';
import {setPageTitle} from '../../utils';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, tField} from '../../layout/components';


import OptionsGroups from './options_groups';
import { useQuery } from '@apollo/react-hooks';
import { GET_SELECTED_COMPANY } from '../../graphql/companies';

const productSchema = Yup.object().shape({
	name: Yup.string().required('Obrigatório'),
	description: Yup.string().required('Obrigatório'),
	options_groups: Yup.array().of(Yup.object().shape({
		options: Yup.array().of(Yup.object().shape({
			price: Yup.number().required('Obrigatório')
		})),
	})),
});

const onDragEnd = (groups, setFieldValue) => (result)=>{
	if (!result.destination || result.destination.index === result.source.index) return;

	const list = Array.from(groups);

	if (result.type === 'group') {
		let [removed] = list.splice(result.source.index, 1);
		list.splice(result.destination.index, 0, removed);

		setFieldValue('options_groups', list.map((row, index) => {row.order = index; return row;}));
	}

	if (result.type === 'option') {
		let droppableSource = result.source.droppableId.split('.')[1];
		let droppableDestination = result.destination.droppableId.split('.')[1];

		let [removed] = list[droppableSource].options.splice(result.source.index, 1);
		list[droppableDestination].options.splice(result.destination.index, 0, removed);

		list[droppableSource].options.map((row, index) => {row.order = index; return row;});
		list[droppableDestination].options.map((row, index) => {row.order = index; return row;});

		setFieldValue('options_groups', list);
	}
}

const GET_COMPANY_ITEMS = gql`
	query ($id:ID!) {
		company (id:$id) {
			id
			items {
				id
				name
			}
		}
	}
`;

export default function PageForm ({initialValues, onSubmit, pageTitle, validateOnChange}) {
	setPageTitle('Novo produto');

	const {data:selectedCompanyData, loading:loadingSelectedCompany} = useQuery(GET_SELECTED_COMPANY);
	const {data:itemsData, loading:loadingItems} = useQuery(GET_COMPANY_ITEMS, {variables:{id:selectedCompanyData.selectedCompany}});
	const items = itemsData ? itemsData.company.items : [];

	console.log(items);

	return (
		<Formik
			validationSchema={productSchema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validateOnChange={validateOnChange}
			validateOnBlur={false}
		>
			{({values:{active, options_groups}, setFieldValue, handleChange, isSubmitting, errors}) => (
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
								<DragDropContext onDragEnd={onDragEnd(options_groups, setFieldValue)}>
									<Droppable droppableId={`groups`} type='group'>
										{(provided, snapshot)=>(
											<FieldArray  name={`options_groups`}>
												{({insert, remove}) => (
													<div {...provided.droppableProps} ref={provided.innerRef}>
														{options_groups.map((group, groupIndex)=>{
															const props = {
																groups: options_groups,
																group,
																groupIndex,
																insertGroup:insert,
																removeGroup:remove,
																items,

																setFieldValue,
																handleChange,
																errors
															}
															return <OptionsGroups key={group.id} {...props} />
														})}
														{provided.placeholder}
													</div>
												)}
											</FieldArray>
										)}
									</Droppable>
								</DragDropContext>
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
										<Button fullWidth type='submit' variant="contained" color='secondary'>Salvar</Button>
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