export type InputWidthVariant = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const getMaxWidth = (inputWidth?: InputWidthVariant) => {
  switch (inputWidth) {
    case 'xxs':
      return '3.5rem';
    case 'xs':
      return '5.75rem';
    case 'sm':
      return '8.25rem';
    case 'md':
      return '12.5rem';
    case 'lg':
      return '16.75rem';
    case 'xl':
      return '26rem';
    default:
      return '100%';
  }
};
