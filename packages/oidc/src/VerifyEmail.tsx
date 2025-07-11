import { FormProvider, useForm } from 'react-hook-form';
import { Typography } from '@mui/material';
import { FormTextField } from '@batoanng/mui-components';
import { CenterErrorModal, CenterPage } from './CenterModal';
import { Button } from '@batoanng/mui-components';

type ResetPasswordForm = {
  email: string;
};

interface Props {
  toggleEmailField: () => void;
  logo?: string;
  onPasswordReset?: (email: string) => void | Promise<void>;
}

export const VerifyEmail = ({ logo, onPasswordReset, toggleEmailField }: Props) => {
  const form = useForm<ResetPasswordForm>({
    defaultValues: { email: '' },
  });

  const handleSubmit = (values: ResetPasswordForm) => {
    onPasswordReset?.(values.email);
    toggleEmailField();
  };

  return (
    <FormProvider {...form}>
      <CenterPage onSubmit={form.handleSubmit(handleSubmit)} component="form">
        <CenterErrorModal>
          <img alt="nsw logo" src={logo} />
          <Typography component="h1" variant="h2">
            Password expired
          </Typography>
          <Typography>
            Your password expires after 90 days. Enter the email connected to your account. We’ll send you a link to
            reset your password.
          </Typography>
          <FormTextField<ResetPasswordForm, 'email'>
            id="email"
            name="email"
            label="Email"
            rules={{ required: 'You must enter your email.' }}
            fullWidth
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Continue
          </Button>
        </CenterErrorModal>
      </CenterPage>
    </FormProvider>
  );
};
