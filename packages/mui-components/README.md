# @batoanng/mui-components

[![npm version](https://img.shields.io/npm/v/@batoanng/mui-components)](https://www.npmjs.com/package/@batoanng/mui-components)
[![install size](https://packagephobia.com/badge?p=@batoanng/mui-components)](https://packagephobia.com/result?p=@batoanng/mui-components)
[![Storybook](https://img.shields.io/badge/storybook-online-blueviolet)](https://mui-components-batoanng.vercel.app/)

A fully typed, themeable, and accessible component library built with **React**, **TypeScript**, and **Material UI (MUI)**. It follows atomic design principles and ships with a complete theming system, hooks, test utilities, and form support to accelerate UI development across multiple projects.

---

## ✨ Features

- Built on [MUI v5](https://mui.com/)
- Organized by Atomic Design (Atoms, Molecules, Forms)
- Theming support (Light/Dark mode, tokenized palette, typography)
- Custom hooks and utilities
- Ready-to-use with `ThemeProvider` and `CssBaseline`
- Developer tooling: Storybook, Vitest, ESLint, Prettier
- Published on npm and deployed Storybook: [mui-components-batoanng.vercel.app](https://mui-components-batoanng.vercel.app/)

---

## 📦 Installation

```bash
pnpm add @batoanng/mui-components
```

You must also install peer dependencies if not already present:

```bash
pnpm add @mui/material @mui/icons-material @emotion/react @emotion/styled
```

---

## 🚀 Quick Start

Wrap your application with the theme provider:

```tsx
import { CssBaseline, ThemeProvider } from '@mui/material';
import { defaultTheme } from '@batoanng/mui-components';

export default function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      {/* Your app components */}
    </ThemeProvider>
  );
}
```

Use components:

```tsx
import { Button } from '@batoanng/mui-components';

<Button variant="contained">Click me</Button>
```

---

## 🧩 Components Structure

```
src/
├── components/
│   ├── atoms/           # Base building blocks (e.g., Button, Label)
│   ├── molecules/       # Compound components (e.g., IdleTimer)
│   ├── form/            # Input controls and validation-aware forms (integrated with react-hook-form)
│   └── index.ts         # Entry point for all component exports
```

All components are re-exported via `@batoanng/mui-components`:

```tsx
import { FormTextField } from '@batoanng/mui-components';
```

---

## 🎨 Theming System

Located in `src/theme/`, it includes:

- Light and Dark theme create function
- Custom spacing, radii, shadows, typography
- Color palette consistent with brand/UI tokens

Usage:

```tsx
import { defaultTheme, createDefaultTheme } from '@batoanng/mui-components';

const lightTheme = createDefaultTheme(); // Light theme is default
const darkTheme = createDefaultTheme(true);

<ThemeProvider theme={lightTheme}>...</ThemeProvider>
<ThemeProvider theme={darkTheme}>...</ThemeProvider>
```

---

## 🧰 Development

Common commands:

```bash
pnpm dev             # Start Storybook
pnpm test            # Run unit tests with Vitest
pnpm lint            # Run ESLint
pnpm format          # Format with Prettier
pnpm build           # Build library output
```

---

## 📖 Storybook

View the full component library online:

👉 [https://mui-components-batoanng.vercel.app/](https://mui-components-batoanng.vercel.app/)

To run locally:

```bash
pnpm dev
```
