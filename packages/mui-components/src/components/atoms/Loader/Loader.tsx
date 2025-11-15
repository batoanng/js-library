import { Container, type StackProps } from '@mui/material';

import { SROnly } from '@/components';

import { IconContainer, LabelContainer } from './Containers';
import { Dimmer } from './Dimmer';
import type { LoaderProps } from './types';
import LoaderSvg from './Loader.svg?react';
import { ReactNode } from 'react';

interface Props {
  loadingIcon?: ReactNode;
}

export const Loader = ({ label, loadingIcon, fullPage, inactive, ...stackProps }: LoaderProps & StackProps & Props) => {
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
        {Boolean(loadingIcon) ? (
          loadingIcon
        ) : (
          <IconContainer>
            <LoaderSvg />
          </IconContainer>
        )}
        {label && <LabelContainer fullPage={fullPage}>{label}</LabelContainer>}
      </Container>
    </Dimmer>
  );
};
