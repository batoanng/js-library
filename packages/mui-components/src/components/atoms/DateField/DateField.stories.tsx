import { Button, FormHelperText, FormLabel } from '@mui/material';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parse } from 'date-fns';
import { useState } from 'react';

import { FormErrorText } from '@/components';

export default {
  title: 'Components/Atoms/Date Field',
  decorators: [],
};

export const Default = () => {
  const [value, setValue] = useState<Date | null>(parse('2023-02-02', 'yyyy-MM-dd', new Date()));
  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormLabel htmlFor="date-field-input">{`What's your preferred date?`}</FormLabel>
      <FormHelperText>Enter using the format DD/MM/YYYY.</FormHelperText>
      <DateField
        value={value}
        className="date-field date-format-yyyy-mm-dd"
        id="date-field-input"
        onChange={handleChange}
      />
    </LocalizationProvider>
  );
};

export const Format = () => {
  const [value, setValue] = useState<Date | null>(parse('01/12/2020', 'dd/mm/yyyy', new Date()));
  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormLabel>{`What's your preferred date?`}</FormLabel>
      <FormHelperText>Enter using the format DD/MM/YYYY.</FormHelperText>
      <DateField
        value={value}
        className="date-field date-format-yyyy-mm-dd"
        format="dd/mm/yyyy"
        onChange={handleChange}
      />
    </LocalizationProvider>
  );
};

export const MonthAndYear = () => {
  const [value, setValue] = useState<Date | null>(parse('12/2020', 'mm/yyyy', new Date()));
  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormLabel>{`What's your preferred date?`}</FormLabel>
      <FormHelperText>Enter using the format DD/MM/YYYY.</FormHelperText>
      <DateField value={value} className="date-field date-format-yyyy-mm" format="MM/yyyy" onChange={handleChange} />
    </LocalizationProvider>
  );
};

export const Error = () => {
  const hasError = true;
  const [value, setValue] = useState<Date | null>(parse('0020-02-02', 'yyyy-MM-dd', new Date()));
  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormLabel>{`What's your preferred date?`}</FormLabel>
      <FormHelperText>Enter using the format DD/MM/YYYY.</FormHelperText>
      <DateField value={value} className="date-field date-format-yyyy-mm-dd" onChange={handleChange} />
      {hasError ? <FormErrorText>Invalid or incomplete date.</FormErrorText> : null}
    </LocalizationProvider>
  );
};

export const OnchangeErrorChecking = () => {
  const [hasError, setHasError] = useState(true);
  const [value, setValue] = useState<Date | null>(parse('15/10/20', 'dd/MM/yyyy', new Date()));
  const handleChange = (newValue: Date | null) => {
    setValue(newValue);

    // regex in dd/mm/yyyy format
    const validDateTest = new RegExp(/(^0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4}$)/);

    if (newValue && validDateTest.test(newValue.toLocaleDateString('en-AU'))) {
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormLabel>{`What's your preferred date?`}</FormLabel>
      <FormHelperText>Enter using the format DD/MM/YYYY.</FormHelperText>
      <DateField
        value={value}
        className="date-field date-format-yyyy-mm-dd"
        format="dd/MM/yyyy"
        onChange={handleChange}
      />
      {hasError ? <FormErrorText>Invalid or incomplete date.</FormErrorText> : null}
    </LocalizationProvider>
  );
};

export const OnsubmitErrorChecking = () => {
  const [hasError, setHasError] = useState(true);
  const [value, setValue] = useState<Date | null>(parse('25/12/20', 'dd/MM/yyyy', new Date()));
  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };
  const handleSubmit = () => {
    // regex in dd/mm/yyyy format
    const validDateTest = new RegExp(/(^0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4}$)/);

    if (value && validDateTest.test(value.toLocaleDateString('en-AU'))) {
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  console.log('error', hasError);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormLabel>{`What's your preferred date?`}</FormLabel>
      <FormHelperText>Enter using the format DD/MM/YYYY.</FormHelperText>
      <DateField
        value={value}
        className="date-field date-format-yyyy-mm-dd"
        format="dd/MM/yyyy"
        onChange={handleChange}
      />
      {hasError ? <FormErrorText>Invalid or incomplete date.</FormErrorText> : null}
      <Button variant="contained" style={{ marginTop: '1rem' }} onClick={handleSubmit}>
        Submit
      </Button>
    </LocalizationProvider>
  );
};
