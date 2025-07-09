import { FormHelperText, FormLabel } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parse } from 'date-fns';
import { useState } from 'react';

import { FormErrorText } from '../FormErrorText/FormErrorText';

export default {
  title: 'Components/Atoms/Date Picker',
  decorators: [],
};

export const Default = () => {
  const [value, setValue] = useState<Date | null>(parse('2023-02-02', 'yyyy-MM-dd', new Date()));
  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormLabel>{`What's your preferred date?`}</FormLabel>
      <FormHelperText>Enter using the format DD/MM/YYYY.</FormHelperText>
      <DatePicker format="dd/MM/yyyy" value={value} onChange={handleChange} />
    </LocalizationProvider>
  );
};

export const Open = () => {
  const [value, setValue] = useState<Date | null>(parse('2023-02-02', 'yyyy-MM-dd', new Date()));
  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormLabel>{`What's your preferred date?`}</FormLabel>
      <FormHelperText>Enter using the format DD/MM/YYYY.</FormHelperText>
      <DatePicker open format="dd/MM/yyyy" value={value} onChange={handleChange} />
    </LocalizationProvider>
  );
};

export const Error = () => {
  const hasError = true;
  const [value, setValue] = useState<Date | null>(parse('2023-02-02', 'yyyy-MM-dd', new Date()));
  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormLabel>{`What's your preferred date?`}</FormLabel>
      <FormHelperText>Enter using the format DD/MM/YYYY.</FormHelperText>
      <DatePicker format="dd/MM/yyyy" value={value} className={hasError ? 'error' : ''} onChange={handleChange} />
      {hasError ? <FormErrorText>Invalid or incomplete date.</FormErrorText> : null}
    </LocalizationProvider>
  );
};

export const MinMaxDateRange = () => {
  const [value, setValue] = useState<Date | null>(parse('2023-02-02', 'yyyy-MM-dd', new Date()));
  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormLabel>{`What's your preferred date?`}</FormLabel>
      <FormHelperText>Enter using the format DD/MM/YYYY.</FormHelperText>
      <DatePicker
        format="dd/MM/yyyy"
        value={value}
        minDate={new Date('2022-01-13')}
        maxDate={new Date('2025-01-13')}
        onChange={handleChange}
      />
    </LocalizationProvider>
  );
};
