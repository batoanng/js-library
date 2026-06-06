import { type Components, type Theme, alpha } from '@mui/material/styles';

export const MuiOutlinedInput: Components<Theme>['MuiOutlinedInput'] = {
  styleOverrides: {
    input: ({ theme }) => ({
      '&:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.default} inset`,
        WebkitTextFillColor: theme.palette.text.secondary,
        padding: '0',
      },
    }),
    root: ({ theme }) => ({
      'marginTop': '0.25rem',
      'marginBottom': '0.25rem',
      'border': `1px solid ${theme.palette.divider}`,
      'borderRadius': 0,
      'height': '3rem',
      'backgroundColor': theme.palette.background.default,
      'transition': 'background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease',

      '&:hover': {
        backgroundColor: theme.designTokens.stateLayers.interactiveSurface,
        borderColor: theme.designTokens.borders.focus,
      },

      '&.Mui-focused': {
        backgroundColor: theme.designTokens.stateLayers.interactiveSurface,
        borderColor: theme.designTokens.borders.focus,
        boxShadow: `0 0 0 2px ${alpha(theme.designTokens.borders.focus, theme.palette.mode === 'dark' ? 0.32 : 0.2)}`,
      },

      '&.Mui-error': {
        borderColor: theme.palette.error.main,
        boxShadow: `0 0 0 1px ${alpha(theme.palette.error.main, theme.palette.mode === 'dark' ? 0.34 : 0.22)}`,
      },

      '&.Mui-disabled': {
        backgroundColor: theme.palette.action.disabledBackground,
        borderColor: theme.palette.divider,
        boxShadow: 'none',
      },

      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },

      '& .MuiSelect-select': {
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        minHeight: '100% !important',
      },
      '&.MuiNativeSelect-root': {
        padding: 0,
      },
      '& .MuiSelect-icon': {
        transform: 'scale(1.25)',
        right: '0.5rem',
        color: theme.palette.text.primary,
      },
      'input': {
        marginLeft: '0',
        padding: '0.75rem 0',
      },

      // Textarea support
      '&.MuiInputBase-multiline': {
        'border': 'none',
        'outline': 'none',
        'boxShadow': 'none',
        'height': 'auto',

        '& textarea': {
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 0,
          resize: 'both',
          padding: '0.75rem 1rem',
          maxWidth: '100%',
        },

        '&.Mui-error textarea': {
          borderColor: theme.palette.error.main,
          borderWidth: '2px',
        },

        '&.Mui-disabled textarea': {
          backgroundColor: theme.palette.action.disabledBackground,
          border: `1px solid ${theme.palette.divider}`,
        },

        '& + .MuiTypography-body2': {
          fontWeight: 400,
          color: theme.palette.text.secondary,
        },
      },
    }),
  },
};
