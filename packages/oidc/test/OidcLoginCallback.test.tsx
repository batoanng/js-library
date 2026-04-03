import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authState, clearStaleStateMock } = vi.hoisted(() => {
  const clearStaleState = vi.fn();

  return {
    authState: {
      isLoading: false,
      error: undefined as Error | undefined,
      user: {
        state: {
          postLoginUrl: '/done',
        },
      },
      clearStaleState,
    },
    clearStaleStateMock: clearStaleState,
  };
});

vi.mock('react-oidc-context', () => ({
  useAuth: () => authState,
}));

vi.mock('../src/OidcAuthenticationStatusPage', () => ({
  OidcAuthenticationStatusPage: ({ heading, status, onContinue }: any) => (
    <div>
      {heading ? <div>{heading}</div> : null}
      <div>{typeof status === 'string' ? status : 'status-node'}</div>
      {onContinue ? <button onClick={() => void onContinue()}>Continue</button> : null}
    </div>
  ),
}));

import { OidcLoginCallback } from '../src/OidcLoginCallback';

const renderCallback = (initialEntry: string) =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/oidc/callback" element={<OidcLoginCallback />} />
        <Route path="/expired" element={<div>Expired route</div>} />
        <Route path="/" element={<div>Home route</div>} />
        <Route path="/done" element={<div>Done route</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('OidcLoginCallback', () => {
  beforeEach(() => {
    clearStaleStateMock.mockReset();
    clearStaleStateMock.mockResolvedValue(undefined);

    authState.isLoading = false;
    authState.error = undefined;
    authState.user = {
      state: {
        postLoginUrl: '/done',
      },
    };
  });

  it('navigates to the post-login URL after a successful login callback', async () => {
    renderCallback('/oidc/callback');

    expect(await screen.findByText('Done route')).toBeInTheDocument();
  });

  it('redirects expired-password responses without falling through to the post-login route', async () => {
    renderCallback('/oidc/callback?error_description=Password%20expired');

    expect(await screen.findByText('Expired route')).toBeInTheDocument();
    expect(screen.queryByText('Done route')).not.toBeInTheDocument();
  });

  it('shows the generic login error UI and clears stale state before returning home', async () => {
    authState.error = new Error('Login failed');

    renderCallback('/oidc/callback?error_description=Unknown%20error');

    expect(screen.getByText('Login failed')).toBeInTheDocument();
    expect(screen.getByText('We could not log you in at this time.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => expect(clearStaleStateMock).toHaveBeenCalledTimes(1));
    expect(await screen.findByText('Home route')).toBeInTheDocument();
  });
});
