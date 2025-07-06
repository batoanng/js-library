// Replace +610xxx, 61xxx, 610xxx, +61xxx with 0
export const replaceIntlDialingPrefixAu = (phoneNumber: string): string => {
  return phoneNumber.replace(/^(\+?610?)\s*/, '0');
};
