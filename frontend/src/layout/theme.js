import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
	overrides: {
		MuiFormControl : {
			root: {
				minWidth:200,
			}
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
		MuiSelect : {
			disableUnderline : true,
		}
	}
});