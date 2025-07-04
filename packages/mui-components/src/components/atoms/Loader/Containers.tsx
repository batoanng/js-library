import { Box, type SxProps, useTheme } from '@mui/material';
import type { PropsWithChildren } from 'react';

import type { FullPageLoaderProps } from '@/components/atoms/Loader/types';

export const IconContainer = ({ children }: PropsWithChildren) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        'textIndent': '100%',
        'overflow': 'hidden',
        'width': '100%',
        'height': theme.typography.pxToRem(70),

        '& svg': {
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: theme.typography.pxToRem(70),
          height: theme.typography.pxToRem(70),
        },
      }}
    >
      {children}
    </Box>
  );
};

export const LabelContainer = ({ fullPage, children }: PropsWithChildren<FullPageLoaderProps>) => {
  const theme = useTheme();

  const sxProps: SxProps = fullPage
    ? {
        fontSize: theme.typography.h2.fontSize,
        fontWeight: theme.typography.fontWeightBold,
      }
    : {};

  return (
    <Box component="p" sx={{ m: theme.spacing(1, 0, 0), ...sxProps }}>
      {children}
    </Box>
  );
};
