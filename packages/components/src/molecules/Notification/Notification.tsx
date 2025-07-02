import { Alert, AlertProps, Typography } from '@mui/material';
import type { ElementType, ForwardedRef, PropsWithChildren, ReactNode } from 'react';
import { forwardRef } from 'react';

import { AlertIcon } from './AlertIcon';
import type { AlertVariant } from './types';

export interface NotificationProps extends Pick<AlertProps, 'sx' | 'ref'> {
  /**
   * The title to be displayed in bold at the top of the alert.
   */
  title?: ReactNode;

  /**
   * Set to "alert" to display an icon alongside the notification.
   */
  notificationType?: 'callout' | 'alert';

  /**
   * ARIA role for the alert.
   */
  role?: 'alert' | 'status' | '';

  /**
   * The component prop that is set for the underlying Typography component. This defaults to `div` to comply with accessibility, but can be set to any valid HTML tag.
   */
  titleComponent?: ElementType;

  /**
   * Controls the colour and the icon shown within the alert. Defaults to "info".
   */
  alertVariant?: AlertVariant;

  /**
   * Optional class name to be passed to the root of the component.
   */
  className?: string;
}
export const Notification = forwardRef(
  (
    {
      title,
      notificationType,
      children,
      titleComponent = 'div',
      alertVariant = 'info',
      ...props
    }: PropsWithChildren<NotificationProps>,
    ref?: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <Alert
        icon={notificationType === 'alert' && <AlertIcon alertVariant={alertVariant} />}
        severity={alertVariant}
        {...props}
        ref={ref}
      >
        {title && (
          <Typography
            component={titleComponent}
            className="notification-title"
            sx={{
              mb: children ? '0.25rem' : undefined,
              fontWeight: 700,
              fontSize: '1rem',
              lineHeight: 1.5,
            }}
          >
            {title}
          </Typography>
        )}
        {children}
      </Alert>
    );
  }
);
