import { PropsWithChildren, useCallback } from 'react';
import { useAuth } from 'react-oidc-context';
import { useLocation } from 'react-router-dom';
import { useLatest } from 'react-use';
import { LoginOptions, OidcSchemeData, UserLoginState } from './types';
import { OidcResetPasswordPage } from './OidcResetPasswordPage';
import { OidcAuthenticationStatusPage } from './OidcAuthenticationPage';
import { AuthorisationContextProvider } from './AuthorisationContextProvider';
import { OidcErrorPage } from './OidcErrorPage';

export type OidcAuthorisationContextProviderProps = {
  /**
   * Optional callback to invoke before login commences. Returning `false` will prevent login.
   */
  onLoggingIn?: (options?: LoginOptions) => void | boolean | Promise<void | boolean>;

  /**
   * Optional callback to invoke before logout commences. Returning `false` will prevent logout.
   */
  onLoggingOut?: () => void | boolean | Promise<void | boolean>;

  /**
   * Optional callback to invoke the password reset flow.
   */
  onPasswordReset?: (email: string) => void | boolean | Promise<void | boolean>;
};

const useLoginHandler = (onLoggingIn: OidcAuthorisationContextProviderProps['onLoggingIn']) => {
  const { pathname } = useLocation();

  // We don't want to rebuild the callback each time the pathname changes, we just want to get the
  // latest value at the time of the redirect.
  const pathnameRef = useLatest(pathname);

  // This is stable, as it's basically the `signInRedirect` method from the `UserManager` class.
  const { signinRedirect } = useAuth();

  // onLoggingIn may not be stable
  const onLoggingInRef = useLatest(onLoggingIn);

  return useCallback(
    async (options: LoginOptions = {}) => {
      try {
        const cancelLogin = onLoggingInRef.current != null && (await onLoggingInRef.current(options)) === false;
        if (cancelLogin) {
          console.warn('Login was cancelled');
          return;
        }
      } catch (err) {
        console.log('Error executing onLoggingIn', { err });
        return;
      }

      const userLoginState: UserLoginState = {
        postLoginUrl: options.postLoginUrl ?? pathnameRef.current,
      };

      await signinRedirect({
        state: userLoginState,
      });
    },
    [signinRedirect, pathnameRef, onLoggingInRef]
  );
};

const useLogoutHandler = (onLoggingOut: OidcAuthorisationContextProviderProps['onLoggingOut']) => {
  // As in useLoginHandler; this is stable...
  const { signoutRedirect } = useAuth();

  // ...but this might not be.
  const onLoggingOutRef = useLatest(onLoggingOut);

  return useCallback(async () => {
    const cancelLogout = (await onLoggingOutRef.current?.()) === false;
    if (cancelLogout) {
      console.warn('Logout was cancelled');
      return;
    }

    await signoutRedirect();
  }, [signoutRedirect, onLoggingOutRef]);
};

/**
 * Provides the bridge between the OIDC package and our internal AuthorisationContextProvider.
 */
export const OidcAuthorisationContextProvider = ({
  onLoggingIn,
  onLoggingOut,
  onPasswordReset,
  children,
}: PropsWithChildren<OidcAuthorisationContextProviderProps>) => {
  // https://authts.github.io/oidc-client-ts/classes/UserManager.html
  const { isLoading, isAuthenticated, user: oidcUser, error, clearStaleState, removeUser, signinSilent } = useAuth();

  const handleLogin = useLoginHandler(onLoggingIn);
  const handleLogout = useLogoutHandler(onLoggingOut);

  const onRefresh = async () => {
    // Try to refresh the user using a refresh token rather than forcing a sign out/in.
    if (oidcUser?.refresh_token) {
      const refreshedUser = await signinSilent();
      if (refreshedUser) return true;
    }

    try {
      await clearStaleState();
      await removeUser();
    } catch (error) {
      console.warn('Could not clear user state', error);
    }

    return false;
  };

  const onSoftLogout = async () => {
    await clearStaleState();

    // Ideally we would use `removeUser` but that forces an unload event which immediately renews the user token.
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith('oidc'))
      .forEach((key) => sessionStorage.removeItem(key));
  };

  const onDismissError = async () => {
    await removeUser();
    await handleLogin();
  };

  const handlePasswordReset = async (email: string) => {
    await removeUser();

    await onPasswordReset?.(email);
  };

  // expires_at comes back in seconds, so we need to convert to millis
  const tokenExpiry = oidcUser?.expires_at ? oidcUser!.expires_at! * 1000 : undefined;

  // when the oidc response is expired, a user is redirect to /expired
  const isExpired = Boolean(window.location.href.includes('expired'));

  return (
    <>
      {isLoading && <OidcAuthenticationStatusPage status="Contacting login provider, please wait..." />}
      {error && isExpired && <OidcResetPasswordPage error={error} onPasswordReset={handlePasswordReset} />}
      {error && !isExpired && <OidcErrorPage error={error} onContinue={onDismissError} />}

      {!(isLoading || error) && (
        <AuthorisationContextProvider<OidcSchemeData>
          onLogin={handleLogin}
          onLogout={handleLogout}
          isAuthenticated={isAuthenticated}
          token={oidcUser?.access_token}
          tokenExpiry={tokenExpiry}
          refreshToken={oidcUser?.refresh_token}
          schemeData={{
            onRefresh,
            onSoftLogout,
          }}
        >
          {children}
        </AuthorisationContextProvider>
      )}
    </>
  );
};
