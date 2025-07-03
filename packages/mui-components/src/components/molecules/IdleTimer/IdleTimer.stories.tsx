import { Typography } from '@mui/material';

import { IdleTimer } from '@/components';

export default {
  title: 'Components/Molecules/IdleTimer',
  decorators: [],
};

export const Default = () => {
  const logoutUser = () => {
    console.log('User logged out');
  };

  return (
    <>
      <Typography>Session will timeout in 20 seconds, you will be prompted in 1 seconds</Typography>
      <IdleTimer disabled={false} logoutUser={logoutUser} timeout={20000} promptBeforeIdle={19000} />
    </>
  );
};

export const CustomButtons = () => {
  const logoutUser = () => {
    console.log('User logged out');
  };

  return (
    <>
      <Typography>Session will timeout in 20 seconds, you will be prompted in 1 seconds</Typography>
      <IdleTimer
        disabled={false}
        logoutUser={logoutUser}
        timeout={20000}
        promptBeforeIdle={19000}
        extendSessionPrimaryButton={{
          text: 'this is custom text',
        }}
      />
    </>
  );
};
