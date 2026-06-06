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

const resolveVariantProps = (props: unknown): Record<string, unknown> => {
  if (typeof props === 'function') {
    return {};
  }

  return (props ?? {}) as Record<string, unknown>;
};

const resolveButtonVariantStyle = (theme: Theme, props: Record<string, unknown>) => {
  const variant = theme.components?.MuiButton?.variants?.find((candidate) =>
    Object.entries(props).every(([propName, propValue]) => resolveVariantProps(candidate.props)[propName] === propValue)
  );

  expect(variant).toBeDefined();

  return resolveStyleOverride(variant?.style ?? {}, theme) as Record<string, any>;
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
    const outlinedInputStyles = resolveStyleOverride(
      lightTheme.components?.MuiOutlinedInput?.styleOverrides?.root ?? {},
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
    const chipStyles = resolveStyleOverride(
      lightTheme.components?.MuiChip?.styleOverrides?.root ?? {},
      lightTheme
    ) as Record<string, any>;

    expect(checkboxStyles['&.Mui-checked'].color).toBe(lightTheme.palette.text.primary);
    expect(inputBaseStyles['& .MuiOutlinedInput-notchedOutline'].border).toBe('none');
    expect(outlinedInputStyles['&:hover'].backgroundColor).toBe(lightTheme.designTokens.stateLayers.interactiveSurface);
    expect(buttonBaseStyles['&.MuiPaginationItem-root']['&:hover'].backgroundColor).toBe(
      `${lightTheme.designTokens.stateLayers.interactiveHover}!important`
    );
    expect(listItemStyles.color).toBe(lightTheme.palette.text.primary);
    expect(chipStyles.color).toBe(lightTheme.palette.text.primary);
  });

  it('reuses shared elevation and backdrop tokens in floating surfaces', () => {
    const darkTheme = createDefaultTheme({ darkTheme: true });

    const cardStyles = resolveStyleOverride(
      darkTheme.components?.MuiCard?.styleOverrides?.root ?? {},
      darkTheme
    ) as Record<string, any>;
    const autocompletePopperStyles = resolveStyleOverride(
      darkTheme.components?.MuiAutocomplete?.styleOverrides?.popper ?? {},
      darkTheme
    ) as Record<string, any>;
    const backdropStyles = resolveStyleOverride(
      darkTheme.components?.MuiBackdrop?.styleOverrides?.root ?? {},
      darkTheme
    ) as Record<string, any>;
    const modalStyles = resolveStyleOverride(
      darkTheme.components?.MuiModal?.styleOverrides?.root ?? {},
      darkTheme
    ) as Record<string, any>;

    expect(cardStyles.boxShadow).toBe(darkTheme.designTokens.elevation.card);
    expect(autocompletePopperStyles.boxShadow).toBe(darkTheme.designTokens.elevation.popover);
    expect(backdropStyles.backgroundColor).toBe(darkTheme.designTokens.stateLayers.backdrop);
    expect(modalStyles['& .MuiModal-root .MuiBackdrop-root'].backgroundColor).toBe(
      darkTheme.designTokens.stateLayers.backdrop
    );
  });

  it('scopes button variants and keeps hover states close to their base colors', () => {
    const lightTheme = createDefaultTheme({ darkTheme: false });
    const darkTheme = createDefaultTheme({ darkTheme: true });

    const broadPrimaryVariant = lightTheme.components?.MuiButton?.variants?.find(
      (variant) =>
        resolveVariantProps(variant.props).color === 'primary' && resolveVariantProps(variant.props).variant == null
    );
    const lightPrimaryContained = resolveButtonVariantStyle(lightTheme, { color: 'primary', variant: 'contained' });
    const darkPrimaryContained = resolveButtonVariantStyle(darkTheme, { color: 'primary', variant: 'contained' });
    const secondaryOutlined = resolveButtonVariantStyle(lightTheme, { color: 'secondary', variant: 'outlined' });
    const secondaryText = resolveButtonVariantStyle(lightTheme, { color: 'secondary', variant: 'text' });

    expect(broadPrimaryVariant).toBeUndefined();
    expect(lightPrimaryContained['&:hover'].backgroundColor).not.toBe(lightPrimaryContained.backgroundColor);
    expect(darkPrimaryContained['&:hover'].backgroundColor).not.toBe(darkPrimaryContained.backgroundColor);
    expect(secondaryOutlined['&:hover'].backgroundColor).not.toBe(lightTheme.palette.secondary.main);
    expect(secondaryOutlined['&:hover'].color).toBe(lightTheme.palette.text.primary);
    expect(secondaryText['&:hover'].backgroundColor).not.toBe(lightTheme.palette.secondary.main);
    expect(secondaryText['&:hover'].color).toBe(lightTheme.palette.text.primary);
  });

  it('keeps outlined input borders visible through interactive states', () => {
    const lightTheme = createDefaultTheme({ darkTheme: false });

    const outlinedInputStyles = resolveStyleOverride(
      lightTheme.components?.MuiOutlinedInput?.styleOverrides?.root ?? {},
      lightTheme
    ) as Record<string, any>;

    expect(outlinedInputStyles.border).toBe(`1px solid ${lightTheme.palette.divider}`);
    expect(outlinedInputStyles.backgroundColor).toBe(lightTheme.palette.background.default);
    expect(outlinedInputStyles['&:hover'].borderColor).toBe(lightTheme.designTokens.borders.focus);
    expect(outlinedInputStyles['&.Mui-focused'].borderColor).toBe(lightTheme.designTokens.borders.focus);
    expect(outlinedInputStyles['&.Mui-focused'].boxShadow).toContain('rgba(181, 181, 181');
    expect(outlinedInputStyles['&.Mui-error'].borderColor).toBe(lightTheme.palette.error.main);
    expect(outlinedInputStyles['&.Mui-disabled'].backgroundColor).toBe(lightTheme.palette.action.disabledBackground);
    expect(outlinedInputStyles['& .MuiOutlinedInput-notchedOutline'].border).toBe('none');
  });
});
