import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  authState,
  clearStaleStateMock,
  removeUserMock,
  signinRedirectMock,
  signoutRedirectMock,
  signinSilentMock,
} = vi.hoisted(() => {
  const clearStaleState = vi.fn();
  const removeUser = vi.fn();
  const signinRedirect = vi.fn();
  const signoutRedirect = vi.fn();
  const signinSilent = vi.fn();

  return {
    authState: {
      isLoading: false,
      isAuthenticated: true,
      user: undefined as
        | {
            access_token?: string;
            expires_at?: number;
            refresh_token?: string;
          }
        | undefined,
      error: undefined as Error | undefined,
      clearStaleState,
      removeUser,
      signinRedirect,
      signoutRedirect,
      signinSilent,
    },
    clearStaleStateMock: clearStaleState,
    removeUserMock: removeUser,
    signinRedirectMock: signinRedirect,
    signoutRedirectMock: signoutRedirect,
    signinSilentMock: signinSilent,
  };
});

vi.mock('react-oidc-context', () => ({
  useAuth: () => authState,
}));

vi.mock('../src/OidcAuthenticationStatusPage', () => ({
  OidcAuthenticationStatusPage: ({ heading, status }: any) => (
    <div>
      {heading ? <div>{heading}</div> : null}
      <div>{typeof status === 'string' ? status : 'status-node'}</div>
    </div>
  ),
}));

vi.mock('../src/OidcResetPasswordPage', () => ({
  OidcResetPasswordPage: ({ onPasswordReset }: any) => (
    <button onClick={() => void onPasswordReset?.('reset@example.com')}>Reset password page</button>
  ),
}));

vi.mock('../src/OidcErrorPage', () => ({
  OidcErrorPage: ({ onContinue }: any) => <button onClick={() => void onContinue?.()}>Error page</button>,
}));

import { useOidcAuthorisationContext } from '../src/hooks';
import { OidcAuthorisationContextProvider } from '../src/OidcAuthorisationContextProvider';

const ContextConsumer = () => {
  const { isAuthenticated, onLogin, onLogout, onRefresh, onSoftLogout, token, tokenExpiry } =
    useOidcAuthorisationContext();
  const [refreshResult, setRefreshResult] = useState('');

  return (
    <>
      <div>{`authenticated:${String(isAuthenticated)}`}</div>
      <div>{`token:${token}`}</div>
      <div>{`tokenExpiry:${String(tokenExpiry)}`}</div>
      <div>{`refreshResult:${refreshResult}`}</div>
      <button onClick={() => void onLogin()}>Login</button>
      <button onClick={() => void onLogout()}>Logout</button>
      <button onClick={() => void onRefresh().then((result) => setRefreshResult(String(result)))}>Refresh</button>
      <button onClick={() => void onSoftLogout()}>Soft logout</button>
    </>
  );
};

const renderProvider = (initialEntry = '/dashboard', props?: Parameters<typeof OidcAuthorisationContextProvider>[0]) =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <OidcAuthorisationContextProvider {...props}>
        <ContextConsumer />
      </OidcAuthorisationContextProvider>
    </MemoryRouter>
  );

describe('OidcAuthorisationContextProvider', () => {
  beforeEach(() => {
    clearStaleStateMock.mockReset();
    clearStaleStateMock.mockResolvedValue(undefined);
    removeUserMock.mockReset();
    removeUserMock.mockResolvedValue(undefined);
    signinRedirectMock.mockReset();
    signinRedirectMock.mockResolvedValue(undefined);
    signoutRedirectMock.mockReset();
    signoutRedirectMock.mockResolvedValue(undefined);
    signinSilentMock.mockReset();
    signinSilentMock.mockResolvedValue({ access_token: 'refreshed-token' });

    authState.isLoading = false;
    authState.isAuthenticated = true;
    authState.user = {
      access_token: 'token-123',
      expires_at: 12,
      refresh_token: 'refresh-token',
    };
    authState.error = undefined;

    sessionStorage.clear();
  });

  it('renders the loading status while OIDC is still resolving', () => {
    authState.isLoading = true;

    renderProvider();

    expect(screen.getByText('Contacting login provider, please wait...')).toBeInTheDocument();
  });

  it('routes expired-password errors through the reset flow', async () => {
    const onPasswordReset = vi.fn();
    authState.isAuthenticated = false;
    authState.user = undefined;
    authState.error = new Error('Password expired');

    renderProvider('/expired', { onPasswordReset });

    fireEvent.click(screen.getByRole('button', { name: 'Reset password page' }));

    await waitFor(() => expect(removeUserMock).toHaveBeenCalledTimes(1));
    expect(onPasswordReset).toHaveBeenCalledWith('reset@example.com');
  });

  it('uses the current path when retrying from a generic OIDC error', async () => {
    authState.isAuthenticated = false;
    authState.user = undefined;
    authState.error = new Error('Authentication failed');

    renderProvider('/dashboard');

    fireEvent.click(screen.getByRole('button', { name: 'Error page' }));

    await waitFor(() => expect(removeUserMock).toHaveBeenCalledTimes(1));
    expect(signinRedirectMock).toHaveBeenCalledWith({
      state: {
        postLoginUrl: '/dashboard',
      },
    });
  });

  it('wires the shared authorisation context for authenticated routes', async () => {
    sessionStorage.setItem('oidc.session', '1');
    sessionStorage.setItem('other.session', '1');

    renderProvider('/dashboard');

    expect(screen.getByText('authenticated:true')).toBeInTheDocument();
    expect(screen.getByText('token:token-123')).toBeInTheDocument();
    expect(screen.getByText('tokenExpiry:12000')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    expect(signinRedirectMock).toHaveBeenCalledWith({
      state: {
        postLoginUrl: '/dashboard',
      },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));
    await waitFor(() => expect(signoutRedirectMock).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(await screen.findByText('refreshResult:true')).toBeInTheDocument();
    expect(signinSilentMock).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Soft logout' }));
    await waitFor(() => expect(clearStaleStateMock).toHaveBeenCalledTimes(1));
    expect(sessionStorage.getItem('oidc.session')).toBeNull();
    expect(sessionStorage.getItem('other.session')).toBe('1');
  });
});
