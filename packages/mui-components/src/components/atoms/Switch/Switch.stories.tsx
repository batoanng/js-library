import { FormControlLabel, Switch } from '@mui/material';

export default {
  title: 'Components/Atoms/Switch',
  decorators: [],
};

export const Default = () => {
  return <FormControlLabel control={<Switch defaultChecked />} label="Label" />;
};
