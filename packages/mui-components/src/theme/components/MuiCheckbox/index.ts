import type { Components, Theme } from '@mui/material';

export const MuiCheckbox: Components<Theme>['MuiCheckbox'] = {
  defaultProps: {
    disableRipple: true,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      'color': theme.palette.text.primary,
      'padding': 0,
      'border': '1px solid',
      'borderRadius': 0,
      'width': theme.designTokens.dimensions.checkboxSize,
      'minWidth': theme.designTokens.dimensions.checkboxSize,
      'alignSelf': 'flex-start',
      'height': theme.designTokens.dimensions.checkboxSize,
      'marginRight': theme.designTokens.dimensions.checkboxGap,
      'backgroundColor': theme.palette.background.paper,

      '& svg': {
        display: 'none',
      },

      '&.Mui-checked': {
        'backgroundColor': 'transparent',
        'color': theme.palette.text.primary,

        '& svg': {
          height: theme.designTokens.dimensions.checkboxIconSize,
          width: theme.designTokens.dimensions.checkboxIconSize,
          display: 'inline-block',
        },

        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      },

      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },

      '&.Mui-disabled': {
        'backgroundColor': theme.palette.action.disabledBackground,
        'borderColor': theme.palette.divider,

        '& svg': {
          backgroundColor: theme.palette.divider,
        },
      },
    }),
  },
};
