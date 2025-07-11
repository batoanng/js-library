import { useState } from 'react';
import { useBoolean } from 'react-use';
import { VerifyEmail } from './VerifyEmail';
import { SendPasswordResetEmail } from './SendPasswordResetEmail';

interface Props {
  error: Error;
  logo?: string;
  onPasswordReset?: (email: string) => void | Promise<void>;
}

export const OidcResetPasswordPage = ({ onPasswordReset, logo }: Props) => {
  const [isResetForm, toggleResetForm] = useBoolean(true);
  const [emailState, setEmailState] = useState('');

  const handleEmailSend = (email: string) => {
    onPasswordReset?.(email);
    setEmailState(email);
  };

  if (isResetForm) {
    return <VerifyEmail logo={logo} onPasswordReset={handleEmailSend} toggleEmailField={toggleResetForm} />;
  }

  return (
    <SendPasswordResetEmail
      onPasswordReset={handleEmailSend}
      toggleEmailField={toggleResetForm}
      email={emailState}
      logo={logo}
    />
  );
};
