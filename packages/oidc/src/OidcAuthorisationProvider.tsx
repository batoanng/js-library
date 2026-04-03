import { UserManagerSettings } from 'oidc-client-ts';
import { PropsWithChildren } from 'react';
import { AuthProvider } from 'react-oidc-context';
import { Route, Routes, useInRouterContext } from 'react-router-dom';
import {
  OidcAuthorisationContextProvider,
  OidcAuthorisationContextProviderProps,
} from './OidcAuthorisationContextProvider';
import {
  DEFAULT_LOGIN_CALLBACK_RELATIVE_URL,
  DEFAULT_LOGOUT_CALLBACK_RELATIVE_URL,
  OIDC_PROVIDER_ROUTER_ERROR,
} from './constants';
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

const resolveCallbackRelativeUrl = (
  callbackRelativeUrl: string | undefined,
  configuredUrl: string | undefined,
  fallbackUrl: string
) => {
  if (callbackRelativeUrl) {
    return callbackRelativeUrl;
  }

  if (!configuredUrl) {
    return fallbackUrl;
  }

  try {
    return new URL(configuredUrl, 'http://localhost').pathname || fallbackUrl;
  } catch {
    return fallbackUrl;
  }
};

/**
 * Host for the OIDC provider and authorisation routes
 */
export const OidcAuthorisationProvider = ({
  userManagerSettings,
  loginCallbackRelativeUrl,
  logoutCallbackRelativeUrl,
  ...props
}: PropsWithChildren<OidcAuthorisationProviderProps>) => {
  const isInRouterContext = useInRouterContext();

  if (!isInRouterContext) {
    throw new Error(OIDC_PROVIDER_ROUTER_ERROR);
  }

  const resolvedLoginCallbackRelativeUrl = resolveCallbackRelativeUrl(
    loginCallbackRelativeUrl,
    userManagerSettings.redirect_uri,
    DEFAULT_LOGIN_CALLBACK_RELATIVE_URL
  );
  const resolvedLogoutCallbackRelativeUrl = resolveCallbackRelativeUrl(
    logoutCallbackRelativeUrl,
    userManagerSettings.post_logout_redirect_uri,
    DEFAULT_LOGOUT_CALLBACK_RELATIVE_URL
  );

  return (
    <AuthProvider {...DEFAULT_SETTINGS} {...userManagerSettings}>
      <Routes>
        <Route path={resolvedLoginCallbackRelativeUrl} element={<OidcLoginCallback />} />
        <Route path={resolvedLogoutCallbackRelativeUrl} element={<OidcLogoutCallback />} />
        <Route path="*" element={<OidcAuthorisationContextProvider {...props} />} />
      </Routes>
    </AuthProvider>
  );
};
