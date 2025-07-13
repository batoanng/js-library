import type { SxProps, Theme } from '@mui/material';
import { styled, Typography } from '@mui/material';

import Spinner from '../../assets/Spinner.svg';
import { TransientOptions } from './types';

const SvgContainer = styled(
  'img',
  TransientOptions
)<{ $fullScreen: boolean }>(({ theme, $fullScreen }) => ({
  'height': theme.spacing(4.375),
  'width': theme.spacing(4.375),
  'animation': 'rotate 1s, fade 1s',
  'animationIterationCount': 'infinite',
  'animationTimingFunction': 'linear',
  'transform': $fullScreen ? 'scale(3)' : 'scale(1)',

  '@keyframes rotate': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
  '@keyframes fade': {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.5,
    },
    '100%': {
      opacity: 1,
    },
  },
}));

const CircularLoaderContainer = styled(
  'div',
  TransientOptions
)<{ $fullScreen: boolean }>(({ theme, $fullScreen }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: $fullScreen ? 'fixed' : 'absolute',
  height: $fullScreen ? '100%' : 'inherit',
  width: $fullScreen ? '100%' : 'inherit',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0.8,
  backgroundColor: theme.palette.background.default,
  zIndex: 1000,
}));

const LoadingText = styled(
  Typography,
  TransientOptions
)<{ $fullScreen: boolean }>(({ $fullScreen, theme }) => ({
  marginTop: theme.spacing(2),
  fontSize: $fullScreen ? theme.typography.pxToRem(28) : theme.typography.pxToRem(16),
}));

interface CircularLoaderProps {
  fullScreen?: boolean;
  label?: string;
  sxOverrides?: {
    container?: SxProps<Theme>;
    text?: SxProps<Theme>;
  };
}

export const CircularLoader = (props: CircularLoaderProps) => {
  const { fullScreen = false, label = 'One moment, please...', sxOverrides = {} } = props;

  return (
    <CircularLoaderContainer $fullScreen={fullScreen} sx={sxOverrides.container}>
      <SvgContainer $fullScreen={fullScreen} src={Spinner} alt="loader" />
      <LoadingText $fullScreen={fullScreen} variant={fullScreen ? 'h2' : 'body1'} sx={sxOverrides.text}>
        {label}
      </LoadingText>
    </CircularLoaderContainer>
  );
};
