import { Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { startOfDay } from 'date-fns';
import { PropsWithChildren } from 'react';
import { FieldValues, useWatch } from 'react-hook-form';

import { FormTimePicker } from './FormTimePicker';
import { StoryForm, StoryFormProps } from '@/form/stories';
import { InputWidthVariant } from '@/functions';
import { FormSelect } from '@/form';

export default {
  title: 'Forms/Atoms/Time picker',
  decorators: [],
};

interface TestFormValues {
  timeField: string;
}

const TimePickerStoryForm = <TFormValues extends FieldValues = FieldValues>(
  props: PropsWithChildren<StoryFormProps<TFormValues>>
) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <StoryForm {...props} />
  </LocalizationProvider>
);

export const StringValue = () => {
  return (
    <TimePickerStoryForm defaultValues={{ timeField: '' }}>
      <FormTimePicker<TestFormValues>
        name="timeField"
        label="Time Field"
        helpMessage="This time field will be stored as a string."
      />
    </TimePickerStoryForm>
  );
};

export const NumberValue = () => {
  return (
    <TimePickerStoryForm defaultValues={{ timeField: 0 }}>
      <FormTimePicker<TestFormValues>
        name="timeField"
        label="Time Field"
        helpMessage="This time field will be stored as a number."
      />
    </TimePickerStoryForm>
  );
};

export const NumberDateValue = () => {
  const defaultValue = new Date('2020-10-25T10:15+10:00').valueOf();

  return (
    <TimePickerStoryForm defaultValues={{ timeField: defaultValue }}>
      <FormTimePicker<TestFormValues>
        name="timeField"
        label="Time Field"
        helpMessage="This time field will be stored as a number, representing epoch millis."
      />
    </TimePickerStoryForm>
  );
};

export const DateValue = () => {
  return (
    <TimePickerStoryForm defaultValues={{ timeField: startOfDay(new Date()) }}>
      <FormTimePicker<TestFormValues>
        name="timeField"
        label="Time Field"
        helpMessage="This time field will be stored as a Date."
      />
    </TimePickerStoryForm>
  );
};

type InputWidthFormValues = TestFormValues & { inputWidth: string };

const InputWidthForm = () => {
  const options = ['xs', 'sm', 'md', 'lg']
    .map((width) => ({ label: width, value: width }))
    .concat([{ label: 'xl (default)', value: 'xl' }]);

  const inputWidth = useWatch<InputWidthFormValues, 'inputWidth'>({ name: 'inputWidth' }) as InputWidthVariant;

  return (
    <Stack
      sx={{
        gap: 3,
      }}
    >
      <FormSelect<InputWidthFormValues, 'inputWidth', string>
        id="inputWidth"
        name="inputWidth"
        label="Input width"
        options={options}
      />
      <FormTimePicker<TestFormValues>
        name="timeField"
        label="Time Field"
        helpMessage="This time field will be stored as a string."
        inputWidth={inputWidth}
      />
    </Stack>
  );
};

export const InputWidth = () => {
  return (
    <TimePickerStoryForm<InputWidthFormValues> defaultValues={{ timeField: '', inputWidth: 'xl' }}>
      <InputWidthForm />
    </TimePickerStoryForm>
  );
};

export const Rules = () => {
  return (
    <TimePickerStoryForm<InputWidthFormValues>>
      <FormTimePicker<TestFormValues>
        name="timeField"
        label="Time Field"
        helpMessage="This time field is mandatory."
        rules={{
          required: 'You must enter a time.',
        }}
      />
    </TimePickerStoryForm>
  );
};
