import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';

import { Button } from '@/components';

export default {
  title: 'Components/Atoms/Button',
  decorators: [],
};

export const Primary = () => {
  return (
    <Button variant="contained" onClick={() => void +1}>
      Button
    </Button>
  );
};

export const Secondary = () => {
  return (
    <Button variant="outlined" color="secondary" onClick={() => void +1}>
      Button
    </Button>
  );
};

export const Tertiary = () => {
  return (
    <Button variant="text" color="warning" onClick={() => void +1}>
      Button
    </Button>
  );
};

export const Link = () => {
  return (
    <Button variant="text" color="secondary" onClick={() => void +1}>
      Button
    </Button>
  );
};

export const RightArrow = () => {
  return (
    <Button variant="text" color="secondary" endIcon={<ArrowForwardOutlinedIcon />} onClick={() => void +1}>
      Link button with right arrow
    </Button>
  );
};

export const BackButton = () => {
  return (
    <Button variant="text" color="secondary" startIcon={<ArrowBackIosNewOutlinedIcon />} onClick={() => void +1}>
      Back
    </Button>
  );
};

export const Loading = () => {
  return (
    <Button loading variant="outlined" color="secondary" onClick={() => void +1}>
      Button
    </Button>
  );
};

Loading.parameters = {
  chromatic: { disableSnapshot: true },
};
