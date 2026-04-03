import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useLocation, useNavigate } from 'react-router-dom';
import { OidcAuthenticationStatusPage } from './OidcAuthenticationStatusPage';
import { OIDC_EXPIRED_PASSWORD, OIDC_EXPIRED_ROUTE } from './constants';
import { UserLoginState } from './types';

/**
 * Callback component invoked after the OIDC login has completed
 */
export const OidcLoginCallback = () => {
  const navigate = useNavigate();

  const { isLoading, error, user, clearStaleState } = useAuth();
  const { postLoginUrl } = (user?.state ?? {}) as UserLoginState;

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const errorDescription = queryParams.get('error_description');
  const isExpired = Boolean(errorDescription?.toLowerCase().includes(OIDC_EXPIRED_PASSWORD));

  useEffect(() => {
    if (isLoading) return;

    if (isExpired) {
      navigate(OIDC_EXPIRED_ROUTE, { replace: true, state: {} });
      return;
    }

    if (!error) {
      navigate(postLoginUrl || '/', { replace: true, state: {} });
    }
  }, [isLoading, error, postLoginUrl, navigate, isExpired]);

  const handleContinue = async () => {
    await clearStaleState();
    navigate('/');
  };

  if (error && !isExpired) {
    console.warn(`Login failed - ${errorDescription}`);

    return (
      <OidcAuthenticationStatusPage
        error
        heading="Login failed"
        status="We could not log you in at this time."
        onContinue={handleContinue}
      />
    );
  }

  return <OidcAuthenticationStatusPage status="Verifying login, please wait..." />;
};
