import type { ButtonProps as MuiButtonProps } from '@mui/material';
import { Button as MuiButton } from '@mui/material';
import { forwardRef } from 'react';

import { ButtonLoadingView } from './ButtonLoadingView';

export type ButtonProps = MuiButtonProps & {
  loading?: boolean;
  loadingText?: string;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading, loadingText = '', children, disabled, size = 'medium', ...buttonProps }, ref) => {
    return (
      <MuiButton ref={ref} disabled={loading || disabled} size={size} {...buttonProps}>
        {loading ? <ButtonLoadingView loadingText={loadingText} variant={size} /> : children}
      </MuiButton>
    );
  }
);
