import type { FormOption } from '@/types';
import { isFormOption } from './isFormOption';

export const getOptionFormValue = <TValue, TOption = FormOption<TValue> | TValue>(option: TOption) =>
  (isFormOption(option) ? option.value : option) as TValue;
