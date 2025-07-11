import { UserPrivileges, UserInformation } from './types';
import { AxiosError, AxiosInstance } from 'axios';
import { PropsWithChildren, useEffect, useLayoutEffect } from 'react';
import { AuthContextProps, useAuth } from 'react-oidc-context';
import { useMount } from 'react-use';
import { OidcAuthenticationStatusPage } from './OidcAuthenticationStatusPage';
import { OidcLoginError } from './OidcLoginError';
import { useOidcAuthorisationContext } from './hooks';
import { setBearerToken, setUnauthorizedRequestHandler } from './utils';

interface Props extends PropsWithChildren {
  /**
   * If provided, the API token will automatically be injected into this axios instance when it changes.
   */
  apiClient?: AxiosInstance;

  /**
   * The user information loaded after the OIDC auth completed, or a URL to redirect to.
   */
  userInformation?: UserInformation | string;

  /**
   * The user's privileges.
   */
  privileges?: UserPrivileges;

  /**
   * Any error that occurred from trying to load the user information or privileges.
   */
  error?: Error | null;

  /**
   * Authorisation scheme to use. Defaults to `Bearer`.
   */
  authScheme?: string;
}

const handleUnauthorizedRequest =
  (refreshAccessToken: AuthContextProps['signinSilent'], shouldRefresh: boolean) =>
  async (apiClient: AxiosInstance, error: AxiosError) => {
    if (shouldRefresh) {
      const refreshedUser = await refreshAccessToken();
      if (refreshedUser) {
        return await apiClient(error.config!);
      }
    }

    return error;
  };

/**
 * Callback component to handle loading of user information and privileges after the OIDC login has completed.
 */
export const OidcAuthorisationCallback = ({
  apiClient,
  userInformation,
  privileges,
  authScheme = 'Bearer',
  error,
  children,
}: Props) => {
  // Set the bearer token against the API.
  const { isAuthenticated, user, clearStaleState, signinSilent } = useAuth();
  const bearerToken = user?.access_token;
  const shouldRefreshToken = Boolean(user?.expired) && Boolean(user?.refresh_token);

  useLayoutEffect(() => {
    if (!apiClient) return;

    setBearerToken(apiClient, bearerToken ? [authScheme, bearerToken] : null);
    setUnauthorizedRequestHandler(apiClient, handleUnauthorizedRequest(signinSilent, shouldRefreshToken));
  }, [apiClient, bearerToken, shouldRefreshToken, signinSilent, authScheme]);

  const { updateUserInformation, updatePrivileges, onLogout } = useOidcAuthorisationContext();

  useMount(async () => {
    await clearStaleState();
  });

  // Redirect to the provided URL if the user information comes back as a string.
  useEffect(() => {
    if (typeof userInformation === 'string') {
      window.location.href = userInformation;
    } else if (userInformation != null) {
      updateUserInformation(userInformation as UserInformation);
    }
  }, [userInformation, updateUserInformation]);

  useEffect(() => {
    if (privileges != null) {
      updatePrivileges(privileges);
    }
  }, [privileges, updatePrivileges]);

  if (!isAuthenticated) return null;

  if (error) {
    return <OidcAuthenticationStatusPage error status={<OidcLoginError error={error} />} onContinue={onLogout} />;
  }

  if (!userInformation) {
    return <OidcAuthenticationStatusPage status="Loading your profile, please wait..." />;
  }

  if (typeof userInformation === 'string') {
    return <OidcAuthenticationStatusPage status="Redirecting, please wait..." />;
  }

  if (!privileges) {
    return <OidcAuthenticationStatusPage status="Verifying your account, please wait..." />;
  }

  return children;
};
