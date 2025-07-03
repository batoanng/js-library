import type { Components } from '@mui/material';

export const MuiCollapse: Components['MuiCollapse'] = {
  styleOverrides: {
    root: {
      '& .MuiCollapse-wrapperInner .MuiAccordionDetails-root': {
        boxShadow: '0px 0px 0px 0px',
        padding: '1rem',
      },
    },
  },
};
