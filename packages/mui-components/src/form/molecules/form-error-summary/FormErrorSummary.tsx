import { List } from '@mui/material';
import { Notification } from '@/components';
import { useEffect, useRef } from 'react';
import type { FieldError, FieldErrorsImpl, FieldPath, FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { useBoolean, useLatest } from 'react-use';

import { FormErrorSummaryField } from './FormErrorSummaryField';
import { PageErrorMessage } from './PageErrorMessage';
import type {
  CustomizeErrorMessage,
  FormErrorSummaryProps,
  FormFieldError,
  ScrollIntoViewFrequency,
  ScrollIntoViewProps,
} from './types';

const DEFAULT_SCROLL_INTO_VIEW_OPTIONS: ScrollIntoViewOptions = {
  block: 'start',
  inline: 'start',
};

/**
 * Displays a summary of all the errors contained on a react-hook-form.
 */
export const FormErrorSummary = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  title,
  pageErrorMessage,
  minErrorCount = 1,
  getErrorMessage,
  scrollIntoView = 'never',
  minSubmitCount = 1,
}: FormErrorSummaryProps<TFieldValues, TName>) => {
  const scrollRef = useScrollIntoView(scrollIntoView, minErrorCount);

  const { formState } = useFormContext<TFieldValues>();
  const { errors, submitCount } = formState;

  if (submitCount < minSubmitCount) return null;

  const formErrors = extractFieldErrors<TFieldValues, TName>(errors, getErrorMessage);
  if (formErrors.length < minErrorCount) return null;

  const defaultSummaryTitle = `Your form has ${formErrors.length > 1 ? 'errors' : 'an error'}`;

  const summaryTitle = typeof title === 'function' ? title(formErrors) : title || defaultSummaryTitle;

  return (
    <Notification ref={scrollRef} notificationType="alert" alertVariant="error" title={summaryTitle}>
      <PageErrorMessage pageErrorMessage={pageErrorMessage} formErrors={formErrors} />

      <List component={'ol'} sx={{ m: 0, py: 1, pl: 4, listStyle: 'decimal' }}>
        {formErrors.map((err) => (
          <FormErrorSummaryField key={`${err.fieldName}_${err.type}`} {...err} />
        ))}
      </List>
    </Notification>
  );
};

const isFieldError = (error: unknown): error is FieldError =>
  (error != null && typeof error === 'object' && Object.hasOwn(error, 'type')) || false;

const getDefaultErrorMessage: CustomizeErrorMessage = (fieldName, errorType, errorMessage) => errorMessage;

function extractFieldErrors<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  errors: FieldErrorsImpl<TFieldValues>,
  getErrorMessage?: CustomizeErrorMessage<TFieldValues, TName>,
  parentPath?: string
): FormFieldError[] {
  if (!errors) return [];

  return Object.keys(errors).reduce((formErrors: FormFieldError[], key) => {
    const fieldName = parentPath ? `${parentPath}.${key}` : key;
    const value = errors[key];

    if (isFieldError(value)) {
      const { ref, type, message } = value;

      formErrors.push({
        fieldName,
        fieldRef: ref,
        type,
        message:
          getErrorMessage?.(fieldName as TName, type, message) ??
          getDefaultErrorMessage(fieldName, type, message) ??
          'Error',
      });
    } else {
      formErrors.push(...extractFieldErrors(value as FieldErrorsImpl<TFieldValues>, getErrorMessage, fieldName));
    }

    return formErrors;
  }, []);
}

function useScrollIntoView(scrollIntoView: ScrollIntoViewFrequency | ScrollIntoViewProps = 'never', minErrorCount = 1) {
  const { formState } = useFormContext();
  const { errors, submitCount } = formState;

  const frequency = typeof scrollIntoView === 'string' ? scrollIntoView : scrollIntoView.frequency;
  const optionsRef = useLatest(
    typeof scrollIntoView !== 'object'
      ? DEFAULT_SCROLL_INTO_VIEW_OPTIONS
      : { ...DEFAULT_SCROLL_INTO_VIEW_OPTIONS, ...scrollIntoView.options }
  );

  const [scrollEnabled, toggleScrollEnabled] = useBoolean(frequency !== 'never');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollEnabled && errors && Object.keys(errors).length >= minErrorCount && submitCount > 0) {
      ref.current?.scrollIntoView(optionsRef.current);

      if (frequency === 'once') {
        toggleScrollEnabled(false);
      }
    }
  }, [frequency, optionsRef, errors, minErrorCount, submitCount, scrollEnabled, toggleScrollEnabled]);

  return ref;
}
