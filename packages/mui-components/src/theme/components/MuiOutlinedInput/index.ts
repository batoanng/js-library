import type { Components, Theme } from '@mui/material';

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
      'borderRadius': '4px',
      'height': '3rem',
      'backgroundColor': theme.palette.background.default,

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
        'height': 'auto',

        '& textarea': {
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '4px',
          resize: 'both',
          padding: '0.75rem 1rem',
          maxWidth: '100%',
        },

        '&.Mui-focused textarea': {
          outline: `${theme.palette.primary.main} solid 3px`,
          outlineOffset: '3px',
        },

        '&.Mui-error textarea': {
          borderColor: theme.palette.error.main,
          borderWidth: '2px',
        },

        '&.Mui-disabled textarea': {
          backgroundColor: theme.palette.action.disabledBackground,
          border: `1px solid ${theme.palette.action.disabled}`,
        },

        '& + .MuiTypography-body2': {
          fontWeight: 400,
          color: theme.palette.text.secondary,
        },
      },
    }),
  },
};
