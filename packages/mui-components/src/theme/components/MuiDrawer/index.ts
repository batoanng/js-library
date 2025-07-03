import type { Components } from '@mui/material';

export const MuiDrawer: Components['MuiDrawer'] = {
  styleOverrides: {
    root: {
      '& .MuiPaper-root.MuiPaper-elevation': {
        borderRadius: '0',
        width: '50%',
        overflow: 'visible',
      },
    },
  },
};
