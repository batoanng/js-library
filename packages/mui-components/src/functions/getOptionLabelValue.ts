import { getReactNode } from './getReactNode';
import type { ReactNode } from 'react';

const LABEL_PROPS = ['label', 'name', 'text'];

export const getOptionLabelValue = <TOption>(option: TOption): ReactNode => {
  // allow empty labels
  const value = getReactNode(option, LABEL_PROPS);
  if (value === '') return null;
  return value;
};
