import { Stack, Typography } from '@mui/material';

import { Loader } from '@/components';

export default {
  title: 'Components/Atoms/Loader',
  decorators: [],
};

export const Default = () => {
  return (
    <Stack
      sx={{
        height: '125px',
        border: '1px solid red',
        position: 'relative',
      }}
    >
      <Typography>The loader is showing on top of this box.</Typography>
      <Loader />
    </Stack>
  );
};

export const FullPage = () => {
  return (
    <Stack
      sx={{
        height: '75px',
        border: '1px solid red',
        position: 'relative',
      }}
    >
      <Typography>The loader is covering the full page.</Typography>
      <Loader fullPage />
    </Stack>
  );
};
