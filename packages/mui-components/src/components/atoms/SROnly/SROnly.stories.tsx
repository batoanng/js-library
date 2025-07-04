import { Box, Typography } from '@mui/material';

import { SROnly } from '@/components';

export default {
  title: 'Components/Atoms/SROnly',
  decorators: [],
};

export const Default = () => {
  return (
    <Box>
      <Typography>This shows in the page, but there is also a label for screen readers only.</Typography>
      <SROnly role="alert">You are using a screen reader!</SROnly>
    </Box>
  );
};
