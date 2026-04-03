import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authState } = vi.hoisted(() => ({
  authState: {
    isLoading: false,
    user: undefined as Record<string, unknown> | undefined,
  },
}));

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

import { OidcLogoutCallback } from '../src/OidcLogoutCallback';

const renderCallback = () =>
  render(
    <MemoryRouter initialEntries={['/oidc/logout']}>
      <Routes>
        <Route path="/oidc/logout" element={<OidcLogoutCallback />} />
        <Route path="/" element={<div>Home route</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('OidcLogoutCallback', () => {
  beforeEach(() => {
    authState.isLoading = false;
    authState.user = undefined;
  });

  it('navigates to the home route after a successful logout callback', async () => {
    renderCallback();

    expect(await screen.findByText('Home route')).toBeInTheDocument();
  });

  it('keeps the user on the error screen when the OIDC store still contains a user', () => {
    authState.user = {
      sub: '123',
    };

    renderCallback();

    expect(screen.getByText('Logout failed')).toBeInTheDocument();
    expect(screen.getByText('We could not finalise your logout. Please close your browser window to finalise logout')).toBeInTheDocument();
    expect(screen.queryByText('Home route')).not.toBeInTheDocument();
  });
});
