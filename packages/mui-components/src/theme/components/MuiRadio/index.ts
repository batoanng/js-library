import type { Components, Theme } from '@mui/material';

export const MuiRadio: Components<Theme>['MuiRadio'] = {
  defaultProps: {
    disableRipple: true,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      'color': theme.palette.grey[800],
      'padding': '0',
      'marginRight': '1rem',
      'minWidth': '2rem',
      'alignSelf': 'flex-start',
      'backgroundColor': theme.palette.background.default,

      '& > span:first-of-type': {
        width: '2rem',
        height: '2rem',
        border: '1px solid',
        borderRadius: '100rem',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },

      '& svg': {
        display: 'none',
      },

      '&.Mui-checked': {
        'color': theme.palette.grey[800],

        '&.MuiRadio-colorError': {
          color: theme.palette.error.main,
        },

        '& > span:first-of-type:after': {
          content: "''",
          position: 'absolute',
          width: '1.375rem',
          height: '1.375rem',
          backgroundColor: theme.palette.primary.main,
          borderRadius: '100rem',
        },
      },

      '&:hover': {
        backgroundColor: 'transparent',
      },

      '& input:focus + span': {
        outline: `${theme.palette.info.main} solid 3px`,
        outlineOffset: '3px',
      },

      '&.Mui-disabled': {
        'color': theme.palette.grey[400],
        'backgroundColor': theme.palette.grey[100],

        '& > span:first-of-type:after': {
          backgroundColor: theme.palette.grey[400],
        },
      },
    }),
  },
};
