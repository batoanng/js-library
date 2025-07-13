import { format } from 'date-fns';

import { FormDatePicker } from './FormDatePicker';
import { StoryForm } from '@/form/stories';
import { FormDateControlErrorMessages } from '@/form';

export default {
  title: 'Forms/Atoms/Date picker',
  decorators: [],
};

interface TestFormValues {
  storyDate: Date | null;
}

export const Default = () => {
  return (
    <StoryForm>
      <FormDatePicker<TestFormValues>
        label="Date picker"
        helpMessage="Please enter the date"
        name="storyDate"
        inputFormat="dd/MM/yyyy"
      />
    </StoryForm>
  );
};

export const Rules = () => {
  return (
    <StoryForm>
      <FormDatePicker<TestFormValues>
        required
        label="Date field"
        helpMessage="Please enter the date"
        name="storyDate"
        inputFormat="dd/MM/yyyy"
      />
    </StoryForm>
  );
};

export const MinMaxValidation = () => {
  const maxDate = new Date('2030-01-01');
  const minDate = new Date(new Date().getFullYear(), 0, 1);
  const helpMessage = `Date must be between ${format(minDate, 'dd/MM/yyyy')} and ${format(maxDate, 'dd/MM/yyyy')}`;

  const errorMessages: FormDateControlErrorMessages = {
    required: 'Custom required error message.',
    max: 'The date cannot be in the future.',
  };

  return (
    <StoryForm>
      <FormDatePicker<TestFormValues>
        required
        label="Date field"
        helpMessage={helpMessage}
        name="storyDate"
        inputFormat="dd/MM/yyyy"
        maxDate={maxDate}
        minDate={minDate}
        errorMessages={errorMessages}
      />
    </StoryForm>
  );
};

export const CustomPlaceholder = () => {
  return (
    <StoryForm>
      <FormDatePicker<TestFormValues>
        label="Date picker"
        helpMessage="Please enter the date"
        name="storyDate"
        inputFormat="dd/MM/yyyy"
        placeholder="custom"
        inputWidth="md"
      />
    </StoryForm>
  );
};
