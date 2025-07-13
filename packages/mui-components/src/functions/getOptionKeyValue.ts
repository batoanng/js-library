const KEY_PROPS = ['value', 'id', 'key'];

const getStringValue = <TOption>(option: TOption, oneOfProps: string[]): string | undefined => {
  if (typeof option === 'string') return option;
  if (typeof option === 'number' || typeof option === 'bigint' || typeof option === 'boolean') {
    return option.toString();
  }

  if (option && typeof option === 'object') {
    const propName = oneOfProps.find((prop) => Object.hasOwn(option, prop));
    const propValue = propName ? (option as Record<string, unknown>)[propName] : undefined;
    if (propValue != null) {
      return getStringValue(propValue, oneOfProps);
    }
  }

  return undefined;
};

export const getOptionKeyValue = <TOption>(option?: TOption): string => {
  if (option == null) return '';
  const key = getStringValue(option, KEY_PROPS);
  if (key || key === '') return key;
  throw new Error(`Could not find a key value for an option. Please provide an implementation for 'getOptionKey'`);
};
