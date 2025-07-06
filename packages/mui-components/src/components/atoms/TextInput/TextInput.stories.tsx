import { InputAdornment } from '@mui/material';

import { TextInput } from './TextInput';

export default {
  title: 'Components/Atoms/Text Field',
  decorators: [],
};

export const Default = () => {
  return <TextInput label="Label text" helpMessage="Helper text" />;
};

export const Disabled = () => {
  return <TextInput disabled label="Label text" helpMessage="Helper text" />;
};

export const TextInputError = () => {
  return (
    <TextInput
      error
      label="Label text"
      helpMessage="Helper text"
      errorMessage="Here is a really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really long error message."
    />
  );
};

export const TextInputAdornments = () => {
  return (
    <TextInput
      label="Label text"
      helpMessage="Helper text"
      endAdornment={
        <InputAdornment variant="filled" position="end">
          .00
        </InputAdornment>
      }
      startAdornment={
        <InputAdornment variant="filled" position="start">
          $
        </InputAdornment>
      }
    />
  );
};

export const TextInputWidth = () => {
  return (
    <>
      <TextInput label="xxs" inputWidth="xxs" />
      <TextInput label="xs" inputWidth="xs" />
      <TextInput label="sm" inputWidth="sm" />
      <TextInput label="md" inputWidth="md" />
      <TextInput label="lg" inputWidth="lg" />
      <TextInput label="xl" inputWidth="xl" />
    </>
  );
};
