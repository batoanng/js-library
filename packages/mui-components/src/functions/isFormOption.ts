import type { FormOption } from '@/types';
import { isObject } from './isObject';

export const isFormOption = (value: unknown): value is FormOption<unknown> => {
  // if the value is not an object then we want to return false
  return isObject(value) && Object.hasOwn(value, 'label') && Object.hasOwn(value, 'value');
};
