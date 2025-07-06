import type { DrawerProps } from '@mui/material';
import { Box, Drawer, styled } from '@mui/material';

import { CloseButton } from '@/components';

const DrawerWrapper = styled(Drawer)(({ theme }) => ({
  '& .MuiPaper-root.MuiPaper-elevation': {
    [theme.breakpoints.down('md')]: {
      width: '70%',
    },
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  padding: theme.spacing(4),

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5),
  },
}));

type Props = DrawerProps & {
  onClose: () => void;
};

export const SlideInModal = ({ children, ...props }: Props) => {
  return (
    <DrawerWrapper anchor="right" {...props}>
      <CloseButton onClick={props.onClose} />
      <ContentWrapper>{children}</ContentWrapper>
    </DrawerWrapper>
  );
};
