import { UserManagerSettings } from 'oidc-client-ts';
import { PropsWithChildren } from 'react';
import { AuthProvider } from 'react-oidc-context';
import { Route, Routes, useInRouterContext } from 'react-router-dom';
import { useMount } from 'react-use';
import {
  OidcAuthorisationContextProvider,
  OidcAuthorisationContextProviderProps,
} from './OidcAuthorisationContextProvider';
import { OidcLoginCallback } from './OidcLoginCallback';
import { OidcLogoutCallback } from './OidcLogoutCallback';

interface OidcAuthorisationProviderProps extends OidcAuthorisationContextProviderProps {
  /**
   * Settings passed directly to the OIDC user manager. See: https://authts.github.io/oidc-client-ts/
   */
  userManagerSettings: UserManagerSettings;

  /**
   * Relative URL for the logout callback. This should be the relative equivalent of the `'redirect_uri'` as configured
   * with the IDP.
   *
   * If `undefined`, the URL will be determined based on the pathname as configured by `'redirect_uri'` if
   * defined, or `'/oidc/callback'` as a fallback.
   */
  loginCallbackRelativeUrl?: string;

  /**
   * Relative URL for the logout callback. This should be the relative equivalent of the `'post_logout_redirect_uri'`
   * as configured with the IDP.
   *
   * If `undefined`, the URL will be determined based on the pathname as configured by `'post_logout_redirect_uri'` if
   * defined, or `'/oidc/logout'` as a fallback.
   */
  logoutCallbackRelativeUrl?: string;
}

// Keeping this for now, will be either built upon or deleted once user management comes in
const DEFAULT_SETTINGS: Partial<UserManagerSettings> = {};

/**
 * Host for the OIDC provider and authorisation routes
 */
export const OidcAuthorisationProvider = ({
  userManagerSettings,
  loginCallbackRelativeUrl = '/oidc/callback',
  logoutCallbackRelativeUrl = '/oidc/logout',
  ...props
}: PropsWithChildren<OidcAuthorisationProviderProps>) => {
  const isInRouterContext = useInRouterContext();

  useMount(() => {
    if (!isInRouterContext) {
      console.error('The OIDC authorisation provider must be nested inside a Router Context');
    }
  });

  return (
    <AuthProvider {...DEFAULT_SETTINGS} {...userManagerSettings}>
      <Routes>
        <Route path={loginCallbackRelativeUrl} element={<OidcLoginCallback />} />
        <Route path={logoutCallbackRelativeUrl} element={<OidcLogoutCallback />} />
        <Route path="*" element={<OidcAuthorisationContextProvider {...props} />} />
      </Routes>
    </AuthProvider>
  );
};
