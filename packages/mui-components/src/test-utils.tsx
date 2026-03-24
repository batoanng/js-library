import { ThemeProvider, type Theme } from '@mui/material';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import { render as rtlRender } from '@testing-library/react';
import type { ReactElement } from 'react';
import React from 'react';

import { createDefaultTheme } from '@/theme';

type ThemeMode = 'dark' | 'light';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: Theme;
  mode?: ThemeMode;
}

export const createTestTheme = (mode: ThemeMode = 'dark') => createDefaultTheme({ darkTheme: mode === 'dark' });

const customRender: (ui: ReactElement, options?: CustomRenderOptions) => RenderResult = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { theme, mode = 'dark', ...renderOptions } = options;
  const resolvedTheme = theme ?? createTestTheme(mode);

  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return <ThemeProvider theme={resolvedTheme}>{children}</ThemeProvider>;
  };

  return rtlRender(ui, { wrapper: AllTheProviders, ...renderOptions });
};

export * from '@testing-library/react';
export { customRender as render };
