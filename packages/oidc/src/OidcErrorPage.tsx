import { OidcAuthenticationStatusPage } from './OidcAuthenticationPage';

interface Props {
  error: Error;
  onContinue?: () => void | Promise<void>;
}

export const OidcErrorPage = ({ error, onContinue }: Props) => {
  return (
    <OidcAuthenticationStatusPage
      error
      heading="Authentication failed"
      status={`We could not authenticate you at this time. ${error.message}`}
      onContinue={onContinue}
    />
  );
};
