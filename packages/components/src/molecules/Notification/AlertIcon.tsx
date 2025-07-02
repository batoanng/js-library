import { CheckCircleRounded, ErrorRounded, InfoRounded, WarningRounded } from '@mui/icons-material';

import type { AlertVariant } from './types';

type Props = {
  alertVariant: AlertVariant;
};

export const AlertIcon = ({ alertVariant }: Props) => {
  switch (alertVariant) {
    case 'info':
      return <InfoRounded />;
    case 'error':
      return <ErrorRounded />;
    case 'warning':
      return <WarningRounded />;
    case 'success':
      return <CheckCircleRounded />;
    default:
      return <InfoRounded />;
  }
};
