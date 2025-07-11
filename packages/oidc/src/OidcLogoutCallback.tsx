import { FC, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { OidcAuthenticationStatusPage } from './OidcAuthenticationPage';

/**
 * Callback component invoked after the OIDC logout has completed
 */
export const OidcLogoutCallback: FC = () => {
  const navigate = useNavigate();

  const { isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      console.warn('The user was not removed from the OIDC store after logout');
    }

    navigate('/');
  }, [isLoading, user, navigate]);

  // If logout failed for some reason, closing the browser window should be sufficient, since the user's token
  // is stored in session state.
  const isLogoutError = !isLoading && Boolean(user);
  if (isLogoutError) {
    return (
      <OidcAuthenticationStatusPage
        error
        heading="Logout failed"
        status="We could not finalise your logout. Please close your browser window to finalise logout"
      />
    );
  }

  return <OidcAuthenticationStatusPage status="Completing logout, please wait..." />;
};
