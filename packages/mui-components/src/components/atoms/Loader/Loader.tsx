import { Container, type StackProps } from '@mui/material';

import { SROnly, Spinner } from '@/components';

import { LabelContainer } from './Containers';
import { Dimmer } from './Dimmer';
import type { LoaderProps } from './types';

export const Loader = ({ label = 'Loading...', fullPage, inactive, ...stackProps }: LoaderProps & StackProps) => {
  if (inactive) return null;

  return (
    <Dimmer fullPage={fullPage} {...stackProps}>
      <SROnly role="status">{label}</SROnly>
      <Container
        maxWidth="sm"
        sx={{
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Spinner />
        <LabelContainer fullPage={fullPage}>{label}</LabelContainer>
      </Container>
    </Dimmer>
  );
};
