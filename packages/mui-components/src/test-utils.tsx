import { ThemeProvider, createTheme } from '@mui/material';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import React from 'react';

const theme = createTheme({});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const customRender: (ui: ReactElement, options?: Omit<RenderOptions, 'queries'>) => RenderResult = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
