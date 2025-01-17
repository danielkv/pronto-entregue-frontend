import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

const theme = responsiveFontSizes(createMuiTheme({
	typography: {
		body1: {
			color: '#333',
			'@media (max-width:1400px)': {
				fontSize: '.9rem',
			},
		},
		body2: {
			color: '#333',
			'@media (max-width:1400px)': {
				fontSize: '.8rem',
			},
		},
		h4: {
			'@media (max-width:1400px)': {
				fontSize: '.9rem',
			},
		}
	},
	spacing: 6,
	shape: {
		borderRadius: 15
	},
	overrides: {
		MuiTable: {
			root: {
				'& .MuiTableCell-root': {
					padding: '14px 20px 14px 16px',
					'@media (max-width: 1400px)': {
						padding: '10px 13px 10px 10px',
					}
				},
				'& .MuiTableRow-root .MuiTableCell-root:first-child': {
					paddingLeft: 30,
					paddingRight: 5,
				},
				'& .MuiTableRow-root .MuiTableCell-root:last-child': {
					'@media (min-width: 1401px)': {
						paddingRight: 30
					}
				}
				
			}
		},
		MuiListItemIcon: {
			root: {
				minWidth: 40,
			}
		},
		MuiFormLabel: {
			root: {
				marginBottom: 12
			}
		},
		MuiExpansionPanel: {
			root: {
				margin: '0 !important',
				boxShadow: 'none !important',

				'& .MuiExpansionPanelSummary-content': {
					margin: '0 !important',
				},

				'&.MuiPaper-root': {
					overflow: 'visible !important',
				},
			}
		},
		MuiList: {
			root: {
				'&.dropdown': {
					position: 'absolute',
					right: 0,
					left: 0,
					zIndex: 999,
					borderRadius: 3,
					padding: 0,
					backgroundColor: '#fff',
					boxShadow: '2px 2px 6px rgba(0,0,0,0.4)',
					overflow: 'hidden',
					'& li': {
						cursor: 'default',
						color: '#666'
					}
				}
			}
		},
		MuiExpansionPanelDetails: {
			root: {
				backgroundColor: '#F3f3f3'
			}
		},
		MuiFormControl: {
			root: {
				minWidth: 100,
				'& .MuiInputLabel-animated': {
					zIndex: 100,
					marginTop: 3,
					marginLeft: 18,
					pointerEvents: 'none',
					transition: 'color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, margin 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
					'&.MuiInputLabel-shrink, &.MuiFormLabel-filled': {
						marginLeft: 0,
						marginTop: 0,
					}
				},
			}
		},
		MuiFormControlLabel: {
			label: {
				fontSize: 14,
				color: '#707070'
			}
		},
		MuiTextField: {
			
			root: {
				'& .MuiInputAdornment-root': {
					marginLeft: 8,
				},
				
				'& .MuiInputBase-root': {
					backgroundColor: "#F0F0F0",
					borderRadius: 4,
					overflow: 'hidden',

					'&::before, &::after ': {
						borderBottom: 'none !important'
					},
				},
				'& .MuiInput-input': {
					borderRadius: 4,
					//backgroundColor: "#F0F0F0",
					
					padding: '9px 18px',
					'& input': {
						padding: 0,
					},
				},
			},
		},
		MuiSelect: {
			select: {
				backgroundColor: "#F0F0F0",
				borderRadius: 3,
				padding: '9px 26px 9px 12px',
			},
		
		},
		MuiPaper: {
			root: {
				// overflow: 'hidden',
			}
		},
		MuiButton: {
			root: {
				borderRadius: 20,
				'& .iconLeft': {
					marginRight: 5,
					marginTop: -3
				}
			}
		},
		MuiToggleButtonGroup: {
			root: {
				backgroundColor: 'none',
			},
		},
		MuiToggleButton: {
			root: {
				height: 37,
				backgroundColor: '#fff',
			}
		},
		MuiSnackbarContent: {
			root: {
				'&.error': {
					backgroundColor: '#c1051d'
				},
				'&.success': {
					backgroundColor: '#309a39'
				}
			}
		}
	},
	props: {
		
		MuiCircularProgress: {
			color: 'primary',
			size: 25,
			thickness: 4,
		},
		MuiTextField: {
			fullWidth: true,
		},
		MuiSelect: {
			//disableUnderline : true, // FUNCIONA, MAS RETORNA UM ERRO NO CONSOLE
			fullWidth: true,
		},
		MuiTablePagination: {
			labelRowsPerPage: 'linhas por página',
			labelDisplayedRows: ({ from, to, count }) => `${from}-${to} de ${count}`,
			SelectProps: {
				fullWidth: false,
			}
		},
		MuiFormControl: {
			fullWidth: true,
		}
	},
	palette: {
		primary: {
			main: '#F11761'
		},
		secondary: {
			main: '#A4D82B'
		},
	}
}));

export default theme;