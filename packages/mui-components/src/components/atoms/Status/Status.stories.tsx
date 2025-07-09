import { Chip } from '@mui/material';

export default {
  title: 'Components/Atoms/Status',
  decorators: [],
};

export const neutralLabel = () => {
  return <Chip label="Neutral" />;
};

export const errorLabel = () => {
  return <Chip label="Error" color="error" />;
};

export const warningLabel = () => {
  return <Chip label="Warning" color="warning" />;
};

export const successLabel = () => {
  return <Chip label="Success" color="success" />;
};

export const infoLabel = () => {
  return <Chip label="Info" color="info" />;
};
