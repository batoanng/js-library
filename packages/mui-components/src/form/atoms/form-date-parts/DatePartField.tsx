import { styled } from '@mui/material';
import type { ChangeEvent, ForwardedRef } from 'react';
import { forwardRef, useMemo, useState } from 'react';

import type { DatePart, DatePartFieldInputProps } from './types';
import { TextInput, TextInputProps } from '@/components';

type FieldProps = Pick<TextInputProps, 'label'> & {
  maxDigits: 2 | 4;
  separators?: boolean;
  maxWidth: string;
};

const Input = styled(TextInput)(({ theme }) => ({
  '&.date-part-field label': {
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export type DatePartFieldProps = DatePartFieldInputProps & {
  ownerId: string;
  part: DatePart;
  error?: boolean;
  onChange: (next: string) => void;
};

export const DatePartField = forwardRef((props: DatePartFieldProps, ref?: ForwardedRef<HTMLInputElement>) => {
  const {
    ownerId,
    name,
    className = '',
    part,
    onChange,
    value: formValue,
    inputProps = {},
    sx = {},
    ...fieldProps
  } = props;

  // Track the value from the input separately to the value from the form. This allows the form state to
  // contain a zero-padded value, but the input to contain whatever the user has actually typed in.
  const [inputValue, setInputValue] = useState<string>(typeof formValue === 'string' ? formValue : '');

  const { label, maxDigits, maxWidth, separators } = useFieldProps(part);
  const maxLength = separators ? maxDigits + 1 : maxDigits;

  const classNames = `date-part-field date-part-field-${part} ${className}`;
  const fieldId = `${ownerId}-${part}`;
  const fieldName = `${name}.${part}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value ?? '';

    if (nextValue.length > 0) {
      const pattern = `^\\d{1,${maxDigits}}${separators ? '[-/\\s]?' : ''}$`;
      const regex = new RegExp(pattern);
      if (!regex.test(nextValue)) return;
    }

    onChange(nextValue);

    const digitsMatch = /\d+/.exec(nextValue);
    const digits = digitsMatch?.length ? digitsMatch[0] : '';
    setInputValue(digits);
  };

  // Drop the value that the user has entered in favour of the value coming from the form, if the numbers
  // don't parse to the same thing. The inputValue will then get overwritten the next time the user makes
  // a change.
  const displayValue =
    inputValue === formValue || parseInt(inputValue, 10) === parseInt(formValue as string, 10)
      ? inputValue
      : formValue ?? '';

  return (
    <Input
      {...fieldProps}
      id={fieldId}
      label={label}
      name={fieldName}
      className={classNames}
      inputRef={ref}
      inputProps={{
        maxLength,
        ...inputProps,
      }}
      sx={{
        maxWidth,
        ...sx,
      }}
      value={displayValue}
      onChange={handleChange}
    />
  );
});

function useFieldProps(part: DatePart): FieldProps {
  return useMemo(() => {
    const label = `${part[0].toUpperCase()}${part.slice(1)}`;

    switch (part) {
      case 'day':
      case 'month':
        return {
          label,
          separators: true,
          maxWidth: '4.5em',
          maxDigits: 2,
        };

      case 'year':
        return {
          label,
          maxWidth: '8em',
          maxDigits: 4,
        };
    }
  }, [part]);
}
