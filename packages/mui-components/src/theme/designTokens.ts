import { alpha, type Palette } from '@mui/material/styles';

import type { ThemeColors } from './colourTheme';

export interface DesignTokens {
  stateLayers: {
    interactiveSurface: string;
    interactiveHover: string;
    interactiveStrong: string;
    interactiveSelected: string;
    brandSurface: string;
    fileUploadGlow: string;
    backdrop: string;
  };
  elevation: {
    card: string;
    popover: string;
    fileUploadHover: string;
    fileUploadBadge: string;
    fileUploadButton: string;
  };
  borders: {
    subtle: string;
    strong: string;
    focus: string;
  };
  dimensions: {
    checkboxSize: string;
    checkboxIconSize: string;
    checkboxGap: string;
    floatingRadius: string;
    loaderSize: string;
    inlineLoaderSize: string;
    fileUploadGlowInset: string;
    fileUploadMinHeight: string;
    fileUploadWidth: string;
    fileUploadIconSize: string;
    fileUploadButtonHeight: string;
    fileUploadButtonPaddingX: string;
    fileUploadHeadingSize: string;
    modalMaxWidth: string;
    modalGutter: string;
    modalPadding: string;
    modalMobilePadding: string;
    modalSectionGap: string;
  };
}

interface CreateDesignTokensOptions {
  colors: ThemeColors;
  palette: Palette;
  darkTheme: boolean;
}

export const createDesignTokens = ({ colors, palette, darkTheme }: CreateDesignTokensOptions): DesignTokens => {
  const surfaceShadowColor = darkTheme ? colors.background : colors.foreground;

  return {
    stateLayers: {
      interactiveSurface: alpha(colors.foreground, darkTheme ? 0.1 : 0.04),
      interactiveHover: alpha(colors.foreground, darkTheme ? 0.15 : 0.08),
      interactiveStrong: alpha(colors.foreground, darkTheme ? 0.15 : 0.06),
      interactiveSelected: palette.primary.light,
      brandSurface: alpha(colors.info, darkTheme ? 0.28 : 0.16),
      fileUploadGlow: alpha(colors.primary, darkTheme ? 0.24 : 0.16),
      backdrop: alpha(colors.background, darkTheme ? 0.72 : 0.5),
    },
    elevation: {
      card: `0 4px 12px 0 ${alpha(surfaceShadowColor, darkTheme ? 0.5 : 0.15)}`,
      popover: `0 4px 12px 0 ${alpha(surfaceShadowColor, darkTheme ? 0.5 : 0.15)}`,
      fileUploadHover: `0 18px 50px ${alpha(colors.foreground, darkTheme ? 0.1 : 0.12)}, 0 0 0 1px ${alpha(
        colors.ring,
        darkTheme ? 0.3 : 0.2
      )}`,
      fileUploadBadge: `0 8px 24px ${alpha(surfaceShadowColor, darkTheme ? 0.8 : 0.25)}`,
      fileUploadButton: `0 10px 24px ${alpha(surfaceShadowColor, darkTheme ? 0.8 : 0.18)}`,
    },
    borders: {
      subtle: colors.border,
      strong: alpha(colors.foreground, darkTheme ? 0.16 : 0.12),
      focus: colors.ring,
    },
    dimensions: {
      checkboxSize: '2rem',
      checkboxIconSize: '1.375rem',
      checkboxGap: '1rem',
      floatingRadius: '0.25rem',
      loaderSize: '4.375rem',
      inlineLoaderSize: '2rem',
      fileUploadGlowInset: '-4px',
      fileUploadMinHeight: '228px',
      fileUploadWidth: '368px',
      fileUploadIconSize: '4rem',
      fileUploadButtonHeight: '42px',
      fileUploadButtonPaddingX: '1.75rem',
      fileUploadHeadingSize: '2rem',
      modalMaxWidth: '44rem',
      modalGutter: '1.875rem',
      modalPadding: '2rem',
      modalMobilePadding: '1.5rem 1.25rem 2.5rem',
      modalSectionGap: '1rem',
    },
  };
};
