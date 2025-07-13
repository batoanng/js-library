import type { ReactNode } from 'react';
import type { ControllerProps, FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { IconModalProps } from './components';

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

export type StatusVariant = 'error' | 'success' | 'warning' | 'info';

export interface FormOption<TValue = string, TLabel extends ReactNode = string> {
  value: TValue;
  label: TLabel;
  disabled?: boolean;
  helpMessage?: ReactNode;
}

export type OptionProps<TOption> = {
  getOptionKey?(option: TOption): string;
  getOptionLabel?(option: TOption): ReactNode;
  getOptionHelpMessage?(option: TOption): ReactNode;
  isOptionDisabled?(option: TOption): boolean;
};

export type OptionValueProps<TFormItemValue, TOption> = {
  getOptionValue?(option: TOption): TFormItemValue;
  areOptionValuesEqual?(left?: TFormItemValue | null, right?: TFormItemValue | null): boolean;
};

/**
 * Common props for controls that support a list of `options`.
 */
export type FormOptionsControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TFormItemValue = PathValue<TFieldValues, TName>,
  TOptionValue = PathValue<TFieldValues, TName>,
  TOption = FormOption<TOptionValue>
> = FormFieldProps<TFieldValues, TName> &
  OptionProps<TOption> &
  OptionValueProps<TFormItemValue, TOption> & {
    label: ReactNode;
    helpMessage?: ReactNode;
    disabled?: boolean;
    options: TOption[];
    infoTooltipProps?: IconModalProps;
  };
