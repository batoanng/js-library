import { Box, Stack, styled } from '@mui/material';

import LoaderSvg from '../Loader/Loader.svg?react';

const ButtonLoadingViewWrapper = styled(Stack)(({ theme }) => ({
  'flexDirection': 'row',
  'alignItems': 'center',

  '& .button-loader': {
    width: theme.designTokens.dimensions.inlineLoaderSize,
    height: theme.designTokens.dimensions.inlineLoaderSize,
    color: theme.palette.text.secondary,
    flexShrink: 0,
  },
}));

const buttonVariants = {
  small: { size: 0.875, borderWidth: 2 },
  medium: { size: 1.5, borderWidth: 3 },
  large: { size: 2, borderWidth: 3 },
};

export type ButtonLoaderVariant = keyof typeof buttonVariants;

export type ButtonLoadingViewProps = {
  loadingText: string;
  variant?: ButtonLoaderVariant;
};

export const ButtonLoadingView = ({ loadingText }: ButtonLoadingViewProps) => {
  return (
    <ButtonLoadingViewWrapper>
      <Box component={LoaderSvg} aria-hidden data-testid="loader" className="button-loader" />
      {Boolean(loadingText) && <Box sx={{ ml: 1 }}>{loadingText}</Box>}
    </ButtonLoadingViewWrapper>
  );
};
