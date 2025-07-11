import { AxiosError, AxiosInstance } from 'axios';

export type UnauthorizedRequestHandler = (client: AxiosInstance, error: AxiosError) => Promise<unknown>;

interface ApiClientConfig {
  tenantId?: string | null;
  accessToken?: string | string[] | null;
  onUnauthorizedRequest?: UnauthorizedRequestHandler;
}

export type ApiClient = AxiosInstance & ApiClientConfig;

export interface LoginOptions {
  /**
   * Overrides the return URL to land at when logging in.
   */
  postLoginUrl?: string;
}

export interface UserLoginState {
  /**
   * The URL to return to after the login callback is invoked
   */
  postLoginUrl?: string;
}

export type OidcSchemeData = {
  onRefresh: () => Promise<boolean>;
  onSoftLogout: () => Promise<void>;
};

export interface UserInformation {
  shortName: string;
  fullName: string;
  email?: string;

  /** The user's role in the current tenant  */
  role?: string;
}

/**
 * The list of permissions.
 */
export type LogReadPermission = 'activityLog.read';

/**
 * A set of permissions as they are applied to a user.
 */
export type UserPrivileges = Record<LogReadPermission, boolean>;

export const defaultPrivileges: UserPrivileges = {
  'activityLog.read': false,
} as const;

export interface AuthorisationHandler {
  onLogin: (options?: LoginOptions) => void | Promise<void>;
  onLogout: () => void | Promise<void>;
}

export interface Authorisation {
  /**
   * Determines if the user is authenticated. Return `undefined` for an indeterminate state (eg. authentication is loading).
   */
  isAuthenticated?: boolean | undefined;
  userInformation?: UserInformation;
  privileges?: UserPrivileges;
  token?: string;

  /**
   * The UTC time (millis) when the token is set to expire
   */
  tokenExpiry?: number;
  refreshToken?: string;
}

export type AuthorisationContextType = Authorisation &
  AuthorisationHandler & {
    /**
     * Updates the `UserInformation` stored in the authorisation context.
     *
     * @param userInformation The updated user information.
     */
    updateUserInformation: (userInformation: UserInformation) => void;

    /**
     * Updates the `privileges` stored in the authorisation context.
     *
     * @param privileges The updated privileges.
     */
    updatePrivileges: (privileges: UserPrivileges) => void;

    /**
     * Any extended data provided by the authorisation scheme.
     */
    schemeData?: unknown;
  };

export interface ChallengeResult {
  allow: boolean;
  reason?: string;
}
