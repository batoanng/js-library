import { HelpMessage } from './HelpMessage';

export default {
  title: 'Components/Atoms/Help Message',
  decorators: [],
};

export const Default = () => {
  return <HelpMessage>This is a help message</HelpMessage>;
};

export const Html = () => {
  return (
    <HelpMessage>
      This is a help message with <strong>HTML</strong> content
    </HelpMessage>
  );
};

export const Empty = () => {
  return <HelpMessage />;
};
