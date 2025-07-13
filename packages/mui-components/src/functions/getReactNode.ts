import type { ReactNode } from 'react';
import { isValidElement } from 'react';

export const getReactNode = <TOption>(option: TOption, oneOfProps: string[]): ReactNode => {
  if (option === null) throw new Error('Options cannot be null');

  if (typeof option === 'string' || typeof option === 'number' || typeof option === 'boolean') return option;
  if (typeof option === 'bigint') {
    return option.toString();
  }

  if (typeof option === 'object') {
    if (isValidElement(option)) {
      return option;
    } else {
      const propValue = oneOfProps
        .map((prop) => (Object.hasOwn(option, prop) ? (option as Record<string, unknown>)[prop] : undefined))
        .find((value) => value !== undefined);

      if (propValue === null) {
        return null;
      }

      if (propValue !== undefined) {
        return getReactNode(propValue, oneOfProps);
      }
    }
  }
};
