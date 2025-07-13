import type { CreateStyled } from '@emotion/styled';

export const TransientOptions: Parameters<CreateStyled>[1] = {
  shouldForwardProp: (propName: string) => !propName.startsWith('$'),
};
