import { Box, Typography } from '@mui/material';

import { CircularLoader } from './CircularLoader';

export default {
  title: 'Components/Molecules/Circular Loader',
  decorators: [],
};

export const Default = () => {
  return (
    <div style={{ height: '200px', width: '200px', position: 'relative' }}>
      <Typography variant="body1">This is a bunch of text</Typography>
      <CircularLoader />
    </div>
  );
};

export const FullScreen = () => {
  return (
    <div style={{ height: '200px', width: '200px', position: 'relative' }}>
      <Typography variant="body1">This is a bunch of text</Typography>
      <CircularLoader fullScreen={true} />
    </div>
  );
};

export const CustomLabel = () => {
  return (
    <div style={{ height: '200px', width: '200px' }}>
      <Typography variant="body1">This is a bunch of text</Typography>
      <CircularLoader label={'Custom loading message'} />
    </div>
  );
};

export const OneComponentIsLoading = () => {
  return (
    <div>
      <div style={{ height: '200px', width: '200px' }}>
        <Typography variant="body1">This is a bunch of text</Typography>
      </div>

      <div style={{ height: '200px', width: '200px' }}>
        <Typography variant="body1">This is a bunch of text</Typography>
      </div>

      <div style={{ height: '200px', width: '200px' }}>
        <Typography variant="body1">This is a bunch of text</Typography>
      </div>

      <div style={{ height: '200px', width: '200px', position: 'relative' }}>
        <Typography variant="body1">This is a bunch of text</Typography>
        <CircularLoader />
      </div>
    </div>
  );
};
