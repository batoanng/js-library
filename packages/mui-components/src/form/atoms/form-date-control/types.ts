import type { FormFieldProps, FormFieldRules } from '@/types';
import type { ReactNode } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

/** The range of format templates that can be used for the on-screen field */
export const DateControlFieldValueFormats = ['dd/MM/yyyy', 'MM/yyyy'] as const;
/** The format template for the on-screen field */
export type DateControlFieldValueFormat = (typeof DateControlFieldValueFormats)[number];

/** The range of format templates that can be used for the value stored in the form */
export const DateControlFormValueFormats = ['yyyy-MM-dd', 'yyyy-MM'] as const;
/** The format template for the value stored in the form */
export type DateControlFormValueFormat = (typeof DateControlFormValueFormats)[number];

export type FormDateControlRules<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Pick<FormFieldRules<TFieldValues, TName>, 'validate'>;

export type FormDateControlErrorMessages = {
  /** The field is required but not value has been supplied. Defaults to 'You must enter a value.' */
  required?: string | undefined;

  /** The value is before the minimum allowed date. Defaults to 'The value cannot be before [min]' */
  min?: string | undefined;

  /** The value is after the maximum allowed date. Defaults to 'The value cannot be after [max]' */
  max?: string | undefined;

  /** The value is not a valid date. Defaults to 'Enter a date using the format [format]' */
  valid?: string | undefined;
};

export type FormDateControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<FormFieldProps<TFieldValues, TName>, 'rules'> & {
  rules?: FormDateControlRules<TFieldValues, TName>;
  helpMessage?: ReactNode;
  inputFormat?: string;
  errorMessages?: FormDateControlErrorMessages;
};
