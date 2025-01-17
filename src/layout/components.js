import React, { useRef, useEffect } from 'react';

import { Paper, TextField, TableCell, Typography } from '@material-ui/core';

import styled from 'styled-components';

export const BlockContainer = styled.div`
	display:flex;
	flex:1;
	height:100%;
	flex-direction:column;
	justify-content:center;
	align-items:center;
`
export const LoadingText = styled.div`
	font-size:14px;
	margin-top:18px;
	color:#999;
`
export const ErrorTitle = styled.div`
	font-size:18px;
	margin-top:18px;
	color:rgb(206, 17, 38);
`

export function DraggableCell (props) {
	const ref = useRef();
	let styles = { ...props.style };

	useEffect(() => {
	
	}, [ref]);
	
	if (ref.current && props.selected) {
		let { width } = ref.current.getBoundingClientRect();
		styles.width = width;
	}

	return <TableCell {...props} ref={ref} style={styles} />
}


export const ErrorSubtitle = styled.div`
	font-size:14px;
	margin-top:18px;
	color:#999;
`
export const Error = styled.div`
	font-size:14px;
	margin-top:18px;
	color:rgb(206, 17, 38);
`
export const Container = styled.div`
	display:grid;
	grid-template-columns: 240px auto;
	grid-template-rows: 95px auto;

	grid-template-areas:"header header"
						"navigation main";

	grid-gap: ${({ theme })=>theme.spacing(6)}px;

	@media (max-width:1400px) {
		grid-template-columns: 200px auto;
		grid-gap: ${({ theme })=>theme.spacing(6)*.8}px;
	}
	
`;

export const HeaderArea = styled.div`
	grid-area:header;
`;

export const NavigationArea = styled.div`
	grid-area:navigation;
`;

export const Main = styled.main`
	grid-area:main;
	display:flex;
	/*overflow: hidden;*/
`;

export const SidebarContainer = styled.aside`
	width:300px;
	@media (max-width: 1400px) {
		width: 250px;
	}
`;

export const Sidebar = styled(Paper)`
	border-top-right-radius:0 !important;
	border-bottom-right-radius:0 !important;

	display:flex;
	flex-direction:column;
	justify-items:stretch;
`;

export const Content = styled.div`
	flex:1;
	margin-right:${({ theme })=>theme.spacing(6)}px;
	@media (max-width: 1400px) {
		margin-right:${({ theme })=>theme.spacing(6)*.8}px;
	}
`;

export const BlockSeparator = styled.div`
	border-bottom: 1px solid #ddd;
`;

export const Block = styled.div`
	margin-bottom:25px;

	& ${BlockSeparator}:last-child {
		border-bottom:none;
	}
`
export const BlockHeader = styled.div`
	display:flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom:10px;
`
export const BlockFooter = styled.div`
	display:flex;
	justify-content:space-between;
	align-items:flex-start;
`

export const BlockTitle = styled(Typography).attrs({ variant: 'h2' })`
	display: flex;
	align-items: center;
	font-size: 1.1em !important;
	font-weight: normal;
	color: #707070;
	margin: 0;
	margin-right: 10px !important;
`

export const NumberOfRows = styled.div`
	font-size:14px;
	font-weight:lighter;
	color:#707070;
	text-align:right;
	margin:8px 8px 0 0;
	margin-left:auto;
`

export const FormRow = styled.div`
	display: flex;
	justify-items:stretch;
	padding:0 15px 10px 15px;

	${Block} &:first-child {
		padding-top: ${({ theme }) => (theme.spacing(6)-10)}px;
		@media (max-width: 1400px) {
			padding-top: ${({ theme }) => (theme.spacing(6)-10)*.7}px;
		}
	}
	${Block} &:last-child {
		padding-bottom: ${({ theme }) => (theme.spacing(6)-5)}px;
		@media (max-width: 1400px) {
			padding-bottom: ${({ theme }) => (theme.spacing(6)-5)*.7}px;
		}
	}
`;

export const FieldControl = styled.div`
	flex:1;
	display:flex;
	align-items:center;
	margin: 0 ${({ theme }) => (theme.spacing(6)/2)}px;
	@media (max-width: 1400px) {
		margin: 0 ${({ theme }) => (theme.spacing(6)/2)*.7}px;
	}
`;

//export function tField({field, label, action=false, type='text', inputProps, InputProps, form:{isSubmitting, errors, setFieldValue, values}, form}) {
export function tField(props) {
	let { field, form: { isSubmitting, errors, setFieldValue, values } } = props;
	let error = '';
	const nesting = field.name.split('.');
	const controldisabled= typeof props.controldisabled !== "undefined" ? props.controldisabled : isSubmitting;
	
	if (errors[nesting[0]]) error = nesting.reduce((acumulator, i) => {if (acumulator[i]) return acumulator[i]; return ''}, errors);

	if (props.action) {
		let actionNesting = props.action.split('.');
		let actionValue = actionNesting.reduce((acumulator, i) => {if (acumulator[i]) return acumulator[i]; return ''}, values);

		let onChange = field.onChange;
		field.onChange = (e) => {
			onChange(e);
			if (actionValue === 'new_empty') setFieldValue(props.action, 'create');
			else if (actionValue === 'editable') setFieldValue(props.action, 'update');
		}
	}


	return (
	//		<TextField {...field} inputProps={inputProps} InputProps={InputProps} onClick={(e)=>{e.stopPropagation();}} type={type} label={label}  helperText={error} disabled={isSubmitting}  />
		<TextField {...props} {...field} disabled={controldisabled} error={!!error} helperText={error}  />
	)
}

export const ImagePlaceHolderContainer = styled.div`
	text-align:center;
	padding:30px;
	background-color:#F5F5F5;
	border-radius:3px;
	transition:background-color ease-in-out .3s;

	${({ isDragActive })=>{
		if (isDragActive) return 'background-color:#B1FFA8;';
	}}

	& div {
		color:#666;
		font-size:14px;
		margin-top:7px;
	}
	& img {
		max-width:100%;
		height:auto;
	}
`;

export const ImagePlaceHolder = styled.div`
	border:5px solid #BBBBBB;
	border-radius:3px;
	padding:30px;
`;