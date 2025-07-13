import type { FormErrorSummaryProps, FormFieldError } from './types';

interface Props {
  pageErrorMessage: FormErrorSummaryProps['pageErrorMessage'];
  formErrors: FormFieldError[];
}

export const PageErrorMessage = ({ pageErrorMessage, formErrors }: Props) => {
  if (pageErrorMessage) {
    return (typeof pageErrorMessage === 'function' ? pageErrorMessage(formErrors) : pageErrorMessage) ?? null;
  }

  const errorMessage = formErrors.length > 1 ? `Check the ${formErrors.length} errors:` : `Check the error:`;

  return <>{errorMessage}</>;
};
