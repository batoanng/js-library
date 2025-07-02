import { createTheme } from '@mui/material';

import { breakpoints } from './breakpoints';
import { defaultTypography } from './typography/default';
import { colourTheme } from './colourTheme';

export const defaultTheme = createTheme({
  breakpoints: {
    values: breakpoints,
  },
  typography: defaultTypography,
  palette: colourTheme,
  shape: {
    borderRadius: 4,
  },
});
