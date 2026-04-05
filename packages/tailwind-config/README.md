# @batoanng/tailwind-config

[![npm version](https://img.shields.io/npm/v/@batoanng/tailwind-config)](https://www.npmjs.com/package/@batoanng/tailwind-config)
[![install size](https://packagephobia.com/badge?p=@batoanng/tailwind-config)](https://packagephobia.com/result?p=@batoanng/tailwind-config)

A shareable Tailwind CSS v4 theme package built around a CSS-first workflow.
Import the shared stylesheet to pick up fonts, colors, spacing, shadows, and
utility extensions without maintaining a local `tailwind.config.js`.

## Installation

```bash
npm install -D tailwindcss @batoanng/tailwind-config

## CSS-first usage

```css
@import "tailwindcss";
@import "@batoanng/tailwind-config/styles.css";
```

## Compatibility note

The package root still exports a small JavaScript config object for older
consumers, but new apps should prefer the CSS import flow above.
