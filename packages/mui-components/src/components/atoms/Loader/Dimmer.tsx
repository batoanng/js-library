import { Stack, type StackProps } from '@mui/material';
import { type PropsWithChildren } from 'react';

import { type FullPageLoaderProps } from './types';

export const Dimmer = ({
  fullPage = false,
  children,
  sx = {},
  ...stackProps
}: PropsWithChildren<FullPageLoaderProps & StackProps>) => {
  return (
    <Stack
      sx={{
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: (theme) => theme.zIndex.tooltip + 1,
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        position: fullPage ? 'fixed' : 'absolute',
        opacity: 0.8,
        transitionProperty: 'opacity',
        ...sx,
      }}
      {...stackProps}
    >
      {children}
    </Stack>
  );
};
