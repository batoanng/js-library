import React from 'react';
import { CssBaseline, ThemeProvider as MUIThemeProvider } from '@mui/material';
import { Preview } from '@storybook/react-vite';
import isChromatic from 'chromatic/isChromatic';
import { createDefaultTheme } from '../src/theme/defaultTheme';

const lightTheme = createDefaultTheme({ darkTheme: false });
const darkTheme = createDefaultTheme({ darkTheme: true });

const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

const parameters = {
  options: {
    storySort: {
      order: ['Docs', 'Getting Started', 'Changelog', 'Components'],
    },
  },
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: lightTheme.palette.background.default },
      { name: 'dark', value: darkTheme.palette.background.default },
    ],
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const globalTypes = {
  theme: {
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      title: 'Theme',
      icon: 'document',
      items: ['light', 'dark'],
      dynamicTitle: true,
    },
  },
};

const decorators = [
  (Story, context) => {
    const activeTheme = themes[context.globals.theme as keyof typeof themes] ?? darkTheme;

    if (isChromatic()) {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
          {[
            ['Light', lightTheme],
            ['Dark', darkTheme],
          ].map(([label, theme]) => (
            <div
              key={label}
              style={{
                padding: '1rem',
                background: theme.palette.background.default,
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <div style={{ marginBottom: '0.75rem', fontWeight: 700 }}>{label}</div>
              <MUIThemeProvider theme={theme}>
                <CssBaseline />
                <Story />
              </MUIThemeProvider>
            </div>
          ))}
        </div>
      );
    }

    return (
      <MUIThemeProvider theme={activeTheme}>
        <CssBaseline />
        <Story />
      </MUIThemeProvider>
    );
  },
];

const preview: Preview = {
  globalTypes,
  decorators,
  parameters,
};

export default preview;
