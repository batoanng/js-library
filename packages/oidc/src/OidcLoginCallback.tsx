import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useLocation, useNavigate } from 'react-router-dom';
import { OidcAuthenticationStatusPage } from './OidcAuthenticationPage';
import { UserLoginState } from './types';

const EXPIRED_PASSWORD = 'expired';

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
  const isExpired = Boolean(errorDescription && errorDescription.search(EXPIRED_PASSWORD) >= 0);

  useEffect(() => {
    if (isLoading) return;
    if (isExpired) {
      navigate('/expired');
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
