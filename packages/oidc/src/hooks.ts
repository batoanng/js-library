import { createContext, useContext } from 'react';
import { AuthorisationContextType, OidcSchemeData } from './types';
import { useAsync, useLatest } from 'react-use';

export const AuthorisationContext = createContext<AuthorisationContextType | null>(null);

/**
 * Provides access to the current authorisation context.
 */
export const useAuthorisationContext = <TSchemeData extends object = object>(): AuthorisationContextType &
  TSchemeData => {
  const { schemeData, ...context } = useContext(AuthorisationContext)!;

  return {
    ...context,
    ...(schemeData || {}),
  } as unknown as AuthorisationContextType & TSchemeData;
};

export const useOidcAuthorisationContext = () => useAuthorisationContext<OidcSchemeData>();

/**
 * Force login or token refresh if the user's OIDC token has expired, or the user isn't authenticated.
 */
export const useEnsureOidcLoginToken = () => {
  const { isAuthenticated, onLogin, onRefresh, token, tokenExpiry } = useOidcAuthorisationContext();
  const hasTokenExpired = Boolean(token && tokenExpiry) && tokenExpiry! < new Date().valueOf();

  const onLoginRef = useLatest(onLogin);
  const onRefreshRef = useLatest(onRefresh);

  useAsync(async () => {
    // The user has no token at all - force login
    if (!(token && isAuthenticated)) {
      onLoginRef.current();
      return;
    }

    // Attempt to refresh the token when it has expired
    if (hasTokenExpired) {
      await onRefreshRef.current();
    }
  }, [isAuthenticated, token, hasTokenExpired, onLoginRef, onRefreshRef]);
};
