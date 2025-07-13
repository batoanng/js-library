import { StoryForm } from '@/form/stories';
import { FormTextArea } from './FormTextArea';

export default {
  title: 'Forms/Atoms/Text area',
  decorators: [],
};

interface TestFormValues {
  storyText: string;
}

export const Default = () => {
  return (
    <StoryForm>
      <FormTextArea<TestFormValues>
        name="storyText"
        label="Tell me a story!"
        helpMessage="You can write whatever you like"
        minRows={3}
        maxLength={1000}
        placeholder="Once upon a time..."
      />
    </StoryForm>
  );
};

export const Rules = () => {
  return (
    <StoryForm>
      <FormTextArea<TestFormValues>
        name="storyText"
        label="Tell me a story!"
        helpMessage="You can write whatever you like"
        minRows={3}
        maxLength={1000}
        placeholder="Once upon a time..."
        rules={{
          required: 'You must tell me a story!',
          pattern: {
            value: /^[^aeiou]+$/i,
            message: 'Your story cannot contain any vowels.',
          },
          minLength: {
            value: 50,
            message: 'That story is too short, it needs to be at least 50 characters.',
          },
        }}
      />
    </StoryForm>
  );
};
