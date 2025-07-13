import { StoryForm } from '@/form/stories/components';

import { FormFileUpload } from './FormFileUpload';

export default {
  title: 'Forms/Molecules/File upload',
  decorators: [],
};

const files = [
  'data:image/png;base64,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',
];

export const Default = () => {
  return (
    <StoryForm>
      <FormFileUpload
        id="avatar"
        name="avatar"
        heading="Portal logo"
        subText="Formats accepted: JPG or PNG File size must not exceed 500KB Use an image with a minimum dimension of 300x300 pixels"
      />
    </StoryForm>
  );
};

export const DefaultValues = () => {
  return (
    <StoryForm defaultValues={{ files: files }}>
      <FormFileUpload id="files" name="files" heading="Upload an avatar" />
    </StoryForm>
  );
};

export const MaxNumberOfFiles = () => {
  return (
    <StoryForm>
      <FormFileUpload id="avatar" name="avatar" heading="Upload an avatar" maxFiles={3} />
    </StoryForm>
  );
};

export const Required = () => {
  return (
    <StoryForm>
      <FormFileUpload
        id="avatar"
        name="avatar"
        heading="Upload an avatar"
        rules={{
          validate: {
            required: (files: any) => {
              return !files?.length ? 'You must upload an avatar.' : undefined;
            },
          },
        }}
      />
    </StoryForm>
  );
};
