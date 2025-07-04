import { Container, type StackProps } from '@mui/material';

import { SROnly } from '@/components';

import { IconContainer, LabelContainer } from './Containers';
import { Dimmer } from './Dimmer';
import LoaderSvg from './Loader.svg?react';
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
        <IconContainer>
          <LoaderSvg />
        </IconContainer>
        <LabelContainer fullPage={fullPage}>{label}</LabelContainer>
      </Container>
    </Dimmer>
  );
};
