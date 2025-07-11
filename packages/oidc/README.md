# @batoanng/oidc

[![npm version](https://img.shields.io/npm/v/@batoanng/oidc)](https://www.npmjs.com/package/@batoanng/oidc)
[![install size](https://packagephobia.com/badge?p=@batoanng/oidc)](https://packagephobia.com/result?p=@batoanng/oidc)

A React-based OIDC (OpenID Connect) wrapper built on top of [`oidc-client-ts`](https://github.com/authts/oidc-client-ts) and `react-oidc-context`, designed to streamline authentication flows in frontend applications.

It integrates with `react-router-dom`, uses shared utilities from [`@batoanng/utils`](https://www.npmjs.com/package/@batoanng/utils), and UI feedback from [`@batoanng/mui-components`](https://www.npmjs.com/package/@batoanng/mui-components).

---

## ✨ Features

- Plug-and-play OIDC integration for SPA
- Login + logout + context + callback flows
- Built with [`react-oidc-context`](https://github.com/authts/react-oidc-context)
- Uses `react-router-dom`'s `<Routes>` and `<Route>`
- Uses custom modals and loaders from `@batoanng/mui-components`
- Exposes a shared authorisation context
- Includes default login/logout callback URLs

---

## 🚪 Main Entry Point

```tsx
import { OidcAuthorisationProvider } from '@batoanng/oidc';
```

This component wraps your app's authentication logic and injects routes for login/logout handling.

```tsx
<OidcAuthorisationProvider
  userManagerSettings={{
    authority: 'https://your-idp.com',
    client_id: 'your-client-id',
    redirect_uri: 'http://localhost:3000/oidc/callback',
    post_logout_redirect_uri: 'http://localhost:3000/oidc/logout',
  }}
>
  <App />
</OidcAuthorisationProvider>
```

---

## ⚙️ Props

```ts
interface OidcAuthorisationProviderProps {
  userManagerSettings: UserManagerSettings;
  loginCallbackRelativeUrl?: string; // default: '/oidc/callback'
  logoutCallbackRelativeUrl?: string; // default: '/oidc/logout'
}
```

> All other props are passed to `OidcAuthorisationContextProvider`.

---

## 🌐 Default Routes

| Route | Purpose |
|-------|---------|
| `/oidc/callback` | Handles login redirect callback |
| `/oidc/logout`   | Handles logout redirect callback |

These routes are automatically injected into your router when using `OidcAuthorisationProvider`.

---

## 🧩 Internals

```
src/
├── OidcAuthorisationProvider.tsx         # Main entry point
├── OidcAuthorisationContextProvider.tsx  # Context provider
├── OidcLoginCallback.tsx                 # Handles redirect on login
├── OidcLogoutCallback.tsx                # Handles redirect on logout
├── OidcAuthenticationPage.tsx           # Optional login screen
├── OidcErrorPage.tsx                     # Optional error fallback
├── utils.ts / hooks.ts / types.ts        # Supporting logic
```

---

## 📦 Related Packages

- [`@batoanng/utils`](https://www.npmjs.com/package/@batoanng/utils) – for utilities like `useMount`
- [`@batoanng/mui-components`](https://www.npmjs.com/package/@batoanng/mui-components) – for modals, loaders, and UI elements
