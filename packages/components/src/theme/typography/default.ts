import type { TypographyVariantsOptions } from '@mui/material/styles';

export const defaultTypography: TypographyVariantsOptions = {
  fontFamily: "'Public Sans', Arial, sans-serif",
  fontWeightMedium: 500,
  fontWeightRegular: 300,
  fontWeightBold: 700,
  fontSize: 14,
  button: {
    textTransform: 'none',
    fontWeight: 600,
  },
  h1: {
    'fontSize': '2.25rem',
    'fontWeight': 700,
    'lineHeight': 1.4,
    'letterSpacing': '0px',
    'textAlign': 'left',
    '@media (max-width: 768px)': {
      fontSize: '2rem',
      lineHeight: 1.4,
    },
  },
  h2: {
    'fontSize': '1.75rem',
    'fontWeight': 700,
    'lineHeight': 1.4,
    'letterSpacing': '0px',
    'textAlign': 'left',
    '@media (max-width: 768px)': {
      fontSize: '1.625rem',
      lineHeight: 1.4,
    },
  },
  h3: {
    'fontSize': '1.375rem',
    'fontWeight': 700,
    'lineHeight': 1.4,
    'letterSpacing': '0px',
    'textAlign': 'left',
    '@media (max-width: 768px)': {
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
  },
  h4: {
    fontSize: '1.125rem',
    fontWeight: 700,
    lineHeight: 1.4,
    letterSpacing: '0px',
    textAlign: 'left',
  },
  h5: {
    fontSize: '1rem',
    fontWeight: 700,
    lineHeight: 1.5,
    letterSpacing: '0px',
    textAlign: 'left',
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 700,
    lineHeight: 1.5,
    letterSpacing: '0px',
    textAlign: 'left',
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 300,
    lineHeight: 1.5,
    letterSpacing: '0px',
    textAlign: 'left',
  },
};
