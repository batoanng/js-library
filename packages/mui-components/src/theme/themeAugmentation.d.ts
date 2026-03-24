import type { DesignTokens } from './designTokens';

declare module '@mui/material/styles' {
  interface Theme {
    designTokens: DesignTokens;
  }

  interface ThemeOptions {
    designTokens?: DesignTokens;
  }
}
