import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState } from 'react';

import { TimePicker } from './TimePicker';

export default {
  title: 'Components/Atoms/Time Picker',
  decorators: [],
};

export const Default = () => {
  const [value, setValue] = useState<Date | null>(new Date('2024-10-25T10:15'));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker id="time-picker-default" label="Time picker" value={value!} onChange={setValue} />
    </LocalizationProvider>
  );
};

export const Error = () => {
  const [value, setValue] = useState<Date | null>(new Date('2024-10-25T10:15'));

  const hasError = true;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        id="time-picker-default"
        label="Time picker"
        value={value!}
        error={hasError}
        errorMessage="This is an error"
        timeSteps={{
          minutes: 1,
        }}
        onChange={setValue}
      />
    </LocalizationProvider>
  );
};
