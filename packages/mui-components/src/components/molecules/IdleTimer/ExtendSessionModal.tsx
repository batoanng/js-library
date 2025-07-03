import { Typography } from '@mui/material';
import { intervalToDuration } from 'date-fns';

import { Modal, ModalButtonProps } from '@/components';

type Props = {
  remainingTime: number;
  closeModal: () => void;
  handleLogout: (showTimedOutModal?: boolean) => void;
  heading: string;
  primaryButton: ModalButtonProps;
  secondaryButton: ModalButtonProps;
};

export const ExtendSessionModal = ({ remainingTime, primaryButton, secondaryButton, heading }: Props) => {
  const { minutes, seconds } = intervalToDuration({ start: 0, end: remainingTime });

  return (
    <Modal open heading={heading} primaryButton={primaryButton} secondaryButton={secondaryButton}>
      <Typography>
        Due to inactivity, your session is about to timeout in{' '}
        <Typography component="span" variant="body2">
          {minutes}:{seconds?.toString().padStart(2, '0')}
        </Typography>
        .
      </Typography>
      <Typography>Do you want to extend your session?</Typography>
    </Modal>
  );
};
