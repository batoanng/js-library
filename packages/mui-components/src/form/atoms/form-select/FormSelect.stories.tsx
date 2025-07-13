import type { FormOption } from '@/types';
import BikeScooterIcon from '@mui/icons-material/BikeScooter';
import { Stack } from '@mui/material';

import { FormSelect } from './FormSelect';
import { StoryForm } from '@/form/stories';
import { useScreenType } from '@/hooks';

export default {
  title: 'Forms/Atoms/Select',
  decorators: [],
};

interface TestFormValues {
  storySelect: string;
}

const options: FormOption[] = [
  { label: 'Option 1', value: 'op1' },
  { label: 'Option 2', value: 'op2' },
];

export const Default = () => {
  return (
    <StoryForm>
      <Stack sx={{ gap: 2 }}>
        <FormSelect<TestFormValues, 'storySelect'>
          fullWidth
          id="form-select-default"
          name="storySelect"
          label="Select"
          options={options}
        />

        <FormSelect<TestFormValues, 'storySelect'>
          native
          fullWidth
          id="form-select-default-native"
          name="storySelect"
          label="Native Select"
          options={options}
        />
      </Stack>
    </StoryForm>
  );
};

export const NativeMobile = () => {
  const screenType = useScreenType();
  const label = screenType.isMobile ? 'Native Select' : 'Select';

  return (
    <StoryForm>
      <FormSelect<TestFormValues, 'storySelect'>
        fullWidth
        id="form-select-native-mobile"
        native="mobile"
        name="storySelect"
        label={label}
        options={options}
        rules={{
          required: 'You must select me!',
        }}
      />
    </StoryForm>
  );
};

export const Rules = () => {
  return (
    <StoryForm>
      <Stack sx={{ gap: 2 }}>
        <FormSelect<TestFormValues, 'storySelect'>
          fullWidth
          id="form-select-rules"
          name="storySelect"
          label="Select"
          options={options}
          rules={{
            required: 'You must select me!',
          }}
        />

        <FormSelect<TestFormValues, 'storySelect'>
          native
          fullWidth
          id="form-select-rules-native"
          name="storySelect"
          label="Native Select"
          options={options}
          rules={{
            required: 'You must select me!',
          }}
        />
      </Stack>
    </StoryForm>
  );
};

export const Customisable = () => {
  return (
    <StoryForm defaultValues={{ storySelect: 'op1' }}>
      <Stack sx={{ gap: 2 }}>
        <FormSelect<TestFormValues, 'storySelect'>
          alwaysShowEmptyValue
          fullWidth
          id="form-select-customisable"
          name="storySelect"
          label="Select"
          emptyValueLabel="Custom empty value label"
          IconComponent={BikeScooterIcon}
          options={options}
          inputWidth="md"
        />

        <FormSelect<TestFormValues, 'storySelect'>
          native
          alwaysShowEmptyValue
          fullWidth
          id="form-select-customisable-native"
          name="storySelect"
          label="Native Select"
          emptyValueLabel="Custom empty value label"
          IconComponent={BikeScooterIcon}
          options={options}
          inputWidth="xl"
        />
      </Stack>
    </StoryForm>
  );
};

export const HelpMessages = () => {
  const helpMessages: FormOption[] = [
    { label: 'Option 1', value: 'op1', helpMessage: 'Help Message for Option 1' },
    { label: 'Option 2', value: 'op2', helpMessage: 'Help Message for Option 2' },
  ];

  return (
    <StoryForm>
      <FormSelect<TestFormValues, 'storySelect'>
        fullWidth
        id="form-select-help-messages"
        name="storySelect"
        label="Select"
        options={helpMessages}
      />
    </StoryForm>
  );
};

export const DisabledOptions = () => {
  const disableOptions: FormOption[] = [
    { label: 'Option 1', value: 'op1', disabled: true },
    { label: 'Option 2', value: 'op2' },
  ];

  return (
    <StoryForm>
      <FormSelect<TestFormValues, 'storySelect'>
        fullWidth
        id="form-select-disabled-options"
        name="storySelect"
        label="Select"
        options={disableOptions}
      />
    </StoryForm>
  );
};

interface Course {
  id: number;
  description: string;
}

type ComplexFormValues = {
  storySelect: Course;
};

export const ComplexSelect = () => {
  const courses = [...new Array(5)].map((_, index) => ({
    id: 100 + index + 1,
    description: `Business course 10${index + 1}`,
  }));

  const options: FormOption<Course>[] = courses.map((course) => ({ label: course.description, value: course }));
  const areEqual = (left: Course, right: Course) => left.id === right.id;

  return (
    <StoryForm<ComplexFormValues> showStateSubmitCount={0} defaultValues={{ storySelect: courses[1] }}>
      <Stack sx={{ gap: 2 }}>
        <FormSelect<ComplexFormValues, 'storySelect'>
          alwaysShowEmptyValue
          fullWidth
          id="form-select-complex-select"
          name="storySelect"
          label="Select"
          emptyValueLabel="Please select"
          options={options}
          areOptionValuesEqual={areEqual}
          rules={{
            required: 'You must select me!',
          }}
        />

        <FormSelect<ComplexFormValues, 'storySelect'>
          native
          alwaysShowEmptyValue
          fullWidth
          id="form-select-complex-select-native"
          name="storySelect"
          label="Native Select"
          emptyValueLabel="Please select"
          options={options}
          areOptionValuesEqual={areEqual}
          rules={{
            required: 'You must select me!',
          }}
        />
      </Stack>
    </StoryForm>
  );
};

export const NoEmptyOption = () => {
  return (
    <StoryForm>
      <Stack sx={{ gap: 2 }}>
        <FormSelect<TestFormValues, 'storySelect'>
          fullWidth
          id="form-select-no-empty-option"
          name="storySelect"
          label="Select"
          emptyValueLabel={null}
          options={options}
        />

        <FormSelect<TestFormValues, 'storySelect'>
          native
          fullWidth
          id="form-select-no-empty-option-native"
          name="storySelect"
          label="Native Select"
          emptyValueLabel={null}
          options={options}
        />
      </Stack>
    </StoryForm>
  );
};
