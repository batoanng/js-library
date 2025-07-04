import { Box, Stack, styled } from '@mui/material';

import LoaderSvg from '../Loader/Loader.svg';

const ButtonLoadingViewWrapper = styled(Stack)(() => ({
  'flexDirection': 'row',
  'alignItems': 'center',

  '& >img': {
    width: '2rem',
    height: '2rem',
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
  variant: ButtonLoaderVariant;
};

export const ButtonLoadingView = ({ loadingText }: ButtonLoadingViewProps) => {
  return (
    <ButtonLoadingViewWrapper>
      <img src={LoaderSvg} alt="loader" data-testid="loader" />
      {Boolean(loadingText) && <Box sx={{ ml: 1 }}>{loadingText}</Box>}
    </ButtonLoadingViewWrapper>
  );
};
