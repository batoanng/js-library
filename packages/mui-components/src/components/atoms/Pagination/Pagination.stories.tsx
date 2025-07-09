import { Pagination } from '@mui/material';

export default {
  title: 'Components/Atoms/Pagination',
  decorators: [],
};

export const Default = () => {
  return <Pagination count={10} color="secondary" />;
};

export const CertainPage = () => {
  return <Pagination count={10} page={3} color="secondary" />;
};
