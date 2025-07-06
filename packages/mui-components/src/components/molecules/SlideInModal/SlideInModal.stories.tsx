import { Button, Divider, Typography } from '@mui/material';
import { useState } from 'react';

import { IconModal } from '@/components';
import { SlideInModal } from './SlideInModal';

export default {
  title: 'Components/Molecules/Slide In Modal',
  decorators: [],
};

export const Default = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Open Modal
      </Button>
      <SlideInModal open={open} onClose={handleClose}>
        <div style={{ marginBottom: '0.5em' }}>
          <Typography variant="h2">Information</Typography>
          <Typography variant="h5">What you need to know</Typography>
        </div>
        <Divider />
        <div style={{ marginTop: '0.5em' }}>
          <Typography variant="body1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In quis ligula eros. Praesent at elit quam. Quisque
            venenatis efficitur tempus. Morbi blandit fermentum tempus. Phasellus non congue nunc, id elementum ligula.
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Ut sit amet odio et
            tellus condimentum venenatis eget sit amet urna.
          </Typography>
        </div>
      </SlideInModal>
    </>
  );
};

export const Icon = () => {
  return (
    <IconModal
      iconType="info"
      title="Information"
      subtext="What you need to know"
      helpText={
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In quis ligula eros. Praesent at elit quam. Quisque
          venenatis efficitur tempus. Morbi blandit fermentum tempus.
        </p>
      }
    />
  );
};

export const HyperLink = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="text" color="secondary" onClick={() => handleOpen()}>
        Open Modal
      </Button>
      <SlideInModal anchor={'right'} open={open} onClose={handleClose}>
        <div style={{ marginBottom: '0.5em' }}>
          <Typography variant="h2">Information</Typography>
          <Typography variant="h5">What you need to know</Typography>
        </div>
        <Divider />
        <div style={{ marginTop: '0.5em' }}>
          <Typography variant="body1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In quis ligula eros. Praesent at elit quam. Quisque
            venenatis efficitur tempus. Morbi blandit fermentum tempus. Phasellus non congue nunc, id elementum ligula.
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Ut sit amet odio et
            tellus condimentum venenatis eget sit amet urna.
          </Typography>
        </div>
      </SlideInModal>
    </>
  );
};
