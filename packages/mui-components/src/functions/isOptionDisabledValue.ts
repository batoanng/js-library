import { isFormOption } from './isFormOption';

export const isOptionDisabledValue = <TOption>(option: TOption): boolean =>
  (isFormOption(option) && option.disabled) || false;
