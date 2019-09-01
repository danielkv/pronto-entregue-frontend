import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
	overrides: {
		MuiFormControl : {
			root: {
				minWidth:200,
			}
		},
		MuiFormControlLabel : {
			label: {
				fontSize:14,
				color:'#707070'
			}
		},
		MuiTextField: {backgroundColor:"#F0F0F0",
			root:{
				'& .MuiFormLabel-root':{
					zIndex:100,
					marginTop:5,
					marginLeft:18,
					pointerEvents: 'none',
					transition: 'color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, margin 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
					'&.Mui-focused, &.MuiFormLabel-filled':{
						marginLeft:0,
						marginTop:0,
					}
				},
				'& .MuiInputBase-root' : {
					backgroundColor:"#F0F0F0",
					borderRadius:3,
					padding: '11px 18px',
					'& input' : {
						padding:0,
					},
					'&::before, &::after ' : {
						borderBottom:'none !important'
					}
				}
			},
		},
		MuiSelect:{
			select:{
				backgroundColor:"#F0F0F0",
				borderRadius:3,
				padding: '8px 26px 8px 12px',
			},
		
		}
	},
	props: {
		MuiTextField: {
			fullWidth : true,
		},
		MuiSelect : {
			disableUnderline : true,
		},
		MuiTablePagination : {
			labelRowsPerPage : 'linhas por página',
			labelDisplayedRows : ({ from, to, count }) => `${from}-${to} de ${count}`
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