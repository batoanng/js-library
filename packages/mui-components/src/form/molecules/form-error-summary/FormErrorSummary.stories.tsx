import { CustomizeErrorMessage, FormRadioGroup, FormSelect, FormTextArea, FormTextField } from '@/form';

import { FormErrorSummary } from './FormErrorSummary';
import { Divider, FormControlLabel, FormGroup, Stack, Switch, TextField, Typography } from '@mui/material';
import { useBoolean } from 'react-use';
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StoryForm } from '@/form/stories';

export default {
  title: 'Forms/Molecules/Error summary',
  decorators: [],
};

interface TestFormValues {
  firstName: string;
  lastName: string;
}

interface TestLongFormValues {
  firstName: string;
  lastName: string;
  email: string;
  organisation: string;
  phone: string;
  address: string;
  pants: string;
  shirt: string;
  dog: string;
  cat: string;
}

interface ManualErrorFormValues {
  errorMessage: string;
}

export const Default = () => {
  return (
    <StoryForm>
      <FormErrorSummary<TestFormValues> />

      <FormTextField
        id="firstName"
        name="firstName"
        label="First name"
        helpMessage="Enter your first name"
        rules={{
          required: 'You must enter your first name.',
        }}
      />

      <FormTextField
        id="lastName"
        name="lastName"
        label="Last name"
        helpMessage="Enter your last name"
        rules={{
          required: 'You must enter your last name.',
        }}
      />
    </StoryForm>
  );
};

export const CustomErrorMessages = () => {
  const getErrorMessage: CustomizeErrorMessage<TestFormValues> = (fieldName, errorType, errorMessage) => {
    switch (fieldName) {
      case 'firstName':
        return 'You are required to enter your first name.';
      case 'lastName':
        return 'You are required to enter your last name.';
    }

    return errorMessage;
  };

  return (
    <StoryForm>
      <FormErrorSummary<TestFormValues> getErrorMessage={getErrorMessage} />

      <FormTextField
        id="firstName"
        name="firstName"
        label="First name"
        helpMessage="Enter your first name"
        rules={{
          required: 'You must enter your first name.',
        }}
      />

      <FormTextField
        id="lastName"
        name="lastName"
        label="Last name"
        helpMessage="Enter your last name"
        rules={{
          required: 'You must enter your last name.',
        }}
      />
    </StoryForm>
  );
};

export const SingleError = () => {
  return (
    <StoryForm>
      <FormErrorSummary<TestFormValues> />

      <FormTextField
        id="firstName"
        name="firstName"
        label="First name"
        helpMessage="Enter your first name"
        rules={{
          required: 'You must enter your first name.',
        }}
      />
    </StoryForm>
  );
};

export const LargeForms = () => {
  return (
    <StoryForm>
      <FormErrorSummary<TestLongFormValues> scrollIntoView={'always'} />

      <FormTextField
        id="firstName"
        name="firstName"
        label="First name"
        helpMessage="Enter your first name"
        rules={{
          required: 'You must enter your first name.',
        }}
      />

      <FormTextField
        id="lastName"
        name="lastName"
        label="Last name"
        helpMessage="Enter your last name"
        rules={{
          required: 'You must enter your last name.',
        }}
      />

      <FormTextField
        id="email"
        name="email"
        label="Email"
        helpMessage="Enter your email"
        rules={{
          required: 'You must enter your email.',
        }}
      />

      <FormRadioGroup
        id="radio"
        name="radio"
        label="This is a radio"
        options={[
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ]}
        rules={{
          required: 'You must select an option.',
        }}
      />

      <FormSelect
        id="organisation"
        name="organisation"
        label="Organisation"
        helpMessage="Select an organisation"
        options={[
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ]}
        rules={{
          required: 'You must choose your organisation.',
        }}
      />

      <FormTextField
        id="phone"
        name="phone"
        label="Phone"
        helpMessage="Enter your phone"
        rules={{
          required: 'You must enter your phone.',
        }}
      />

      <FormTextField
        id="address"
        name="address"
        label="Address"
        helpMessage="Enter your address"
        rules={{
          required: 'You must enter your address.',
        }}
      />

      <FormTextField
        id="pants"
        name="pants"
        label="Pants"
        helpMessage="Enter your pants"
        rules={{
          required: 'You must enter your pants.',
        }}
      />

      <FormTextField
        id="shirt"
        name="shirt"
        label="Shirt"
        helpMessage="Enter your shirt"
        rules={{
          required: 'You must enter your shirt.',
        }}
      />

      <FormTextField
        id="dog"
        name="dog"
        label="Dog"
        helpMessage="Enter your dog"
        rules={{
          required: 'You must enter your dog.',
        }}
      />

      <FormTextArea
        id="comments"
        name="comments"
        label="Additional comments"
        rules={{
          required: 'You must enter your comments.',
        }}
      />
    </StoryForm>
  );
};

export const ShowImmediately = () => {
  const [showError, toggleShowError] = useBoolean(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const form = useForm<ManualErrorFormValues>();

  useEffect(() => {
    if (errorMessage) {
      form.setError('root.manualError', {
        type: 'manual',
        message: errorMessage,
      });
    } else {
      form.clearErrors('root.manualError');
    }
  }, [errorMessage, form]);

  const handleChange: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(e.target.value);
  };

  return (
    <FormProvider {...form}>
      <Stack
        direction="column"
        sx={{
          gap: 1,
        }}
      >
        <FormErrorSummary<TestFormValues> minSubmitCount={showError ? 0 : 1} />
        <TextField id="errorMessage" name="errorMessage" label="Error Message" onChange={handleChange} />
      </Stack>
      <Divider />
      <Typography variant="h3">
        Enter an error message and then toggle the switch to show / hide the FormErrorSummary
      </Typography>
      <FormGroup>
        <FormControlLabel control={<Switch checked={showError} onChange={toggleShowError} />} label="Show error" />
      </FormGroup>
    </FormProvider>
  );
};
