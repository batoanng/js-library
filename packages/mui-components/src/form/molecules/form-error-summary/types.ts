import type { ReactElement } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

export type ScrollIntoViewFrequency = 'never' | 'once' | 'always';

export type ScrollIntoViewProps = {
  frequency: ScrollIntoViewFrequency;
  options?: ScrollIntoViewOptions;
};

export interface FormErrorSummaryProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  /**
   * The title to show in the component. Defaults to `Your form has errors`.
   * can have a function that takes errors as a parameter and returns a string
   */
  title?: string | ((errors: FormFieldError[]) => string);

  /**
   * An optional "overall" page error message to display whenever the there are field errors.
   */
  pageErrorMessage?: ReactElement | ((errors: FormFieldError[]) => ReactElement | null);

  /**
   * Minimum number of errors required on the form before the error summary is displayed. Defaults to `1`.
   */
  minErrorCount?: number;

  /**
   * Custom function to invoke to allow overriding the error from the field.
   *
   * @param fieldName The field in error.
   * @param errorType The error type (dictated by the rules for the field).
   * @param errorMessage The message shown within the form.
   *
   * @returns An overridden error message to use, or `null | undefined` if the error should not be shown.
   */
  getErrorMessage?: CustomizeErrorMessage<TFieldValues, TName>;

  /**
   * Allows for the error summary component to be scrolled to
   *
   * 'always' will scroll to on every submit
   * 'once' will scroll only the first time you click submit
   * 'never' will never scroll to the error summary and is the default
   */
  scrollIntoView?: ScrollIntoViewFrequency | ScrollIntoViewProps;

  /**
   * The FormErrorSummary won't generally show unless there has been at
   * least one attempt to submit the form. This property allows that
   * functionality to be overridden.
   *
   * Defaults to one to require at least one submission before displaying
   * the FormErrorSummary. Set to 0 to show the FormErrorSummary the moment
   * there is an error. Set to a value > 1 if you want to hide the FormErrorSummary
   * until at least minSubmitCount number of a submission attempts.
   */
  minSubmitCount?: number;
}

export interface FormFieldError {
  fieldRef?: unknown;
  fieldName: string;
  type: string;
  message: string;
}

export type CustomizeErrorMessage<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = (fieldName: TName, errorType: string, errorMessage?: string) => string | undefined;
