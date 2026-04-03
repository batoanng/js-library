import { Stack, Typography } from '@mui/material';
import { Button } from '@batoanng/mui-components';
import { CenterErrorModal, CenterPage } from './CenterModal';

interface Props {
  toggleEmailField: () => void;
  email: string;
  logo?: string;
  onPasswordReset?: (email: string) => void | Promise<void>;
}

export const SendPasswordResetEmail = ({ toggleEmailField, onPasswordReset, email, logo }: Props) => {
  const handleResendEmail = () => {
    onPasswordReset?.(email);
  };

  return (
    <CenterPage>
      <CenterErrorModal>
        {logo ? <img alt="Authentication logo" src={logo} /> : null}
        <Typography component="h1" variant="h2">
          Check your email
        </Typography>
        <Stack
          sx={{
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography>
            If the email is connected to your account, your password reset link will be sent to:
          </Typography>
          <Typography variant="body2">{email}</Typography>
          <Button variant="text" color="primary" onClick={toggleEmailField}>
            Change email address
          </Button>
        </Stack>
        <Button variant="outlined" color="primary" onClick={handleResendEmail} fullWidth>
          Resend email
        </Button>
      </CenterErrorModal>
    </CenterPage>
  );
};
