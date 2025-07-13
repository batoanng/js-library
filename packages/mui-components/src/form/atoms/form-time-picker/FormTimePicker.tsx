import { TimePicker, TimePickerProps } from '@/components';
import { getMaxWidth } from '@/functions';
import { useFieldErrorMessage, useHtmlId } from '@/hooks';
import { FormFieldProps } from '@/types';
import { startOfDay } from 'date-fns';
import { useRef } from 'react';
import type { FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { useController } from 'react-hook-form';

// The props we propagate from the underlying input field.
type AllowedTimePickerProps = Omit<
  TimePickerProps,
  | 'errorMessage' // This gets calculated based on the form state
  | 'id' // This get specified via FormFieldProps
  | 'name' // This get specified via FormFieldProps
  | 'onChange' // This gets handled by the form; consumers can `useWatch` to get the underlying field value
  | 'ref' // The form's `ref` gets used instead
  | 'value'
>;

export type FormTimePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = FormFieldProps<TFieldValues, TName> & AllowedTimePickerProps;

export const FormTimePicker = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  id: suppliedId,
  name,
  errorMode,
  rules = {},
  shouldUnregister,
  defaultValue,
  inputWidth = 'xl',
  sx = {},
  ...muiProps
}: FormTimePickerProps<TFieldValues, TName>) => {
  const id = useHtmlId('form-text-field', suppliedId, name);

  const isInvalidRef = useRef(false);

  const {
    field: { name: fieldName, value, onChange, ...fieldProps },
  } = useController<TFieldValues, TName>({
    name,
    rules: {
      ...rules,
      validate: {
        ...rules?.validate,
        valid: () => (isInvalidRef.current ? 'Enter a valid time.' : undefined),
      },
    },
    defaultValue: defaultValue as PathValue<TFieldValues, TName>,
    shouldUnregister,
  });

  const fieldValue = convertToFieldValue(value);
  const handleChange = (nextValue?: Date | null) => {
    isInvalidRef.current = nextValue instanceof Date && isNaN(nextValue.valueOf());

    const formValue = convertToFormValue(nextValue, value);
    onChange(formValue);
  };

  const errorMessage = useFieldErrorMessage(fieldName, errorMode);

  return (
    <TimePicker
      {...muiProps}
      {...fieldProps}
      id={id}
      value={fieldValue}
      error={Boolean(errorMessage)}
      errorMessage={errorMessage}
      label={muiProps.label}
      sx={{
        maxWidth: getMaxWidth(inputWidth),
        ...sx,
      }}
      onChange={handleChange}
    />
  );
};

//////////

const MILLIS_PER_DAY = 1000 * 60 * 60 * 24;

const REFERENCE_DATE = '2025-10-25T';
const REFERENCE_DATE_MIDNIGHT = `${REFERENCE_DATE}00:00`;

/** Converts the value from the form into a Date that can be shown in the time picker */
function convertToFieldValue(value?: string | number | Date | null | unknown): Date | null {
  if (value == null) return null;
  if (value instanceof Date) return value;

  if (typeof value === 'string') {
    // The value has to be perfectly formatted, e.g. '22:15' - otherwise it won't parse.
    if (value.length === 5) {
      // We could use any date here as the date part is throwaway.
      return new Date(`${REFERENCE_DATE}${value}`);
    }

    // Any other non-empty string is an invalid time.
    if (value.length) {
      console.warn(`Invalid time '${value}'. Only ISO formatted 24 hour time strings are accepted (e.g. '08:15')`);
    }

    return null;
  }

  if (typeof value === 'number') {
    if (value === 0) return null;

    // If the value is bigger than the number of milliseconds in one day, then we will just guess that this represents
    // an entire date instance.
    if (value > MILLIS_PER_DAY) {
      return new Date(value);
    }

    // Otherwise, use a reference date, because if the value is 60000 (to represent 1 minute past midnight),
    // and we do 'new Date(value)', this equates to the UNIX epoch (1st Jan 1970 at midnight UTC) plus one minute -
    // which is 10:01 AM in non-daylight savings time in Sydney. This would result in us never being able to represent
    // a time earlier than 10 AM.
    const referenceDateMillis = new Date(REFERENCE_DATE_MIDNIGHT).valueOf();
    return new Date(referenceDateMillis + value);
  }

  console.warn(
    `Invalid time picker value: ${value}. The FormTimePicker only supports a Date, a string in 24 hour ISO format, or a number as epoch millis.`
  );

  return null;
}

/** Converts the Date from the time picker back to the type that was given to us by the form. */
function convertToFormValue(
  fieldValue?: Date | null,
  originalValue?: string | number | Date | null
): string | number | Date | null {
  if (originalValue instanceof Date) {
    return fieldValue ?? null;
  }

  if (fieldValue == null || isNaN(fieldValue.valueOf())) {
    return typeof originalValue === 'string' ? '' : 0;
  }

  if (typeof originalValue === 'number') {
    // If the original value didn't represent a date AND time, then the date that we'll get from the TimePicker will
    // be 'Today'; otherwise, just use the value of the selected date, as we presume that it was a whole date that was
    // passed to the component originally. Similarly, if the user is just typing in a value using the keyboard, then
    // the original value can come through as 'NaN'.
    return Number.isNaN(originalValue) || originalValue < MILLIS_PER_DAY
      ? fieldValue.valueOf() - startOfDay(fieldValue).valueOf()
      : fieldValue.valueOf();
  }

  return `${pad(fieldValue.getHours())}:${pad(fieldValue.getMinutes())}`;
}

function pad(value: number) {
  const valueString = value.toString();

  return value < 9 ? '0' + valueString : valueString;
}
