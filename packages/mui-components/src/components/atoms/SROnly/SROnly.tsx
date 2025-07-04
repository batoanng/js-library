import { Box } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import type { HTMLAttributes, PropsWithChildren } from 'react';

type SROnlyProps = Pick<HTMLAttributes<HTMLSpanElement>, 'role'>;

export const SROnly = ({ role, children }: PropsWithChildren<SROnlyProps>) => (
  <Box component="span" sx={visuallyHidden} role={role}>
    {children}
  </Box>
);
