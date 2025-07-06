import { Box } from '@mui/material';
import type { PropsWithChildren } from 'react';

/**
 * Simple message component that displays help messages in various forms.
 */
export const HelpMessage = ({ children }: PropsWithChildren) => {
  if (typeof children !== 'string') {
    return <>{children}</>;
  }

  if (!children?.length) return null;

  const isHtml = /<\/?[a-z][\s\S]*>/.test(children);
  if (!isHtml) return <>{children}</>;

  return <Box component="span" dangerouslySetInnerHTML={{ __html: children }} />;
};
