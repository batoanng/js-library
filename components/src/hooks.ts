import { useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';

export const useScreenType = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return { isDesktop, isTablet: isTablet && !isMobile, isMobile };
};

const SHORT_ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
const generateShortId = () => {
  let shortId = '';

  for (let i = 0; i < 8; i++) {
    const nextIndex = Math.floor(Math.random() * SHORT_ID_CHARS.length);
    shortId += SHORT_ID_CHARS[nextIndex];
  }

  return shortId;
};

/**
 * Generates an ID that can be used on an HTML field to associate it with a label for a11y happiness.
 *
 * @param fieldType The type of the field that will use the ID, e.g. 'input'. This can be anything, and is simply
 * used as a prefix for a generated ID to make it look less like garbage.
 * @param suppliedId The ID as supplied to the field. If this is truthy, it will be used as-is.
 * @param suppliedName The name as supplied to the field. If this is truthy, it will be used in the generated ID.
 * @returns An id string that can be used for the field.
 */
export const useHtmlId = (fieldType: string, suppliedId: string | null = null, suppliedName: string | null = null) => {
  return useMemo(() => {
    if (suppliedId) return suppliedId;

    const generatedId = generateShortId();
    return suppliedName ? `${suppliedName}-${generatedId}` : `${fieldType}-${generatedId}`;
  }, [fieldType, suppliedId, suppliedName]);
};
