import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

/** Should the field show errors as soon as the field has been touched, or wait until the form has been submitted? */
export type ErrorMode = 'immediate' | 'onSubmit';

export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Pick<ControllerProps<TFieldValues, TName>, 'name' | 'rules' | 'shouldUnregister'> & {
  id?: string;
  errorMode?: ErrorMode;
};

export const TextFieldTypes = {
  TEXT: 'text',
  EMAIL: 'email',
  PASSWORD: 'password',
  NUMBER: 'number',
  TEL: 'tel',
  URL: 'url',
};
