import type { ReactNode } from 'react';
import { isFormOption } from './isFormOption';
import { getReactNode } from './getReactNode';

const PROPS = ['help', 'helpMessage'];

export const getOptionHelpMessageValue = <TOption>(option: TOption): ReactNode => {
  return isFormOption(option) ? getReactNode(option, PROPS) : undefined;
};
