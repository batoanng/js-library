import { replaceIntlDialingPrefixAu } from '@/functions';
import { TextInput, type TextInputProps } from '@/components';
import type { FocusEventHandler } from 'react';
import type { FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { useFieldErrorMessage, useHtmlId } from '@/hooks';
import { TextFieldTypes, FormFieldProps } from '@/types';

export type TransformProps<T> = {
  input?: (value: T) => string;
  output?: (value: string) => T;
};

// The props we propagate from the underlying input field.
type AllowedTextInputProps = Omit<
  TextInputProps,
  | 'errorMessage' // This gets calculated based on the form state
  | 'id' // This get specified via FormFieldProps
  | 'name' // This get specified via FormFieldProps
  | 'onChange' // This gets handled by the form; consumers can `useWatch` to get the underlying field value
  | 'ref' // The form's `ref` gets used instead
>;

export type FormTextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransform = string
> = FormFieldProps<TFieldValues, TName> &
  AllowedTextInputProps & {
    showOptionalText?: boolean;
    /**
     * Optional transformation functions for input and output values:
     * - `input`: Converts the form's value to a string.
     * - `output`: Converts the input string back to the desired format.
     */
    transform?: TransformProps<TTransform>;
  };

export const FormTextField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransform = string
>({
  id: suppliedId,
  name,
  onBlur,
  errorMode,
  rules,
  shouldUnregister,
  showOptionalText = false,
  defaultValue,
  transform,
  ...muiProps
}: FormTextFieldProps<TFieldValues, TName, TTransform>) => {
  const id = useHtmlId('form-text-field', suppliedId, name);

  const fieldType = muiProps.inputProps?.type || 'text';

  const {
    field: { onBlur: onFormFieldBlur, name: fieldName, value, onChange, ...fieldProps },
  } = useController<TFieldValues, TName>({
    name,
    rules,
    defaultValue: defaultValue as PathValue<TFieldValues, TName>,
    shouldUnregister,
  });

  const errorMessage = useFieldErrorMessage(fieldName, errorMode);

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    const trimmedValue = e.target.value.trim();
    if (e.target.value !== trimmedValue) onChange(trimmedValue as TTransform);

    // For the phone field
    if (fieldType === TextFieldTypes.TEL) {
      const replacedValue = replaceIntlDialingPrefixAu(trimmedValue);
      if (trimmedValue !== replacedValue) onChange(replacedValue);
    }

    // Propagate
    onFormFieldBlur();
    onBlur?.(e);
  };

  const displayValue = transform?.input ? transform.input(value) : value;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = transform?.output ? transform.output(e.target.value) : e.target.value;
    onChange(newValue);
  };

  return (
    <TextInput
      {...muiProps}
      {...fieldProps}
      id={id}
      value={displayValue ?? ''}
      error={errorMessage != null}
      errorMessage={errorMessage}
      label={showOptionalText ? muiProps.label + ' (optional)' : muiProps.label}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};
