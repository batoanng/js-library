import { Stack, Typography } from '@mui/material';

interface Props {
  error: Error;
}

export const OidcLoginError = ({ error }: Props) => (
  <Stack
    sx={{
      gap: 1,
    }}
  >
    {[...getErrorText(error)].map((text, index) => (
      <Typography
        key={index}
        sx={{
          fontWeight: index === 0 ? 'bold' : 'normal',
        }}
      >
        {text}
      </Typography>
    ))}
  </Stack>
);

interface ErrorWithStatusCode {
  status: number;
}

const hasStatusCode = (error: unknown): error is ErrorWithStatusCode => (error as ErrorWithStatusCode).status > 0;

function* getErrorText(error: Error): IterableIterator<string> {
  if (hasStatusCode(error)) {
    switch (error.status) {
      case 401:
        yield 'You are not authorised to use this portal.';
        yield 'Contact an administrator to activate your portal access.';
        return;

      case 403:
        yield 'You do not have access to this portal.';
        yield 'Contact an administrator to activate your portal access.';
        return;

      case 404:
        yield "User account doesn't exist";
        yield 'There are no accounts associated with your login details. Contact an administrator to create an account.';
        return;

      case 422:
        yield 'Login failed - account error';
        yield 'An unexpected error occurred . Contact an administrator for assistance.';
        return;

      case 500:
        yield 'Login failed';
        yield 'An unexpected error occurred. Try again later or contact an administrator if the problem persist.';
        return;

      case 504:
        yield 'Login failed - connection time out';
        yield 'Check your internet connection and try again.';
        return;
    }
  }

  yield error.message;
}
