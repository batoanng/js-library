import { useState } from 'react';

import { TextArea } from './TextArea';

export default {
  title: 'Components/Atoms/Text Area',
  decorators: [],
};

export const Default = () => {
  return <TextArea label="Text Area" helpMessage="Helper text" />;
};

export const MaxCharacterCount = () => {
  const [value, setValue] = useState('');

  return (
    <TextArea
      label="Text Area"
      helpMessage="Helper text"
      value={value}
      maxLength={200}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const HiddenCharacterCount = () => {
  const [value, setValue] = useState('');

  return (
    <TextArea
      hideCharacterCounter
      label="Text Area"
      helpMessage="Helper text"
      value={value}
      maxLength={200}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const UnlimitedLength = () => {
  const [value, setValue] = useState('');

  return (
    <TextArea
      label="Text Area"
      helpMessage="Helper text"
      value={value}
      maxLength={null}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const MaxRows = () => {
  return <TextArea label="Text Area" helpMessage="Helper text" maxRows={3} />;
};

export const MinRows = () => {
  return <TextArea label="Text Area" helpMessage="Helper text" minRows={5} />;
};

export const Disabled = () => {
  return <TextArea disabled label="Text Area" helpMessage="Helper text" />;
};

export const Error = () => {
  return <TextArea label="Text Area" helpMessage="Helper text" errorMessage="Error message" />;
};
