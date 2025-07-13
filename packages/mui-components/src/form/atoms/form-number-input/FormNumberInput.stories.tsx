import { StoryForm } from '@/form/stories';
import { FormNumberInput } from './FormNumberInput';

export default {
  title: 'Forms/Atoms/Number Input',
  decorators: [],
};

interface TestFormValues {
  numberField: number;
}

export const Default = () => {
  return (
    <StoryForm>
      <FormNumberInput<TestFormValues> optional name="numberField" label="Number Field" helpMessage="Helper message" />
    </StoryForm>
  );
};

export const Rules = () => {
  return (
    <StoryForm>
      <FormNumberInput<TestFormValues>
        name="numberField"
        label="Number Field"
        helpMessage="Helper message"
        min={0}
        max={15}
        step={3}
        rules={{
          required: 'This field is required.',
        }}
      />
    </StoryForm>
  );
};
