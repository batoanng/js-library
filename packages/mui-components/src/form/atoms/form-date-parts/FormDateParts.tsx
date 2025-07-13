import { useFieldErrorMessage, useHtmlId } from '@/hooks';
import { FormControl, FormHelperText, FormLabel, Stack } from '@mui/material';
import { useEffect, useRef } from 'react';
import { type FieldPath, type FieldValues, useController } from 'react-hook-form';

import { DatePartField } from './DatePartField';
import { useDatePartOptions, useValueFormatter, useValueParser } from './hooks';
import type { DateInParts, DatePart, FormDatePartsProps, MonthSelectInputProps } from './types';
import { MonthSelect } from './MonthSelect';
import { FormErrorText } from '@/components';

export const FormDateParts = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: FormDatePartsProps<TFieldValues, TName>
) => {
  const {
    id: suppliedId,
    name,
    label = '',
    helpMessage,
    errorMode,
    autoAdvance,
    showMonthNames,
    datePartOptions: suppliedDatePartOptions,
    className = '',
    rules: suppliedRules = {},
    shouldUnregister,
    inputProps = {},
    autoComplete,
  } = props;

  const id = useHtmlId('form-date-parts', suppliedId, name);
  const datePartOptions = useDatePartOptions(suppliedDatePartOptions);

  const { validate = {}, ...otherRules } = suppliedRules;
  const rules = {
    ...otherRules,
    validate: {
      ...validate,
      partialDate: validatePartialDate,
    },
  };

  const {
    field: { ref, name: fieldName, value: formValue = '', onChange, onBlur },
    fieldState,
  } = useController({
    name,
    rules,
    shouldUnregister,
  });

  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const parseValue = useValueParser(datePartOptions);
  const { dayValue, monthValue, yearValue } = parseValue(formValue);

  const formatValue = useValueFormatter(datePartOptions);

  // If the datePartOptions have changed, push through the value again in the new format.
  // This will also have the effect of triggering revalidation on the field.
  useEffect(() => {
    const nextValue = formatValue({ dayValue, monthValue, yearValue });
    if (nextValue !== formValue) {
      onChange(nextValue);
    }
  }, [dayValue, monthValue, yearValue, formatValue, formValue, onChange]);

  const handleValueChange = (inputValue: string, updatedPart: DatePart) => {
    // Get the digits from the input field, to trim out the separator if one has been entered.
    const valueMatch = /\d+/.exec(inputValue);
    const value = valueMatch?.length ? valueMatch[0] : '';

    const getNextValue = (part: DatePart, currentValue: string, padLength = 2) => {
      if (part !== updatedPart) {
        return currentValue ?? '';
      }

      // Allow the user to enter an empty string
      return value.length > 0 ? value.padStart(padLength, '0') : '';
    };

    const nextValue: DateInParts = {
      dayValue: getNextValue('day', dayValue),
      monthValue: getNextValue('month', monthValue),
      yearValue: getNextValue('year', yearValue, 4),
    };

    // Don't push the change through if the value hasn't actually changed
    if (nextValue.dayValue !== dayValue || nextValue.monthValue !== monthValue || nextValue.yearValue !== yearValue) {
      onChange(formatValue(nextValue));
    }

    // 'year' is the last input for the control, so we never need to auto-advance from that field.
    if (updatedPart === 'year') return;

    // Otherwise we want to auto-advance if the user has entered a separator (e.g. '1/'), or if auto-advance
    // is turned on and the field is now two digits long.
    const shouldAdvance = value !== inputValue || (autoAdvance && value.length == 2);
    if (!shouldAdvance) return;

    const nextInput = updatedPart === 'day' ? monthRef.current! : yearRef.current!;
    setTimeout(() => {
      nextInput.focus();
      nextInput.select?.();
    });
  };

  const handleChange = (part: DatePart) => (value: string) => handleValueChange(value, part);

  const errorMessage = useFieldErrorMessage(fieldName, errorMode);
  const hasError = fieldState.error != null;

  return (
    <FormControl id={id} error={hasError} className={className}>
      <FormLabel>{label}</FormLabel>
      <FormHelperText component="span">{helpMessage}</FormHelperText>
      <Stack sx={{ flexDirection: 'row', gap: 1, width: showMonthNames ? '23em' : '17em' }}>
        {datePartOptions.day !== 'hidden' && (
          <DatePartField
            {...(inputProps.day || {})}
            ref={ref}
            ownerId={id}
            name={fieldName}
            error={hasError}
            part="day"
            value={dayValue}
            autoComplete={autoComplete}
            onChange={handleChange('day')}
            onBlur={onBlur}
          />
        )}

        {datePartOptions.month !== 'hidden' && (
          <>
            {showMonthNames && (
              <MonthSelect
                {...((inputProps.month as MonthSelectInputProps) || {})}
                ref={datePartOptions.day === 'hidden' ? ref : monthRef}
                id={id}
                name={fieldName}
                error={hasError}
                value={monthValue}
                autoComplete={autoComplete}
                onChange={handleChange('month')}
                onBlur={onBlur}
              />
            )}

            {!showMonthNames && (
              <DatePartField
                {...(inputProps.month || {})}
                ref={datePartOptions.day === 'hidden' ? ref : monthRef}
                ownerId={id}
                name={fieldName}
                error={hasError}
                part="month"
                value={monthValue}
                autoComplete={autoComplete}
                onChange={handleChange('month')}
                onBlur={onBlur}
              />
            )}
          </>
        )}

        {datePartOptions.year !== 'hidden' && (
          <DatePartField
            {...(inputProps.year || {})}
            ref={yearRef}
            ownerId={id}
            name={fieldName}
            error={hasError}
            part="year"
            value={yearValue}
            autoComplete={autoComplete}
            onChange={handleChange('year')}
            onBlur={onBlur}
          />
        )}
      </Stack>
      {hasError ? <FormErrorText>{errorMessage}</FormErrorText> : null}
    </FormControl>
  );
};

function validatePartialDate(value?: string) {
  if (!value) return undefined;

  const [year = 2000, month = 1, day = 1] = value.split('-').map((value) => parseInt(value));

  if (month < 1 || month > 12) {
    return 'Enter a valid date. The month must be between 1 and 12.';
  }

  const date = new Date(year, month - 1, day);
  if (isNaN(date.valueOf())) return 'Enter a valid date.';
  if (date.getDate() !== day) return 'Enter a valid date. The day must be valid for the month and year.';

  return undefined;
}
