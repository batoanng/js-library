import { Typography } from '@mui/material';
import { formatDuration } from 'date-fns';

import { Modal, ModalButtonProps } from '@/components';

type Props = {
  closeModal: () => void;
  timeout: number;
  primaryButton: ModalButtonProps;
  secondaryButton?: ModalButtonProps;
  heading: string;
};

export const TimedOutModal = ({ closeModal, timeout, primaryButton, secondaryButton, heading }: Props) => {
  return (
    <Modal open heading={heading} primaryButton={primaryButton} secondaryButton={secondaryButton} onClose={closeModal}>
      <Typography>There has been no activity for the last {formatDuration({ minutes: timeout / 60000 })}.</Typography>
      <Typography>For your security, you have been logged out.</Typography>
    </Modal>
  );
};
