import { parse } from 'date-fns';
import { useCallback } from 'react';

import { FormDateField } from './FormDateField';
import { StoryForm } from '@/form/stories';

export default {
  title: 'Forms/Atoms/Date field',
  decorators: [],
};

interface TestFormValues {
  storyDate: Date;
}

export const Default = () => {
  return (
    <StoryForm>
      <FormDateField<TestFormValues> label="Date field" helpMessage="Please enter the date" name="storyDate" />
    </StoryForm>
  );
};

export const Rules = () => {
  return (
    <StoryForm>
      <FormDateField<TestFormValues> required label="Date field" helpMessage="Please enter the date" name="storyDate" />
    </StoryForm>
  );
};

export const MinMaxValidation = () => {
  return (
    <StoryForm>
      <FormDateField<TestFormValues>
        required
        label="Date field"
        helpMessage="Min date is 01/01/2000"
        name="storyDate"
        minDate={new Date('2000-01-01')}
        maxDate={new Date()}
        errorMessages={{
          min: 'Custom error for min value',
          max: 'Custom error for max value',
        }}
      />
    </StoryForm>
  );
};

export const MonthAnd4DigitYear = () => {
  return (
    <StoryForm>
      <FormDateField<TestFormValues>
        label="Date field"
        helpMessage="Please enter the date"
        name="storyDate"
        inputFormat="MM/yyyy"
      />
    </StoryForm>
  );
};

export const CustomValidation = () => {
  const validate25 = useCallback((value: Date | string | null) => {
    if (typeof value === 'string') {
      const date = parse(value, 'yyyy-MM-dd', new Date());
      if (date.getDate() === 25) return undefined;
    }

    return 'The day of the month must be the 25th.';
  }, []);

  return (
    <StoryForm>
      <FormDateField<TestFormValues>
        label="Date field"
        helpMessage="Please enter the date"
        name="storyDate"
        minDate={new Date('2000-10-25')}
        rules={{
          validate: {
            twentyFive: validate25,
          },
        }}
      />
    </StoryForm>
  );
};
