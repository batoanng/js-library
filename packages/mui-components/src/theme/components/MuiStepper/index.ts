import type { Components, Theme } from '@mui/material';

export const MuiStepper: Components<Theme>['MuiStepper'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'color': theme.palette.secondary.dark,

      '& .MuiStepLabel-labelContainer': {
        'color': theme.palette.secondary.dark,

        '& .MuiStepLabel-label': {
          color: theme.palette.text.disabled,
          fontSize: '1.125rem',
        },
        '& .Mui-disabled.MuiStepLabel-label': {
          color: theme.palette.text.primary,
        },
        '& .MuiStepLabel-alternativeLabel': {
          'fontWeight': '300',
          'fontSize': '1rem',
          '@media (max-width: 48rem)': {
            display: 'none',
          },
        },
        '& .Mui-active.MuiStepLabel-label': {
          color: theme.palette.secondary.dark,
          fontWeight: '700',
        },
      },

      '& .MuiStep-alternativeLabel': {
        '@media (max-width: 48rem)': {
          paddingLeft: '0',
          paddingRight: '0',
        },
      },

      '& .MuiStepLabel-alternativeLabel': {
        '@media (max-width: 48rem)': {
          alignItems: 'flex-start',
        },
      },

      '& .MuiStepButton-horizontal': {
        'fontSize': '1rem',
        'padding': '0',
        'margin': '0',
        '@media (max-width: 48rem)': {
          justifyContent: 'flex-start',
        },
      },

      '& .MuiStepLabel-vertical': {
        'padding': '0',
        '& .MuiStepLabel-iconContainer': {
          paddingRight: '1.5rem',
        },
      },

      '& .MuiStepButton-vertical': {
        fontSize: '1rem',
      },

      '& .MuiStepContent-root': {
        borderLeft: '2px solid',
        borderColor: theme.palette.text.disabled,
        marginLeft: '15px',
        paddingLeft: '40px',
      },

      '& .MuiStepContent-last': {
        border: 'none',
      },

      '& .MuiStepLabel-iconContainer': {
        zIndex: 2,
      },

      '& .MuiStepIcon-root': {
        color: theme.palette.primary.contrastText,
        fontSize: '1.75rem',
        border: '2px solid',
        borderColor: theme.palette.text.disabled,
        borderRadius: '50%',
        width: '2rem',
        height: '2rem',
        boxSizing: 'border-box',
      },

      '& .MuiStepIcon-text': {
        fill: theme.palette.text.disabled,
        fontWeight: '700',
      },

      '& .MuiStepConnector-line': {
        borderColor: theme.palette.text.disabled,
      },

      '& .MuiStepConnector-root': {
        'left': 'calc(-50% + 15px)',
        'right': 'calc(50% + 15px)',
        'top': '15px',

        '@media (max-width: 48rem)': {
          left: '-100%',
          right: '100%',
        },

        '& .MuiStepConnector-line': {
          color: theme.palette.text.disabled,
        },

        '& .MuiStepConnector-lineHorizontal': {
          borderTopWidth: '3px',
        },
      },

      '& .MuiStepConnector-vertical': {
        'marginLeft': '15px',
        '& .MuiStepConnector-lineVertical': {
          borderLeftWidth: '2px',
        },
      },

      '& .Mui-completed': {
        '& .MuiStepLabel-label': {
          color: theme.palette.secondary.dark,
        },
        '& .ProgressStepperCheckIcon': {
          backgroundColor: theme.palette.secondary.dark,
          fontSize: '1.75rem',
          border: '2px solid',
          borderRadius: '100rem',
          borderColor: theme.palette.secondary.dark,
          color: theme.palette.secondary.contrastText,
          width: '2rem',
          height: '2rem',
          boxSizing: 'border-box',
        },
        '& .MuiStepConnector-line': {
          borderColor: theme.palette.secondary.main,
        },
      },

      '& .Mui-active': {
        '& .MuiStepIcon-root': {
          color: theme.palette.secondary.dark,
          border: 'none',
          fontSize: '2rem',
          width: '2rem',
          height: '2rem',
        },
        '& .MuiStepIcon-text': {
          fill: theme.palette.secondary.contrastText,
        },
        '& .MuiStepConnector-line': {
          borderColor: theme.palette.secondary.dark,
        },
      },
    }),
  },
};
