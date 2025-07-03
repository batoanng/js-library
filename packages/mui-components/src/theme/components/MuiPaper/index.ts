import type { Components, Theme } from '@mui/material';

export const MuiPaper: Components<Theme>['MuiPaper'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      'backgroundColor': theme.palette.background.default,
      'borderRadius': '4px',

      '&.MuiPaper-root.MuiAccordion-root.Mui-expanded': {
        margin: '0.5rem 0',
      },

      '&.MuiTableContainer-root': {
        borderRadius: '0px',
        boxShadow: 'unset',
      },

      '& .MuiIconButton-root': {
        backgroundColor: theme.palette.grey[100],
      },

      '& .MuiTypography-caption': {
        fontWeight: 700,
      },

      '& .MuiPickersYear-yearButton': {
        'backgroundColor': theme.palette.background.default,

        '&:hover': {
          backgroundColor: theme.palette.info.light,
          color: theme.palette.text.primary,
        },

        '&:focus': {
          'backgroundColor': theme.palette.info.light,
          'color': theme.palette.text.primary,

          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
          },
        },

        '&.Mui-selected': {
          'backgroundColor': theme.palette.primary.main,

          '&:hover': {
            backgroundColor: theme.palette.info.light,
            color: theme.palette.text.primary,
          },
        },
      },

      '& .MuiPickersDay-root': {
        'fontWeight': 500,
        'backgroundColor': theme.palette.background.default,

        '&:hover': {
          backgroundColor: theme.palette.grey[300],
          color: theme.palette.text.primary,
        },

        '&:focus': {
          'backgroundColor': theme.palette.info.light,
          'color': theme.palette.text.primary,

          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          },
        },

        '&.Mui-selected': {
          'backgroundColor': theme.palette.primary.main,
          'color': theme.palette.primary.contrastText,

          '&:hover': {
            backgroundColor: theme.palette.info.light,
            color: theme.palette.text.primary,
          },
        },
      },

      '&.MuiPickersPopper-paper': {
        '& .MuiPickersDay-root.Mui-selected:hover, & .MuiPickersYear-yearButton.Mui-selected:hover': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },
      },

      '& .MuiCalendarPicker-root .MuiDayPicker-header.MuiTypography-root': {
        fontWeight: 700,
      },

      '&.MuiAutocomplete-paper': {
        width: '100%',
        borderRadius: '4px',
        borderTopLeftRadius: '0',
        borderTopRightRadius: '0',
        boxShadow: `0 4px 12px 0 rgba(0, 0, 0, 0.15)`,
      },
    }),
  },
};
