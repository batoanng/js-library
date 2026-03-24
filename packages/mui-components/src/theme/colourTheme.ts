export interface ThemeColors {
  background: string;
  backgroundLight: string;
  foreground: string;
  primary: string;
  primaryLight: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  border: string;
  input: string;
  hover: string;
  ring: string;
  contrastText: string;
  contrastTextLight: string;
  textPrimary: string;
}

export const lightColors: ThemeColors = {
  background: '#ffffff',
  backgroundLight: '#ffffff',
  foreground: '#262626',
  primary: '#343434',
  primaryLight: '#34343429',
  primaryForeground: '#fcfcfc',
  secondary: '#f7f7f7',
  secondaryForeground: '#343434',
  muted: '#f7f7f7',
  mutedForeground: '#8c8c8c',
  accent: '#f7f7f7',
  accentForeground: '#343434',
  error: '#df3826',
  warning: '#ffcc4b',
  success: '#88e251',
  info: '#4fa3ff',
  border: '#ebebeb',
  input: '#ebebeb',
  hover: '#ebebeb',
  ring: '#b5b5b5',
  contrastText: '#fcfcfc',
  contrastTextLight: '#343434',
  textPrimary: '#262626',
};

export const darkColors: ThemeColors = {
  background: '#000',
  backgroundLight: '#111111e6',
  foreground: '#fcfcfc',
  primary: '#ebebeb',
  primaryLight: '#ebebeb29',
  primaryForeground: '#ebebeb3d',
  secondary: '#444444',
  secondaryForeground: '#fcfcfc',
  muted: '#444444',
  mutedForeground: '#b5b5b5',
  accent: '#444444',
  accentForeground: '#fcfcfc',
  error: '#e04d33',
  warning: '#e48c32',
  success: '#62f2cf',
  info: '#55b2b5',
  border: 'rgba(255, 255, 255, 0.10)',
  input: 'rgba(255, 255, 255, 0.15)',
  hover: 'rgba(255, 255, 255, 0.15)',
  ring: '#8c8c8c',
  contrastText: '#111111',
  contrastTextLight: '#fcfcfc',
  textPrimary: '#fcfcfc',
};
