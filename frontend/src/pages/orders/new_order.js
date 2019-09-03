import React, { useState } from 'react';
import {Paper, InputAdornment, TextField, IconButton, FormControl, ButtonGroup, Button, Select, MenuItem, InputLabel, FormHelperText, Table, TableBody, TableRow, TableCell, TableHead} from '@material-ui/core';
import Icon from '@mdi/react';
import {mdiContentDuplicate, mdiDelete, mdiPencil } from '@mdi/js';
import numeral from 'numeral';

import ProductModal from './product_modal';
import {setPageTitle} from '../../utils';
import Layout from '../../layout';
import {Content, Block, BlockSeparator, BlockHeader, BlockTitle, SidebarContainer, Sidebar, FormRow, FieldControl, ProductImage} from '../../layout/components';

function Page () {
	setPageTitle('Novo pedido');

	const [modalOpen, setModalOpen] = useState(true);

	const order_products = [
		{
			image:'https://media-manager.noticiasaominuto.com/1920/1509039392/naom_59bfa667ce128.jpg',
			name:'Hambúrguer de Siri',
			amount : 7.5,
		},
		{
			image:'https://www.tropicalishotel.com.br/wp-content/uploads/bodegadosertao_59365197_598901567288489_8009772026720440913_n-950x600.jpg',
			name:'Hambúrguer de Costela',
			amount : 5,
		},
		{
			image:'https://img.elo7.com.br/product/main/258B7CB/adesivo-parede-restaurante-prato-feito-comida-caseira-lenha-adesivo-restaurante-fritas-salada.jpg',
			name:'Top Pão com arroz',
			amount : 3.76,
		},
		{
			image:'https://www.turismoouropreto.com/wp-content/uploads/culin%C3%A1ria-mineira.jpg',
			name:'Panelada Mineira',
			amount : 4.78,
		},
	];

	return (
		<Layout>
			<ProductModal open={modalOpen} onClose={()=>setModalOpen(false)} />
			<Content>
				<Block>
					<BlockHeader>
						<BlockTitle>Novo pedido</BlockTitle>
					</BlockHeader>
					<Paper>
						<FormRow>
							<FieldControl>
								<FormControl>
									<InputLabel htmlFor="order_user">Cliente</InputLabel>
									<Select
										value={''}
										onChange={()=>{}}
										inputProps={{
											name: 'user',
											id: 'order_user',
										}}
										>
										<MenuItem value='1'>Daniel</MenuItem>
										<MenuItem value='2'>Marcio</MenuItem>
										<MenuItem value='3'>Ivandro</MenuItem>
									</Select>
								</FormControl>
							</FieldControl>
						</FormRow>
						<FormRow>
							<FieldControl>
								<TextField label='Observações' />
							</FieldControl>
						</FormRow>
					</Paper>
				</Block>
				<Block>
					<BlockHeader>
						<BlockTitle>Endereço de entrega</BlockTitle>
					</BlockHeader>
					<Paper>
						<FormRow>
							<FieldControl style={{flex:.3}}>
								<FormControl>
									<InputLabel htmlFor="delivery_type">Entrega</InputLabel>
									<Select
										value={''}
										onChange={()=>{}}
										inputProps={{
											name: 'user',
											id: 'delivery_type',
										}}
										>
										<MenuItem value='delivery'>Entrega</MenuItem>
										<MenuItem value='takeout'>Retirada no local</MenuItem>
									</Select>
								</FormControl>
							</FieldControl>
							<FieldControl>
								<FormControl>
									<InputLabel htmlFor="user_addresses">Endereços cadastrados</InputLabel>
									<Select
										value={''}
										onChange={()=>{}}
										inputProps={{
											name: 'user_addresses',
											id: 'user_addresses',
										}}
										>
										<MenuItem value='1'>Rua João José Guimarães, 1085</MenuItem>
										<MenuItem value='2'>Rua João Quartieiro, 43</MenuItem>
										<MenuItem value='2'>Rua Padre João Reitz, 6489</MenuItem>
									</Select>
								</FormControl>
							</FieldControl>
						</FormRow>
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
						<BlockTitle>Produtos</BlockTitle>
					</BlockHeader>
					<Paper>
						<BlockSeparator>
							<FormRow>
								<FieldControl>
									<FormControl>
										<InputLabel htmlFor="add_order_product">Adicionar produto</InputLabel>
										<Select
											value={''}
											onChange={()=>{}}
											inputProps={{
												name: 'add_product',
												id: 'add_order_product',
											}}
											>
											<MenuItem value='1'>Hamburguer</MenuItem>
											<MenuItem value='2'>Pizza</MenuItem>
											<MenuItem value='2'>Porção de batata</MenuItem>
										</Select>
										<FormHelperText>Adicione produtos a este pedido</FormHelperText>
									</FormControl>
								</FieldControl>
							</FormRow>
						</BlockSeparator>
						<BlockSeparator>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell style={{width:70, paddingRight:10}}></TableCell>
										<TableCell>Produto</TableCell>
										<TableCell style={{width:110}}>Valor</TableCell>
										<TableCell style={{width:130}}>Ações</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{order_products.map(row => (
										<TableRow key={row.name}>
											<TableCell style={{width:80, paddingRight:10}}><ProductImage src={row.image} alt={row.name} /></TableCell>
											<TableCell>{row.name}</TableCell>
											<TableCell>
												<TextField value={numeral(row.amount).format('0,0.00')} InputProps={{startAdornment:<InputAdornment position="start">R$</InputAdornment>}} />
											</TableCell>
											<TableCell>
												<IconButton>
													<Icon path={mdiPencil} size='18' color='#363E5E' />
												</IconButton>
												<IconButton>
													<Icon path={mdiContentDuplicate} size='18' color='#363E5E' />
												</IconButton>
												<IconButton>
													<Icon path={mdiDelete} size='20' color='#707070' />
												</IconButton>
											</TableCell>
										</TableRow>
									))}
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
								<FieldControl>
									<TextField select label='Status' value='delivering'>
										<MenuItem value='waiting'>Aguardando</MenuItem>
										<MenuItem value='preparing'>Preparando</MenuItem>
										<MenuItem value='delivering'>Na entrega</MenuItem>
										<MenuItem value='delivered'>Entregue</MenuItem>
										<MenuItem value='canceled'>Cancelado</MenuItem>
									</TextField>
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
									<TextField label='Desconto' value={numeral(0).format('0,0.00')} InputProps={{startAdornment:<InputAdornment position="start">R$</InputAdornment>}} />
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<TextField label='Valor total' value={numeral(32.30).format('0,0.00')} InputProps={{startAdornment:<InputAdornment position="start">R$</InputAdornment>}} />
								</FieldControl>
							</FormRow>
							<FormRow>
								<FieldControl>
									<TextField select label='Forma de pagamento' value='money'>
										<MenuItem value='credit_debit'>Cartão de crédito/débito</MenuItem>
										<MenuItem value='money'>Dinheiro</MenuItem>
									</TextField>
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