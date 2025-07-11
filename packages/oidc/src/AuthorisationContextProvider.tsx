import { PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import {
  Authorisation,
  AuthorisationHandler,
  defaultPrivileges,
  LogReadPermission,
  AuthorisationContext,
  ChallengeResult,
  useAuthorisationContext,
} from '.';

type SchemeData<TSchemeData extends object = object> = {
  schemeData?: TSchemeData;
};

export const AuthorisationContextProvider = <TSchemeData extends object = object>({
  children,
  onLogin,
  onLogout,
  userInformation: defaultUserInformation,
  privileges: initPrivileges = defaultPrivileges,
  schemeData,
  ...authorisation
}: PropsWithChildren<AuthorisationHandler & Partial<Authorisation> & SchemeData<TSchemeData>>) => {
  const [userInformation, setUserInformation] = useState(defaultUserInformation);
  const [privileges, setPrivileges] = useState(initPrivileges);

  return (
    <AuthorisationContext.Provider
      value={{
        ...AnonymousAuthorisation,
        onLogin,
        onLogout,
        userInformation,
        privileges,
        updateUserInformation: setUserInformation,
        updatePrivileges: setPrivileges,
        schemeData,
        ...authorisation,
      }}
    >
      {children}
    </AuthorisationContext.Provider>
  );
};

/**
 * Provides a callback to challenge permissions based on the current set of user permissions.
 */
export const useChallenge = () => {
  const context = useAuthorisationContext();

  return useCallback(
    (claim: LogReadPermission): ChallengeResult => {
      const allow = context?.privileges?.[claim];
      if (allow != null) {
        return { allow };
      }

      const defaultAllow = defaultPrivileges[claim];
      if (defaultAllow != null) {
        return {
          allow: defaultAllow,
          reason: `No privilege found for claim '${claim}', assuming default.`,
        };
      }

      // :shrug:
      const reason = `No privilege found for claim '${claim}' and no default exists.`;
      console.warn(reason);

      return { allow: false, reason };
    },
    [context?.privileges]
  );
};

/**
 * Provides a memoized challenge result for a given claim, based on the current set of user permissions.
 *
 * @param claim The claim to challenge.
 */
export const useChallengeResult = (claim: LogReadPermission) => {
  const challenge = useChallenge();
  return useMemo(() => challenge(claim).allow, [challenge, claim]);
};

export const AnonymousAuthorisation: Authorisation = {
  isAuthenticated: false,
};
