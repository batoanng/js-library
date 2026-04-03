import axios, { AxiosHeaders } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { authState, clearStaleStateMock, signinSilentMock } = vi.hoisted(() => {
  const clearStaleState = vi.fn();
  const signinSilent = vi.fn();

  return {
    authState: {
      isAuthenticated: true,
      user: {
        access_token: 'token-123',
      } as { access_token?: string } | undefined,
      clearStaleState,
      signinSilent,
    },
    clearStaleStateMock: clearStaleState,
    signinSilentMock: signinSilent,
  };
});

vi.mock('react-oidc-context', () => ({
  useAuth: () => authState,
}));

vi.mock('../src/OidcAuthenticationStatusPage', () => ({
  OidcAuthenticationStatusPage: ({ status, onContinue }: any) => (
    <div>
      <div>{typeof status === 'string' ? status : 'status-node'}</div>
      {onContinue ? <button onClick={() => void onContinue()}>Continue</button> : null}
    </div>
  ),
}));

vi.mock('../src/OidcLoginError', () => ({
  OidcLoginError: ({ error }: { error: Error }) => <div>{error.message}</div>,
}));

import { AuthorisationContext } from '../src/hooks';
import { OidcAuthorisationCallback } from '../src/OidcAuthorisationCallback';
import type { UserInformation } from '../src/types';

const userInformation: UserInformation = {
  shortName: 'Test',
  fullName: 'Test User',
  email: 'test@example.com',
};

const privileges = {
  'activityLog.read': true,
} as const;

const readAuthorizationHeader = (headers: unknown) => AxiosHeaders.from(headers as any).get('Authorization');

const renderCallback = (
  ui: JSX.Element,
  overrides?: {
    onLogout?: ReturnType<typeof vi.fn>;
    updatePrivileges?: ReturnType<typeof vi.fn>;
    updateUserInformation?: ReturnType<typeof vi.fn>;
  }
) => {
  const updateUserInformation = overrides?.updateUserInformation ?? vi.fn();
  const updatePrivileges = overrides?.updatePrivileges ?? vi.fn();
  const onLogout = overrides?.onLogout ?? vi.fn();

  const view = render(
    <AuthorisationContext.Provider
      value={{
        isAuthenticated: true,
        onLogin: vi.fn(),
        onLogout,
        updateUserInformation,
        updatePrivileges,
      }}
    >
      {ui}
    </AuthorisationContext.Provider>
  );

  return {
    ...view,
    onLogout,
    updatePrivileges,
    updateUserInformation,
  };
};

describe('OidcAuthorisationCallback', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    clearStaleStateMock.mockReset();
    clearStaleStateMock.mockResolvedValue(undefined);
    signinSilentMock.mockReset();
    signinSilentMock.mockResolvedValue({
      access_token: 'refreshed-token',
    });

    authState.isAuthenticated = true;
    authState.user = {
      access_token: 'token-123',
    };
  });

  it('updates the shared context with user information and privileges', async () => {
    const { updateUserInformation, updatePrivileges } = renderCallback(
      <OidcAuthorisationCallback userInformation={userInformation} privileges={privileges}>
        <div>Ready</div>
      </OidcAuthorisationCallback>
    );

    await waitFor(() => expect(clearStaleStateMock).toHaveBeenCalledTimes(1));
    expect(updateUserInformation).toHaveBeenCalledWith(userInformation);
    expect(updatePrivileges).toHaveBeenCalledWith(privileges);
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('redirects to a string user-information target', async () => {
    const assignMock = vi.fn();
    vi.stubGlobal('location', {
      ...window.location,
      assign: assignMock,
    });

    renderCallback(
      <OidcAuthorisationCallback userInformation="https://example.com/profile" privileges={privileges}>
        <div>Ready</div>
      </OidcAuthorisationCallback>
    );

    await waitFor(() => expect(assignMock).toHaveBeenCalledWith('https://example.com/profile'));
    expect(screen.getByText('Redirecting, please wait...')).toBeInTheDocument();
  });

  it('injects and removes the Authorization header on the provided api client', async () => {
    const apiClient = axios.create();

    const view = renderCallback(
      <OidcAuthorisationCallback apiClient={apiClient} userInformation={userInformation} privileges={privileges}>
        <div>Ready</div>
      </OidcAuthorisationCallback>
    );

    await waitFor(() =>
      expect(readAuthorizationHeader(apiClient.defaults.headers.common)).toBe('Bearer token-123')
    );

    authState.user = undefined;
    view.rerender(
      <AuthorisationContext.Provider
        value={{
          isAuthenticated: true,
          onLogin: vi.fn(),
          onLogout: vi.fn(),
          updateUserInformation: vi.fn(),
          updatePrivileges: vi.fn(),
        }}
      >
        <OidcAuthorisationCallback apiClient={apiClient} userInformation={userInformation} privileges={privileges}>
          <div>Ready</div>
        </OidcAuthorisationCallback>
      </AuthorisationContext.Provider>
    );

    await waitFor(() => expect(readAuthorizationHeader(apiClient.defaults.headers.common)).toBeUndefined());
  });

  it('retries one unauthorized request after refreshing the token silently', async () => {
    const apiClient = axios.create();
    const mock = new MockAdapter(apiClient);

    mock.onGet('/secure').replyOnce(() => [401]);
    mock.onGet('/secure').replyOnce((config) => [200, { authorization: readAuthorizationHeader(config.headers) }]);

    renderCallback(
      <OidcAuthorisationCallback apiClient={apiClient} userInformation={userInformation} privileges={privileges}>
        <div>Ready</div>
      </OidcAuthorisationCallback>
    );

    await waitFor(() =>
      expect(readAuthorizationHeader(apiClient.defaults.headers.common)).toBe('Bearer token-123')
    );

    const response = await apiClient.get('/secure');

    expect(signinSilentMock).toHaveBeenCalledTimes(1);
    expect(response.data.authorization).toBe('Bearer refreshed-token');
    expect(readAuthorizationHeader(apiClient.defaults.headers.common)).toBe('Bearer refreshed-token');
  });

  it('does not retry the same unauthorized request more than once', async () => {
    const apiClient = axios.create();
    const mock = new MockAdapter(apiClient);

    mock.onGet('/secure').reply(401);

    renderCallback(
      <OidcAuthorisationCallback apiClient={apiClient} userInformation={userInformation} privileges={privileges}>
        <div>Ready</div>
      </OidcAuthorisationCallback>
    );

    await waitFor(() =>
      expect(readAuthorizationHeader(apiClient.defaults.headers.common)).toBe('Bearer token-123')
    );

    await expect(apiClient.get('/secure')).rejects.toMatchObject({
      response: {
        status: 401,
      },
    });
    expect(signinSilentMock).toHaveBeenCalledTimes(1);
  });
});
