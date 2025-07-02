import React from 'react';
import { CssBaseline, ThemeProvider as MUIThemeProvider } from '@mui/material';
import { Preview } from '@storybook/react-vite';
import isChromatic from 'chromatic/isChromatic';
import { defaultTheme } from '../src/theme/defaultTheme';

const parameters = {
  options: {
    storySort: {
      order: ['Docs', 'Getting Started', 'Changelog', 'Components'],
    },
  },
  backgrounds: {
    default: 'light',
    values: [{ name: 'light', value: '#FFFFFF' }],
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
    defaultValue: 'MUI',
    toolbar: {
      title: 'Theme',
      icon: 'document',
      items: ['MUI'],
      dynamicTitle: true,
    },
  },
};


const decorators = [
  (Story, context) => {
    if (isChromatic()) {
      return (
        <div style={{ display: 'flex' }}>
          <div
            style={{
              flex: 1,
              padding: '0 1rem',
              borderRight: '1px solid lightgrey',
            }}
          >
            <MUIThemeProvider theme={defaultTheme}>
              <Story />
            </MUIThemeProvider>
          </div>
          <div
            style={{
              flex: 1,
              padding: '0 1rem',
              borderRight: '1px solid lightgrey',
            }}
          >
            <MUIThemeProvider theme={defaultTheme}>
              <Story />
            </MUIThemeProvider>
          </div>
          <div style={{ flex: 1, padding: '0 1rem' }}>
            <MUIThemeProvider theme={defaultTheme}>
              <Story />
            </MUIThemeProvider>
          </div>
        </div>
      );
    }

    // Note - Keeping GEL theme for now until GEL3 is ready
    // const selectedTheme = context.globals.theme === 'GEL3' ? 'gel3Theme' : 'ddsTheme';
    const selectedTheme = (selectedTheme) => {
      switch (selectedTheme) {
        case 'Digital NSW':
          return 'ddsTheme';
          break;
        case 'GEL3':
          return 'gel3Theme';
          break;
        default:
          return 'gelTheme';
      }
    };

    return (
      <MUIThemeProvider theme={defaultTheme}>
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
