import { ApiClient, UserInformation, UserPrivileges } from './types';
import { AxiosError, AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { PropsWithChildren, useEffect } from 'react';
import { AuthContextProps, useAuth } from 'react-oidc-context';
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

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  __oidcRetryAttempted?: boolean;
}

const handleUnauthorizedRequest =
  (refreshAccessToken: AuthContextProps['signinSilent'], authScheme: string) =>
  async (apiClient: AxiosInstance, error: AxiosError) => {
    const requestConfig = error.config as RetryableRequestConfig | undefined;
    if (error.response?.status !== 401 || !requestConfig || requestConfig.__oidcRetryAttempted) {
      throw error;
    }

    requestConfig.__oidcRetryAttempted = true;

    const refreshedUser = await refreshAccessToken();
    if (!refreshedUser?.access_token) {
      throw error;
    }

    setBearerToken(apiClient, [authScheme, refreshedUser.access_token]);

    const requestHeaders = AxiosHeaders.from(requestConfig.headers ?? {});
    requestHeaders.set('Authorization', `${authScheme} ${refreshedUser.access_token}`);
    requestConfig.headers = requestHeaders;

    return apiClient(requestConfig);
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

  useEffect(() => {
    if (!apiClient) return;

    setBearerToken(apiClient, bearerToken ? [authScheme, bearerToken] : null);
    setUnauthorizedRequestHandler(apiClient, handleUnauthorizedRequest(signinSilent, authScheme));

    const interceptorId = apiClient.interceptors.response.use(
      (response) => response,
      (axiosError) => {
        const unauthorizedRequestHandler = (apiClient as ApiClient).onUnauthorizedRequest;
        if (!unauthorizedRequestHandler) {
          return Promise.reject(axiosError);
        }

        return unauthorizedRequestHandler(apiClient, axiosError as AxiosError);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(interceptorId);
      setUnauthorizedRequestHandler(apiClient, undefined);
    };
  }, [apiClient, bearerToken, signinSilent, authScheme]);

  const { updateUserInformation, updatePrivileges, onLogout } = useOidcAuthorisationContext();

  useEffect(() => {
    void clearStaleState();
  }, [clearStaleState]);

  // Redirect to the provided URL if the user information comes back as a string.
  useEffect(() => {
    if (typeof userInformation === 'string') {
      window.location.assign(userInformation);
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

  return <>{children}</>;
};
