import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import InfoRounded from '@mui/icons-material/InfoRounded';
import WarningRounded from '@mui/icons-material/WarningRounded';

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
