import { StoryForm } from '@/form/stories';
import { FormSwitch } from './FormSwitch';

export default {
  title: 'Forms/Atoms/Switch',
  decorators: [],
};

interface TestFormValues {
  storySwitch: boolean;
}

export const Default = () => {
  return (
    <StoryForm>
      <FormSwitch<TestFormValues> name="storySwitch" label="This is the label" />
    </StoryForm>
  );
};

export const Rules = () => {
  return (
    <StoryForm>
      <FormSwitch<TestFormValues>
        name="storySwitch"
        label="This is the label"
        rules={{
          required: 'You must check me!',
        }}
      />
    </StoryForm>
  );
};
