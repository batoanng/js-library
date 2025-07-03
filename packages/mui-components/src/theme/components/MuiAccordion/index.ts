import type { Components, Theme } from '@mui/material';

export const MuiAccordion: Components<Theme>['MuiAccordion'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'marginTop': '0.5rem',
      'marginBottom': '0.5rem',
      'borderRadius': '0',
      'backgroundColor': theme.palette.background.default,
      'boxShadow': 'none',

      '& div:not(.MuiAlert-icon) > svg': {
        fill: theme.palette.primary.main,
      },

      '& .MuiAccordionSummary-content': {
        'margin': 0,
        'marginRight': '1rem',

        '&.Mui-expanded': {
          margin: 0,
        },

        '& .MuiTypography-root': {
          fontWeight: 600,
        },
      },

      '& .Mui-expanded': {
        'backgroundColor': theme.palette.primary.main,

        '& .MuiTypography-root': {
          color: theme.palette.primary.contrastText,
        },

        '& svg': {
          fill: theme.palette.primary.contrastText,
        },
      },

      '& .MuiCollapse-root': {
        boxShadow: 'none !important',
        backgroundColor: theme.palette.background.paper,
      },

      '& .MuiAccordionSummary-root': {
        'padding': '1rem',

        '&.Mui-focusVisible': {
          backgroundColor: theme.palette.background.default,
          outline: `${theme.palette.primary.main} solid 3px`,
          outlineOffset: '3px',
        },

        '& svg': {
          transform: 'scale(1.25)',
        },

        '&.Mui-expanded': {
          minHeight: 0,
        },
      },

      '& .MuiAccordionSummary-root:hover': {
        'backgroundColor': theme.palette.primary.main,

        '& .MuiTypography-root': {
          color: theme.palette.primary.contrastText,
        },

        '& svg': {
          fill: theme.palette.primary.contrastText,
        },
      },

      '&:before': {
        content: 'none',
      },
    }),
  },
};
