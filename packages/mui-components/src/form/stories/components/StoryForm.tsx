import { Box, Button } from '@mui/material';
import type { PropsWithChildren } from 'react';
import type { DefaultValues, FieldValues, SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import { FormState } from './FormState';

export interface StoryFormProps<TFormValues extends FieldValues = FieldValues> {
  defaultValues?: DefaultValues<TFormValues>;
  onSubmit?: SubmitHandler<TFormValues>;
  hideState?: boolean;
  showStateSubmitCount?: number;
}

export const StoryForm = <TFormValues extends FieldValues = FieldValues>({
  defaultValues,
  onSubmit,
  hideState,
  showStateSubmitCount = 1,
  children,
}: PropsWithChildren<StoryFormProps<TFormValues>>) => {
  const form = useForm<TFormValues>({
    defaultValues: defaultValues,
  });

  const handleSubmit = (formValues: TFormValues) => {
    onSubmit?.(formValues);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {children}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" color="secondary" type="submit">
            Submit
          </Button>
        </Box>
      </form>

      {!hideState && form.formState.submitCount >= showStateSubmitCount && <FormState />}
    </FormProvider>
  );
};
