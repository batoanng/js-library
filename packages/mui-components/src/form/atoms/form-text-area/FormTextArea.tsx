import { TextArea, type TextAreaProps } from '@/components';
import { useFieldErrorMessage, useHtmlId } from '@/hooks';
import { FormFieldProps } from '@/types';
import type { FocusEventHandler } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';

export type FormTextAreaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = FormFieldProps<TFieldValues, TName> &
  Omit<TextAreaProps, 'id' | 'name' | 'ref' | 'hasError' | 'onChange' | 'value' | 'defaultValue'> & {
    required?: boolean;
    optional?: boolean;
  };

export const FormTextArea = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: FormTextAreaProps<TFieldValues, TName>
) => {
  const { id: suppliedId, name, rules, errorMode, shouldUnregister, ...muiProps } = props;
  const { trigger } = useFormContext();

  const id = useHtmlId('form-text-area', suppliedId, name);

  const {
    field: { name: fieldName, onChange, onBlur, value, ...fieldProps },
  } = useController({
    name,
    rules,
    shouldUnregister,
  });

  const errorMessage = useFieldErrorMessage(fieldName, errorMode);

  const handleBlur: FocusEventHandler<HTMLTextAreaElement> = async (e) => {
    const trimmedValue = e.target.value.trim();
    if (e.target.value !== trimmedValue) {
      onChange(trimmedValue);

      if (errorMode === 'immediate') {
        await trigger(fieldName);
      }
    }

    onBlur();
  };

  return (
    <TextArea
      {...muiProps}
      {...fieldProps}
      id={id}
      value={value ?? ''}
      errorMessage={errorMessage}
      onChange={onChange}
      onBlur={handleBlur}
    />
  );
};
