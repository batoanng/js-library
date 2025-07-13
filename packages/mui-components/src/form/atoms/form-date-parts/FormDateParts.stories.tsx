import type { FormOption } from '@/types';
import { Alert, Box, Stack } from '@mui/material';
import { useWatch } from 'react-hook-form';

import { FormDateParts } from './FormDateParts';
import { StoryForm } from '@/form/stories';
import { DatePartOptionality } from './types';
import { useDatePartOptions } from './hooks';
import { FormSelect } from '@/form';

export default {
  title: 'Forms/Atoms/Date parts',
  decorators: [],
};

interface TestFormValues {
  storyDate: string;
}

export const Default = () => {
  return (
    <StoryForm>
      <FormDateParts<TestFormValues> label="Date field" helpMessage="Please enter the date" name="storyDate" />
    </StoryForm>
  );
};

export const DefaultValue = () => {
  return (
    <StoryForm defaultValues={{ storyDate: '1980-01-02' }}>
      <FormDateParts<TestFormValues> label="Date field" helpMessage="Please enter the date" name="storyDate" />
    </StoryForm>
  );
};

export const AutoAdvance = () => {
  return (
    <StoryForm>
      <FormDateParts<TestFormValues>
        autoAdvance
        label="Date field"
        helpMessage="Enter two digits in day or month to automatically advance to the next field."
        name="storyDate"
      />
    </StoryForm>
  );
};

export const AutoAdvancePartial = () => {
  return (
    <StoryForm>
      <FormDateParts<TestFormValues>
        autoAdvance
        label="Date field"
        helpMessage="Enter a two-digit month to automatically advance to the year field."
        name="storyDate"
        datePartOptions={{ day: 'hidden' }}
      />
    </StoryForm>
  );
};

type PartialDateMonthYearFormValues = {
  day: DatePartOptionality;
  month: DatePartOptionality;
  year: DatePartOptionality;
};

const PARTIAL_DATE_MONTH_YEAR_FORM_DEFAULT_VALUES: PartialDateMonthYearFormValues = {
  day: 'optional',
  month: 'required',
  year: 'required',
};

const DatePartOptionalityFormOptions: FormOption<DatePartOptionality>[] = [
  { label: 'Required', value: 'required' },
  { label: 'Optional', value: 'optional' },
  { label: 'Hidden', value: 'hidden' },
];

const PartialDateMonthYearForm = () => {
  const [day, month, year] = useWatch({ name: ['day', 'month', 'year'] });

  const datePartOptions = { day, month, year };
  const { day: dayValidated, month: monthValidated, year: yearValidated } = useDatePartOptions(datePartOptions);
  const areOptionsValid = day === dayValidated && month === monthValidated && year === yearValidated;

  return (
    <>
      {!areOptionsValid && (
        <Alert variant="filled" severity="warning">
          The selected options combination is invalid. The control will operate as though all options are required.
        </Alert>
      )}
      <Stack
        sx={{
          my: 2,
          width: '23em',
        }}
      >
        <FormSelect<PartialDateMonthYearFormValues, 'day'>
          name="day"
          label="Day"
          options={DatePartOptionalityFormOptions}
        />

        <FormSelect<PartialDateMonthYearFormValues, 'month'>
          name="month"
          label="Month"
          options={DatePartOptionalityFormOptions}
        />

        <FormSelect<PartialDateMonthYearFormValues, 'year'>
          name="year"
          label="Year"
          options={DatePartOptionalityFormOptions}
        />
      </Stack>
      <Box
        sx={{
          my: 2,
        }}
      >
        <FormDateParts<TestFormValues>
          label="Date field"
          helpMessage="Please enter the month and year"
          name="storyDate"
          datePartOptions={datePartOptions}
        />
      </Box>
    </>
  );
};

export const PartialDateParts = () => {
  return (
    <StoryForm<PartialDateMonthYearFormValues> defaultValues={PARTIAL_DATE_MONTH_YEAR_FORM_DEFAULT_VALUES}>
      <PartialDateMonthYearForm />
    </StoryForm>
  );
};

export const Rules = () => {
  return (
    <StoryForm>
      <FormDateParts<TestFormValues>
        label="Date field"
        helpMessage="Please enter a date from this century"
        name="storyDate"
        datePartOptions={{ day: 'hidden' }}
        rules={{
          validate: {
            min: (formValue?: string) => {
              if (!formValue || formValue.length < 4) return undefined;

              const year = parseInt(formValue.slice(0, 4));
              if (isNaN(year)) return undefined;

              return year >= 2000 ? undefined : 'Enter a date from this century!';
            },
          },
        }}
      />
    </StoryForm>
  );
};

export const InputProps = () => {
  return (
    <StoryForm>
      <FormDateParts<TestFormValues>
        label="Date field"
        name="storyDate"
        inputProps={{
          day: {
            placeholder: 'dd',
            sx: {
              border: '1px solid orange',
            },
          },
        }}
      />
    </StoryForm>
  );
};

export const MonthNames = () => {
  return (
    <StoryForm>
      <FormDateParts<TestFormValues> autoAdvance showMonthNames label="Date field" name="storyDate" />
    </StoryForm>
  );
};

export const MonthNamesDefaultValues = () => {
  return (
    <StoryForm defaultValues={{ storyDate: '1980-10-25' }}>
      <FormDateParts<TestFormValues> autoAdvance showMonthNames label="Date field" name="storyDate" />
    </StoryForm>
  );
};

export const DisableAutoComplete = () => {
  return (
    <StoryForm>
      <FormDateParts<TestFormValues> autoComplete="off" label="Date field" name="storyDate" />
    </StoryForm>
  );
};
