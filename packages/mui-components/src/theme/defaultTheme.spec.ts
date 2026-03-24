import type { Theme } from '@mui/material/styles';

import { createDefaultTheme } from './defaultTheme';

const resolveStyleOverride = <TStyle>(
  styleOverride: TStyle | ((input: { theme: Theme }) => TStyle),
  theme: Theme
): TStyle => {
  if (typeof styleOverride === 'function') {
    return (styleOverride as (input: { theme: Theme }) => TStyle)({ theme });
  }

  return styleOverride;
};

describe('defaultTheme', () => {
  it('adds shared design tokens for both color modes', () => {
    const lightTheme = createDefaultTheme({ darkTheme: false });
    const darkTheme = createDefaultTheme({ darkTheme: true });

    expect(lightTheme.designTokens.borders.strong).not.toBe(darkTheme.designTokens.borders.strong);
    expect(lightTheme.designTokens.elevation.card).not.toBe(darkTheme.designTokens.elevation.card);
    expect(lightTheme.designTokens.stateLayers.interactiveSurface).not.toContain('255, 255, 255');
  });

  it('uses theme-safe checkbox, input, and list item colors in light mode', () => {
    const lightTheme = createDefaultTheme({ darkTheme: false });

    const checkboxStyles = resolveStyleOverride(
      lightTheme.components?.MuiCheckbox?.styleOverrides?.root ?? {},
      lightTheme
    ) as Record<string, any>;
    const inputBaseStyles = resolveStyleOverride(
      lightTheme.components?.MuiInputBase?.styleOverrides?.root ?? {},
      lightTheme
    ) as Record<string, any>;
    const buttonBaseStyles = resolveStyleOverride(
      lightTheme.components?.MuiButtonBase?.styleOverrides?.root ?? {},
      lightTheme
    ) as Record<string, any>;
    const listItemStyles = resolveStyleOverride(
      lightTheme.components?.MuiListItem?.styleOverrides?.root ?? {},
      lightTheme
    ) as Record<string, any>;
    const chipStyles = resolveStyleOverride(lightTheme.components?.MuiChip?.styleOverrides?.root ?? {}, lightTheme) as Record<
      string,
      any
    >;

    expect(checkboxStyles['&.Mui-checked'].color).toBe(lightTheme.palette.text.primary);
    expect(inputBaseStyles['&:hover'].background).toBe(lightTheme.designTokens.stateLayers.interactiveSurface);
    expect(buttonBaseStyles['&.MuiPaginationItem-root']['&:hover'].backgroundColor).toBe(
      `${lightTheme.designTokens.stateLayers.interactiveHover}!important`
    );
    expect(listItemStyles.color).toBe(lightTheme.palette.text.primary);
    expect(chipStyles.color).toBe(lightTheme.palette.text.primary);
  });

  it('reuses shared elevation and backdrop tokens in floating surfaces', () => {
    const darkTheme = createDefaultTheme({ darkTheme: true });

    const cardStyles = resolveStyleOverride(darkTheme.components?.MuiCard?.styleOverrides?.root ?? {}, darkTheme) as Record<
      string,
      any
    >;
    const autocompletePopperStyles = resolveStyleOverride(
      darkTheme.components?.MuiAutocomplete?.styleOverrides?.popper ?? {},
      darkTheme
    ) as Record<string, any>;
    const backdropStyles = resolveStyleOverride(
      darkTheme.components?.MuiBackdrop?.styleOverrides?.root ?? {},
      darkTheme
    ) as Record<string, any>;
    const modalStyles = resolveStyleOverride(darkTheme.components?.MuiModal?.styleOverrides?.root ?? {}, darkTheme) as Record<
      string,
      any
    >;

    expect(cardStyles.boxShadow).toBe(darkTheme.designTokens.elevation.card);
    expect(autocompletePopperStyles.boxShadow).toBe(darkTheme.designTokens.elevation.popover);
    expect(backdropStyles.backgroundColor).toBe(darkTheme.designTokens.stateLayers.backdrop);
    expect(modalStyles['& .MuiModal-root .MuiBackdrop-root'].backgroundColor).toBe(darkTheme.designTokens.stateLayers.backdrop);
  });
});
