import { Link } from '@mui/material';

import { ExternalLink } from '@/components';

export default {
  title: 'Components/Atoms/Link',
  decorators: [],
};

export const Default = () => {
  return <Link href="https://www.google.com">Simple link from MUI</Link>;
};

export const UnifiedExternalLink = () => {
  return (
    <ExternalLink href="https://www.google.com" color="#ffaa00">
      Unified external link
    </ExternalLink>
  );
};

export const ExternalLinkInNewTabCustomColour = () => {
  return (
    <ExternalLink color="#004400" href="https://www.google.com">
      Simple link
    </ExternalLink>
  );
};

export const ExternalLinkInNewTabDefaultColour = () => {
  return <ExternalLink href="https://www.google.com">Simple link</ExternalLink>;
};

export const CustomScreenReaderText = () => {
  return (
    <ExternalLink href="https://www.google.com" screenReaderText="this is custom text only shown to the screen reader">
      Simple link
    </ExternalLink>
  );
};

export const ExternalLinkWithoutIcon = () => {
  return (
    <ExternalLink href="https://www.google.com" showIcon={false}>
      Simple link
    </ExternalLink>
  );
};
