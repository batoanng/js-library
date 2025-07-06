import { StoryForm } from '@/form/stories';

import { FormTextField } from './FormTextField';
  
export default {
  title: 'Forms/Text field',
  decorators: [],
};
 
interface TestFormValues {
  textField: string;
}

export const Default = () => {
  return (
    <StoryForm>
      <FormTextField<TestFormValues>
        showOptionalText
        name="textField"
        label="Text Field"
        helpMessage="Helper message"
        placeholder="Add helper text here.."
      />
    </StoryForm>
  );
};

export const Rules = () => {
  return (
    <StoryForm>
      <FormTextField<TestFormValues>
        name="textField"
        label="Text Field"
        helpMessage="Helper message"
        placeholder="Add helper text here..."
        rules={{
          required: 'This is required',
          minLength: {
            value: 2,
            message: 'Minimum 2 characters required',
          },
        }}
      />
    </StoryForm>
  );
};

export const PhoneNumberField = () => {
  return (
    <StoryForm>
      <FormTextField<TestFormValues>
        showOptionalText
        inputProps={{ type: 'tel' }}
        name="textField"
        label="Phone number"
        helpMessage="enter a number starting with +61"
        placeholder="+610414234111"
      />
    </StoryForm>
  );
};

export const NormalFormTextWithDefaultValue = () => {
  return (
    <StoryForm>
      <FormTextField<TestFormValues>
        showOptionalText
        name="textField"
        label="Text Field"
        helpMessage="Helper message"
        placeholder="Add helper text here.."
        defaultValue={'My initial text'}
      />
    </StoryForm>
  );
};

export const SupportCustomObject = () => {
  type Phone = { value: string; code?: string };
  const transform = {
    input: (value: Phone) => {
      return value?.value as string;
    },
    output: (value: string) => {
      return { value: value, code: '+61' } as Phone;
    },
  };
  return (
    <StoryForm>
      <FormTextField<{ textField: Phone }, 'textField', Phone>
        showOptionalText
        name="textField"
        label="Phone Field"
        helpMessage="Helper message"
        placeholder="Add helper text here.."
        transform={transform}
      />
    </StoryForm>
  );
};
