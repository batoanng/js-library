import type { FormFieldRules } from '@/types';
import { format, isValid, parse } from 'date-fns';
import type { FocusEvent } from 'react';
import { useMemo } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { useLatest } from 'react-use';

import type {
  DateControlFieldValueFormat,
  DateControlFormValueFormat,
  FormDateControlErrorMessages,
  FormDateControlRules,
} from './types';

// Tests if a string is just a date formatting string - DD/MM/YYYY or MM/YYYY
export const DATE_FORMAT_REGEX = /^(?:DD\/)?MM\/YYYY$/i;
// Tests if a string is a valid date - 01/01/1980 or 01/1980
export const VALID_DATE_REGEX = /^(?:\d{2}\/)?\d{2}\/\d{4}$/;

export const useDateControlRules = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  customRules: FormDateControlRules<TFieldValues, TName> | undefined = {},
  required: boolean | undefined = false,
  minDate: Date | undefined = undefined,
  maxDate: Date | undefined = undefined,
  fieldValueFormat: DateControlFieldValueFormat | undefined = 'dd/MM/yyyy',
  formValueFormat: DateControlFormValueFormat | undefined = 'yyyy-MM-dd',
  errorMessages: FormDateControlErrorMessages | undefined = {}
) => {
  const errorMessagesRef = useLatest(errorMessages);

  const { validate: inferredValidate, ...inferredRules } = useMemo((): FormFieldRules<TFieldValues, TName> => {
    const errors = errorMessagesRef.current;

    const getErrorMessage = (key: keyof FormDateControlErrorMessages, defaultValue: string) =>
      errors[key] ?? defaultValue;

    return {
      required: {
        value: required,
        message: getErrorMessage('required', 'You must enter a value.'),
      },
      validate: {
        valid: (value: Date | string | null) => {
          if (value == null) return undefined;

          // By the time the control validates, the input value from the field should have been converted into its
          // form value (as a string), so try to parse it using the form value's format. The 3rd argument is a
          // reference date which supplies missing parameters to the parsed date, eg. if the input format is 'MM/yy'
          // and the value is '08/20' then the parsed date will be '2000-08-20'. We don't care about what the actual
          // date value is, just that it can be parsed to something valid.
          //
          // If the supplied value is a Date, it means that it's a valid default value or invalid (because the control couldn't convert the
          // Date supplied by the MUI component into a string).
          const dateValue = value instanceof Date ? value : parse(value, formValueFormat, new Date('2000-01-01'));

          return !isValid(dateValue)
            ? getErrorMessage('valid', `The date must be in the format ${fieldValueFormat.toUpperCase()}.`)
            : undefined;
        },

        min: (value: Date | string | null) => {
          if (minDate == null || value == null) return undefined;

          const dateString = value instanceof Date ? format(value, formValueFormat) : value;

          return dateString < format(minDate, formValueFormat)
            ? getErrorMessage('min', `The date cannot be before ${format(minDate, fieldValueFormat)}.`)
            : undefined;
        },

        max: (value: Date | string | null) => {
          if (maxDate == null || value == null) return undefined;

          const dateString = value instanceof Date ? format(value, formValueFormat) : value;

          return dateString > format(maxDate, formValueFormat)
            ? getErrorMessage('max', `The date cannot be after ${format(maxDate, fieldValueFormat)}.`)
            : undefined;
        },
      },
    };
  }, [required, minDate, maxDate, fieldValueFormat, formValueFormat, errorMessagesRef]);

  const { validate: customValidate = {} } = customRules;

  return {
    ...inferredRules,
    validate: {
      ...inferredValidate,
      ...customValidate,
    },
  };
};

interface DateControlFormEventHandlers {
  handleChange: (value: Date | null) => void;
  handleBlur: (event: FocusEvent<HTMLInputElement>) => void;
}

export const useDateControlFormEventHandlers = (
  formValueFormat: string,
  onChange: (value: Date | string | null) => void,
  onBlur: () => void
): DateControlFormEventHandlers => {
  const onChangeRef = useLatest(onChange);
  const onBlurRef = useLatest(onBlur);

  return useMemo(() => {
    const handleChange = (value: Date | null) => {
      if (isValid(value)) {
        const formattedDateString = format(value as Date, formValueFormat);
        return onChangeRef.current(formattedDateString);
      } else {
        onChangeRef.current(value);
      }
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      const { value } = event.target;

      if (DATE_FORMAT_REGEX.test(value)) {
        onChangeRef.current(null);
      } else if (!VALID_DATE_REGEX.test(value)) {
        // If the field does not contain a valid date, then the MUI component will not have raised the 'onChange'
        // event, but we don't want to lose the value in the field eg. in the case of the user trying to save
        // a draft - even if that value isn't valid.
        onChangeRef.current(value);
      }

      onBlurRef.current();
    };

    return {
      handleChange,
      handleBlur,
    };
  }, [formValueFormat, onChangeRef, onBlurRef]);
};
