import CancelIcon from '@mui/icons-material/Cancel';
import { Button } from '@mui/material';

type RemoveFileButtonProps = {
  onRemove: () => void;
};

export const RemoveFileButton = ({ onRemove }: RemoveFileButtonProps) => {
  return (
    <Button onClick={onRemove}>
      <CancelIcon />
    </Button>
  );
};
