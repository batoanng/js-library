import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authProviderSpy } = vi.hoisted(() => ({
  authProviderSpy: vi.fn(),
}));

vi.mock('react-oidc-context', () => ({
  AuthProvider: ({ children, ...props }: any) => {
    authProviderSpy(props);
    return <>{children}</>;
  },
}));

vi.mock('../src/OidcLoginCallback', () => ({
  OidcLoginCallback: () => <div>Login callback route</div>,
}));

vi.mock('../src/OidcLogoutCallback', () => ({
  OidcLogoutCallback: () => <div>Logout callback route</div>,
}));

vi.mock('../src/OidcAuthorisationContextProvider', () => ({
  OidcAuthorisationContextProvider: () => <div>Authorisation context route</div>,
}));

import { OIDC_PROVIDER_ROUTER_ERROR } from '../src/constants';
import { OidcAuthorisationProvider } from '../src/OidcAuthorisationProvider';

const userManagerSettings = {
  authority: 'https://idp.example.com',
  client_id: 'web-app',
  redirect_uri: 'http://localhost/auth/callback',
  post_logout_redirect_uri: 'http://localhost/auth/logout',
};

describe('OidcAuthorisationProvider', () => {
  beforeEach(() => {
    authProviderSpy.mockClear();
  });

  it('throws a clear error when rendered outside a router', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() =>
      render(
        <OidcAuthorisationProvider userManagerSettings={userManagerSettings}>
          <div>App</div>
        </OidcAuthorisationProvider>
      )
    ).toThrow(OIDC_PROVIDER_ROUTER_ERROR);

    consoleErrorSpy.mockRestore();
  });

  it('uses the configured redirect URI path for the login callback route', () => {
    render(
      <MemoryRouter initialEntries={['/auth/callback']}>
        <OidcAuthorisationProvider userManagerSettings={userManagerSettings}>
          <div>App</div>
        </OidcAuthorisationProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Login callback route')).toBeInTheDocument();
    expect(authProviderSpy).toHaveBeenCalledWith(expect.objectContaining(userManagerSettings));
  });

  it('allows the logout callback route to be overridden explicitly', () => {
    render(
      <MemoryRouter initialEntries={['/custom/logout']}>
        <OidcAuthorisationProvider
          userManagerSettings={userManagerSettings}
          logoutCallbackRelativeUrl="/custom/logout"
        >
          <div>App</div>
        </OidcAuthorisationProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Logout callback route')).toBeInTheDocument();
  });

  it('renders the authorisation context on non-callback routes', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <OidcAuthorisationProvider userManagerSettings={userManagerSettings}>
          <div>App</div>
        </OidcAuthorisationProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Authorisation context route')).toBeInTheDocument();
  });
});
