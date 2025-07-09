import type { LinkProps } from '@mui/material';
import { Box, Link } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import { ExternalLinkIcon } from '@/components';

export const ThemedExternalLinkIcon = ({ color }: Pick<LinkProps, 'color'>) => {
  return <ExternalLinkIcon color={typeof color === 'string' ? color : undefined} />;
};

export type ExternalLinkProps = LinkProps & {
  /**
   * The content of the screen reader text. This only appears for screen readers.
   */
  screenReaderText?: string;

  /**
   * Whether to show the external link icon
   * @default true
   */
  showIcon?: boolean;
};

export const ExternalLink = ({
  children,
  color,
  screenReaderText = 'opens in a new tab',
  showIcon = true,
  ...linkProps
}: ExternalLinkProps) => {
  return (
    <Link target="_blank" color={color} {...linkProps}>
      {children}
      {showIcon && <ThemedExternalLinkIcon color={color} />}
      <Box component="span" sx={visuallyHidden}>
        {screenReaderText}
      </Box>
    </Link>
  );
};
