import CloseIcon from '@mui/icons-material/Close';
import type { ButtonProps, ModalProps as MuiModalProps } from '@mui/material';
import { Box, Button, Modal as MuiModal, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export type ModalButtonProps = ButtonProps & { text: string };

export type ModalProps = {
  heading: string;
  primaryButton?: ModalButtonProps;
  secondaryButton?: ModalButtonProps;
  children?: ReactNode;
  text?: ReactNode;
  dismiss?: boolean;
} & Omit<MuiModalProps, 'children'>;

export const Modal = ({
  heading,
  primaryButton,
  secondaryButton,
  children,
  text,
  dismiss = false,
  ...muiModalProps
}: ModalProps) => {
  const { onClose } = muiModalProps;

  return (
    <MuiModal {...muiModalProps}>
      <Stack className={'modal'}>
        <Box className={'modal-header'}>
          {dismiss && onClose && (
            <Button
              variant="text"
              color="info"
              aria-label="close-modal"
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                padding: '0',
                minWidth: '0',
              }}
              onClick={(event) => {
                onClose(event, 'backdropClick');
              }}
            >
              <CloseIcon style={{ fontSize: '1.725rem' }} />
            </Button>
          )}
          <Typography
            variant={'h2'}
            sx={{
              pr: 3,
            }}
          >
            {heading}
          </Typography>
        </Box>
        {Boolean(children || text) && (
          <Box className={'modal-contents'}>{children || <Typography>{text}</Typography>}</Box>
        )}

        {primaryButton || secondaryButton ? (
          <Box className={'modal-buttons'}>
            {secondaryButton && <Button {...secondaryButton}>{secondaryButton.text}</Button>}
            {primaryButton && <Button {...primaryButton}>{primaryButton.text}</Button>}
          </Box>
        ) : null}
      </Stack>
    </MuiModal>
  );
};
