import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
	spacing: 6,
	overrides: {
		MuiTable : {
			root:{
				'& .MuiTableCell-root' :{
					padding: '14px 20px 14px 16px',
				},
				'& .MuiTableRow-root .MuiTableCell-root:first-child':{
					paddingLeft:30,
					paddingRight:5,
				},
				'& .MuiTableRow-root .MuiTableCell-root:last-child':{
					paddingRight:30
				}
			}
		},
		MuiFormLabel : {
			root: {
				marginBottom:12
			}
		},
		MuiExpansionPanel : {
			root: {
				boxShadow:'none !important',
				'& .Mui-expanded' : {
					margin:'0 !important',
				}
			}
		},
		MuiExpansionPanelDetails : {
			root: {
				backgroundColor:'#F0F0F0'
			}
		},
		MuiFormControl : {
			root: {
				minWidth:100,
				'& .MuiInputLabel-animated' : {
					zIndex:100,
					marginTop:3,
					marginLeft:18,
					pointerEvents: 'none',
					transition: 'color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, margin 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
					'&.Mui-focused, &.MuiFormLabel-filled':{
						marginLeft:0,
						marginTop:0,
					}
				},
			}
		},
		MuiFormControlLabel : {
			label: {
				fontSize:14,
				color:'#707070'
			}
		},
		MuiTextField: {
			root:{
				'& .MuiInputBase-root' : {
					backgroundColor:"#F0F0F0",
					borderRadius:3,
					padding: '9px 18px',
					'& input' : {
						padding:0,
					},
					'&::before, &::after ' : {
						borderBottom:'none !important'
					}
				},
				'& .MuiInput-input' : {
					background:"none !important",
					padding:0
				},
			},
		},
		MuiSelect:{
			select:{
				backgroundColor:"#F0F0F0",
				borderRadius:3,
				padding: '9px 26px 9px 12px',
			},
		
		},
		MuiPaper : {
			root: {
				overflow:'hidden',
			}
		},
		MuiButton: {
			root: {
				'& .iconLeft' : {
					marginRight:5,
					marginTop:-3
				}
			}
		}
	},
	props: {
		MuiTextField: {
			fullWidth : true,
		},
		MuiSelect : {
			disableUnderline : true,
			fullWidth : true,
		},
		MuiTablePagination : {
			labelRowsPerPage : 'linhas por página',
			labelDisplayedRows : ({ from, to, count }) => `${from}-${to} de ${count}`,
			SelectProps : {
				fullWidth:false,
			}
		},
		MuiFormControl : {
			fullWidth:true,
		}
	},
	palette : {
		primary: {
			main:'#363E5E'
		},
		secondary: {
			main:'#D41450'
		},
	}
});