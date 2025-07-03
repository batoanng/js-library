import { useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useInterval } from 'react-use';

import type { ModalButtonProps } from '@/components';

import { ExtendSessionModal } from './ExtendSessionModal';
import { TimedOutModal } from './TimedOutModal';
import { SHOW_EXTEND_MODAL_TIME, TIMEOUT_TIME } from './constants';

export type IdleTimerProps = {
  /**
   * Whether the idle timer is disabled
   */
  disabled: boolean;

  /**
   * the function to call when the user is logged out
   */
  logoutUser: () => void;

  /**
   * The time in milliseconds before the user is logged out
   */
  timeout?: number;

  /**
   * The time in milliseconds before the user is prompted to extend their session
   */
  promptBeforeIdle?: number;

  /**
   * The function to call when the prompt is shown
   */
  onPromptShown?: () => void;

  /**
   * The heading that is passed down into the extend session modal
   */
  extendSessionHeading?: string;

  /**
   * The heading passed to the timeout modal
   */
  timeoutHeading?: string;

  /**
   * The primary button for the extend session modal
   */
  extendSessionPrimaryButton?: ModalButtonProps;

  /**
   * The secondary button for the extend session modal
   */
  extendSessionSecondaryButton?: ModalButtonProps;

  /**
   * The primary button for the timeout modal
   */
  timeoutPrimaryButton?: ModalButtonProps;

  /**
   * The secondary button for the timeout modal
   */
  timeoutSecondaryButton?: ModalButtonProps;
};

export const IdleTimer = ({
  disabled,
  timeout = TIMEOUT_TIME,
  promptBeforeIdle = SHOW_EXTEND_MODAL_TIME,
  logoutUser,
  onPromptShown,
  extendSessionHeading = 'Your session is about to time out',
  timeoutHeading = 'Your session has timed out',
  extendSessionPrimaryButton,
  extendSessionSecondaryButton,
  timeoutPrimaryButton,
  timeoutSecondaryButton,
}: IdleTimerProps) => {
  const [remainingTime, setRemainingTime] = useState(TIMEOUT_TIME);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showTimedOutModal, setShowTimedOutModal] = useState(false);

  const handleLogout = (showTimedOutModal = true) => {
    logoutUser();
    setShowExtendModal(false);
    setShowTimedOutModal(showTimedOutModal);
  };

  const onPrompt = () => {
    onPromptShown?.();
    setShowExtendModal(true);
  };

  const { getRemainingTime, activate } = useIdleTimer({
    timeout,
    promptBeforeIdle,
    throttle: 500,
    disabled,
    onPrompt,
    onIdle: () => handleLogout(),
  });

  useInterval(() => {
    setRemainingTime(getRemainingTime());
  }, 1000);

  const closeExtendModal = () => {
    activate();
    setShowExtendModal(false);
  };

  const closeTimeoutModal = () => {
    setShowTimedOutModal(false);
  };

  const internalExtendSessionPrimaryButton: ModalButtonProps = {
    text: 'Extend session',
    onClick: closeExtendModal,
    variant: 'contained',
    color: 'secondary',
    ...extendSessionPrimaryButton,
  };

  const internalExtendSessionSecondaryButton: ModalButtonProps = {
    text: 'Log out',
    onClick: () => handleLogout(false),
    color: 'secondary',
    variant: 'outlined',
    ...extendSessionSecondaryButton,
  };

  const internalTimeoutPrimaryButton: ModalButtonProps = {
    text: 'Log in',
    onClick: closeTimeoutModal,
    variant: 'contained',
    color: 'secondary',
    fullWidth: true,
    ...timeoutPrimaryButton,
  };

  if (showExtendModal) {
    return (
      <ExtendSessionModal
        heading={extendSessionHeading}
        remainingTime={remainingTime}
        handleLogout={handleLogout}
        closeModal={closeExtendModal}
        primaryButton={internalExtendSessionPrimaryButton}
        secondaryButton={internalExtendSessionSecondaryButton}
      />
    );
  }

  if (showTimedOutModal) {
    return (
      <TimedOutModal
        heading={timeoutHeading}
        timeout={timeout}
        closeModal={closeTimeoutModal}
        primaryButton={internalTimeoutPrimaryButton}
        secondaryButton={timeoutSecondaryButton}
      />
    );
  }

  return null;
};
