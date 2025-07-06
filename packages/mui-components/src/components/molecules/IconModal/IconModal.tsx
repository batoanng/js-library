import { Box, Button, Divider, Typography } from '@mui/material';
import { type ReactNode } from 'react';
import { useToggle } from 'react-use';

import { HelpMessage } from '@/components/atoms';

import { SlideInModal } from '../SlideInModal';
import { ModalIcon } from './ModalIcon';

export type IconModalProps = {
  title: ReactNode;
  subtext?: ReactNode;
  helpText?: ReactNode;
  iconType?: 'info' | 'help';
};

export const IconModal = ({ title, subtext, helpText, iconType = 'info' }: IconModalProps) => {
  const [open, toggleModal] = useToggle(false);

  return (
    <>
      <Button variant="text" color="secondary" className="icon-button" onClick={toggleModal}>
        <ModalIcon iconType={iconType} />
      </Button>
      <SlideInModal anchor={'right'} open={open} onClose={toggleModal}>
        <Box>
          <Typography variant="h2">{title}</Typography>
          {subtext && (
            <Typography component="p" variant="h5">
              {subtext}
            </Typography>
          )}
        </Box>
        <Divider />
        <Box>{helpText && <HelpMessage>{helpText}</HelpMessage>}</Box>
      </SlideInModal>
    </>
  );
};
