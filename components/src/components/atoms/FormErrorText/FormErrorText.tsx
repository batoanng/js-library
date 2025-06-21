import { Error } from '@mui/icons-material';
import type { StackProps } from '@mui/material';
import { Stack, Typography } from '@mui/material';
import type { PropsWithChildren } from 'react';

type FormErrorTextProps = StackProps &
  PropsWithChildren & {
    className?: string;
  };

export const FormErrorText = ({ children, className = '', sx = {}, ...stackProps }: FormErrorTextProps) => {
  return (
    <Stack
      className={`form-error-text ${className}`}
      sx={{ my: 0.5, alignItems: 'flex-start', flexDirection: 'row', ...sx }}
      {...stackProps}
    >
      <Error
        sx={{
          color: (theme) => theme.palette.error.main,
          width: (theme) => theme.spacing(2.25),
          height: (theme) => theme.spacing(2.25),
          paddingTop: (theme) => theme.spacing(0.1),
          marginRight: (theme) => theme.spacing(1),
        }}
      />
      <Typography color="error" component="span" sx={{ lineHeight: 1.3 }}>
        {children}
      </Typography>
    </Stack>
  );
};
