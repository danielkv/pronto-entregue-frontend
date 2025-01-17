import React, { Fragment } from 'react';
import Dropzone from 'react-dropzone';

import { CircularProgress } from '@material-ui/core';

import {
	BlockContainer,
	LoadingText,
	ErrorTitle,
	ErrorSubtitle,
	ImagePlaceHolderContainer,
	ImagePlaceHolder
} from './components';

import imagePlaceHolderPng from '../assets/images/select_image.png';

export const LoadingBlock = () => (
	<BlockContainer>
		<CircularProgress color='primary' />
		<LoadingText>Carregando...</LoadingText>
	</BlockContainer>
)

export const ErrorBlock = ({ error }) => {
	if (process.env.NODE_ENV !== 'production') console.error(error);
	return (
		<BlockContainer>
			<ErrorTitle>Ocorreu um erro</ErrorTitle>
			<ErrorSubtitle>{error}</ErrorSubtitle>
		</BlockContainer>
	)
}


export const DropzoneBlock = (props) => {
	return (
		<Dropzone multiple={false} accept="image/jpg, image/jpeg, image/gif, image/png" onDropAccepted={props.onDrop}>
			{({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
				<div {...getRootProps()} >
					<input {...getInputProps()} />
					<ImagePlaceHolderContainer {...props} isDragActive={isDragActive} isDragReject={isDragReject}>
						{props.preview ?
							<img src={props.preview} alt='Imagem Destacada' />
							:
							<Fragment>
								<ImagePlaceHolder>
									<img src={imagePlaceHolderPng} alt='Arraste ou clique aqui para enviar uma imagem' />
								</ImagePlaceHolder>
								<div>
									{(()=>{
										if (isDragActive) return <span>Solte a imagem</span>;
										else if (isDragReject) return <span>Não é possível enviar essa imagem</span>;
								
										return <span>Solte uma imagem aqui ou clique para selecionar</span>;
									})()}
								</div>
							</Fragment>
						}
					</ImagePlaceHolderContainer>
				</div>)}
		</Dropzone>)
}