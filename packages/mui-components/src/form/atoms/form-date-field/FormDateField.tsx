import { useFieldErrorMessage, useHtmlId } from '@/hooks';
import { FormControl, FormHelperText, FormLabel } from '@mui/material';
import type { DateFieldProps } from '@mui/x-date-pickers';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

import type { FormDateControlProps } from '../form-date-control';
import {
  getDateControlFieldValue,
  getDateControlFieldValueFormat,
  getDateControlFormValueFormat,
  useDateControlFormEventHandlers,
  useDateControlRules,
} from '../form-date-control';
import { InputWidthVariant, getMaxWidth } from '@/functions';
import { FormErrorText } from '@/components';

export type FormDateFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = FormDateControlProps<TFieldValues, TName> &
  Omit<DateFieldProps<Date>, 'format' | 'margin' | 'focused' | 'hiddenLabel' | 'optional' | 'value'> & {
    inputWidth?: InputWidthVariant;
  };

export const FormDateField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: FormDateFieldProps<TFieldValues, TName>
) => {
  const {
    id: suppliedId,
    name,
    label,
    helpMessage,
    required = false,
    errorMode,
    className,
    rules: suppliedRules,
    shouldUnregister,
    inputFormat: suppliedInputFormat = 'dd/MM/yyyy',
    minDate,
    maxDate,
    errorMessages,
    inputWidth,
    ...inputProps
  } = props;

  const id = useHtmlId('date-field', suppliedId, name);
  const fieldValueFormat = getDateControlFieldValueFormat(suppliedInputFormat);
  const formValueFormat = getDateControlFormValueFormat(fieldValueFormat);

  const rules = useDateControlRules(
    suppliedRules,
    required,
    minDate,
    maxDate,
    fieldValueFormat,
    formValueFormat,
    errorMessages
  );

  const {
    field: { ref, name: fieldName, value: formValue, onChange, onBlur },
    fieldState,
  } = useController({
    name,
    rules,
    shouldUnregister,
  });

  const fieldValue = getDateControlFieldValue(formValue, formValueFormat);
  const { handleChange, handleBlur } = useDateControlFormEventHandlers(formValueFormat, onChange, onBlur);

  const errorMessage = useFieldErrorMessage(fieldName, errorMode);
  const hasError = fieldState.error != null;

  const classNames = ['date-field', `date-format-${formValueFormat}`.toLowerCase(), className]
    .filter(Boolean)
    .join(' ');

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl error={hasError}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
        <FormHelperText component="span">{helpMessage}</FormHelperText>
        <DateField
          {...inputProps}
          id={id}
          name={fieldName}
          value={fieldValue || null}
          format={fieldValueFormat}
          className={classNames}
          slotProps={{
            input: {
              error: hasError,
            },
          }}
          inputRef={ref}
          sx={inputWidth && { maxWidth: getMaxWidth(inputWidth) }}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {hasError ? <FormErrorText>{errorMessage}</FormErrorText> : null}
      </FormControl>
    </LocalizationProvider>
  );
};
