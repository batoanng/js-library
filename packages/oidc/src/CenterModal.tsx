import { Stack, styled } from '@mui/material';

export const CenterPage = styled(Stack)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  backgroundColor: theme.palette.info.light,
  boxShadow: '0px 4px 16px 0px rgba(0, 0, 0, 0.25)',
})) as typeof Stack;

export const CenterErrorModal = styled(Stack)(({ theme }) => ({
  maxWidth: '420px',
  minHeight: '630px',
  gap: theme.spacing(3),
  backgroundColor: 'white',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 32px 48px 32px',
  borderRadius: theme.spacing(1),

  [theme.breakpoints.down('xs')]: {
    maxWidth: '100%',
  },
})) as typeof Stack;
