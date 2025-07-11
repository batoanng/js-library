import { Box, Button, Container, Paper, Stack, styled, Typography } from '@mui/material';
import { Notification } from '@batoanng/mui-components';
import { PropsWithChildren, ReactNode } from 'react';

const OidcAuthCallbackBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100vw',
  height: '100vh',
  position: 'absolute',
  top: 0,
  left: 0,
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.info.light,
  zIndex: theme.zIndex.modal,
}));

interface OidcAuthenticationPageProps {
  error?: boolean;
  heading?: string;

  /**
   * Event handler to invoke after an error.
   */
  onContinue?: () => void | Promise<void>;
}

export const OidcAuthenticationPage = ({
  error = false,
  heading,
  onContinue,
  children,
}: PropsWithChildren<OidcAuthenticationPageProps>) => {
  return (
    <OidcAuthCallbackBox>
      <Container maxWidth="sm">
        <Paper sx={{ px: 2, py: 2 }}>
          <Stack
            direction="column"
            sx={{
              gap: 3,
            }}
          >
            {error && (
              <Notification notificationType="alert" alertVariant="warning">
                {children}
              </Notification>
            )}

            {!error && (
              <Box>
                {Boolean(heading) && <Typography variant="h3">{heading}</Typography>}
                {children}
              </Box>
            )}

            {onContinue && (
              <Button variant="contained" onClick={onContinue}>
                Continue
              </Button>
            )}
          </Stack>
        </Paper>
      </Container>
    </OidcAuthCallbackBox>
  );
};

interface OidcAuthenticationStatusPageProps extends OidcAuthenticationPageProps {
  status?: ReactNode;
}

export const OidcAuthenticationStatusPage = ({ status, ...props }: OidcAuthenticationStatusPageProps) => (
  <OidcAuthenticationPage {...props}>
    {typeof status === 'string' ? <Typography>{status}</Typography> : status}
  </OidcAuthenticationPage>
);
