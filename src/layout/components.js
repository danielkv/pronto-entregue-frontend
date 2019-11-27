import React, { useRef, useEffect } from 'react';
import styled, {keyframes} from 'styled-components';
import { Paper, TextField, TableCell } from '@material-ui/core';

import Icon from '@mdi/react';
import {mdiLoading} from '@mdi/js';

const rotate = keyframes`
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
`;

export const Loading = styled(Icon).attrs(({size})=>{
	return ({
		path: mdiLoading,
		size: size || '26',
		color:'#707070'
	})
})`
	margin-left:10px;
	animation: ${rotate} 1s linear infinite;
`
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
	let styles = {...props.style};

	useEffect(() => {
	
	}, [ref]);
	
	if (ref.current && props.selected) {
		let {width} = ref.current.getBoundingClientRect();
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
	grid-template-columns: 130px auto;
	grid-template-rows: 95px auto;

	grid-template-areas:"header header"
						"navigation main";

						grid-gap:20px;
	@media (min-width:769px) {
		grid-gap:27px;
	}
	@media (min-width:1439px) {
		grid-gap:35px;
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

`;

export const SidebarContainer = styled.aside`
	width:300px;
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
	margin-right:65px;
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
	justify-content:flex-start;
	align-items:center;
	margin-bottom:10px;
`
export const BlockFooter = styled.div`
	display:flex;
	justify-content:space-between;
	align-items:flex-start;
`

export const BlockTitle = styled.h2`
	display:flex;
	align-items:center;
	font-size:18px;
	font-weight:normal;
	color:#707070;
	margin:0;
	margin-right:10px;
`

export const NumberOfRows = styled.div`
	font-size:14px;
	font-weight:lighter;
	color:#707070;
	text-align:right;
	margin:8px 8px 0 0;
	margin-left:auto;
`

export const CircleNumber = styled.div`
	background-color:#F0F0F0;
	border-radius:20px;
	width:36px;
	height:36px;
	text-align:center;
	color:#D41450;
	font-size:15px;
	font-weight:bold;
	display:flex;
	align-items:center;
	justify-content:center;
`;

export const FormRow = styled.div`
	display:flex;
	justify-items:stretch;
	padding:0 15px 10px 15px;

	${Block} &:first-child {
		padding-top:20px;
	}
	${Block} &:last-child {
		padding-bottom:30px;
	}
`;

export const FieldControl = styled.div`
	flex:1;
	display:flex;
	align-items:center;
	margin: 0 15px;
`;

export const ProductImage = styled.div`
	background-size: cover;
	background-image:${props=>`url(${props.src})`};
	width:60px;
	height:60px;
	border-radius:30px;
`;

//export function tField({field, label, action=false, type='text', inputProps, InputProps, form:{isSubmitting, errors, setFieldValue, values}, form}) {
export function tField(props) {
	let {field, form:{isSubmitting, errors, setFieldValue, values}} = props;
	let error = '';
	const nesting = field.name.split('.');
	let controlDisabled = typeof props.controlDisabled !== "undefined" ? props.controlDisabled : isSubmitting;
	
	if (errors[nesting[0]]) error = nesting.reduce((acumulator, i) => {if (acumulator[i]) return acumulator[i]; return ''}, errors);

	if (props.action) {
		let action_nesting = props.action.split('.');
		let action_value = action_nesting.reduce((acumulator, i) => {if (acumulator[i]) return acumulator[i]; return ''}, values);

		let onChange = field.onChange;
		field.onChange = (e) => {
			onChange(e);
			if (action_value === 'new_empty') setFieldValue(props.action, 'create');
			else if (action_value === 'editable') setFieldValue(props.action, 'update');
		}
	} 


	return (
//		<TextField {...field} inputProps={inputProps} InputProps={InputProps} onClick={(e)=>{e.stopPropagation();}} type={type} label={label}  helperText={error} disabled={isSubmitting}  />
		<TextField {...props} {...field} disabled={controlDisabled} error={!!error} helperText={error}  />
	)
}

export const ImagePlaceHolderContainer = styled.div`
	text-align:center;
	padding:30px;
	background-color:#F5F5F5;
	border-radius:3px;
	transition:background-color ease-in-out .3s;

	${({isDragActive})=>{
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