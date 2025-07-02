import type { ForwardedRef, PropsWithChildren } from 'react';
import { forwardRef } from 'react';

import type { NotificationProps } from './Notification';
import { Notification } from './Notification';
import type { AlertVariant } from './types';

export type InPageAlertProps = Omit<NotificationProps, 'alertVariant' | 'notificationType' | 'role'> & {
  /**
   * ARIA role. Defaults to "alert".
   */
  role?: 'alert' | 'status' | '';

  /**
   * Alert variant. Defaults to "info".
   */
  variant?: AlertVariant;
};

export const InPageAlert = forwardRef(
  ({ variant, role = 'alert', ...props }: PropsWithChildren<InPageAlertProps>, ref?: ForwardedRef<HTMLDivElement>) => (
    <Notification {...props} ref={ref} notificationType="alert" role={role} alertVariant={variant} />
  )
);
