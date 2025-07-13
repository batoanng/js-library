import { StoryForm } from '@/form/stories';
import { FormCheckbox } from './FormCheckbox';

export default {
  title: 'Forms/Atoms/Checkbox',
  decorators: [],
};

interface TestFormValues {
  storyCheckbox: boolean;
}

export const Default = () => {
  return (
    <StoryForm>
      <FormCheckbox<TestFormValues> name="storyCheckbox" label="This is the label" />
    </StoryForm>
  );
};

export const Rules = () => {
  return (
    <StoryForm>
      <FormCheckbox<TestFormValues>
        name="storyCheckbox"
        label="This is the label"
        rules={{
          required: 'You must check me!',
        }}
      />
    </StoryForm>
  );
};
