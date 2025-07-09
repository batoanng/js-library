import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { SelectChangeEvent } from '@mui/material';
import { FormControl, FormHelperText, FormLabel, MenuItem, NativeSelect, OutlinedInput, Select } from '@mui/material';
import { type ChangeEventHandler, useState } from 'react';

import { FormErrorText } from '@/components';

export default {
  title: 'Components/Atoms/Select',
  decorators: [],
};

export const Default = () => {
  const [option, setOption] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value as string);
  };

  return (
    <FormControl fullWidth>
      <FormLabel>Label text</FormLabel>
      <FormHelperText id="helper-text">Helper text</FormHelperText>
      <Select
        displayEmpty
        labelId="simple-selector"
        id="demo-simple-select"
        value={option}
        label="Options"
        IconComponent={KeyboardArrowDownIcon}
        renderValue={(value) => (value !== '' ? value : 'Please select')}
        onChange={handleChange}
      >
        <MenuItem value={10}>Option One</MenuItem>
        <MenuItem value={20}>Option Two</MenuItem>
        <MenuItem value={30}>Option Three</MenuItem>
      </Select>
    </FormControl>
  );
};

export const Disabled = () => {
  const [option, setOption] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value as string);
  };

  return (
    <FormControl fullWidth>
      <FormLabel>Disabled</FormLabel>
      <Select
        displayEmpty
        labelId="simple-selector"
        id="demo-simple-select"
        value={option}
        label="Options"
        disabled={true}
        IconComponent={KeyboardArrowDownIcon}
        renderValue={(value) => (value !== '' ? value : 'Please select')}
        onChange={handleChange}
      >
        <MenuItem value={10}>Option One</MenuItem>
        <MenuItem value={20}>Option Two</MenuItem>
        <MenuItem value={30}>Option Three</MenuItem>
      </Select>
    </FormControl>
  );
};

export const ErrorMessage = () => {
  const [option, setOption] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value as string);
  };

  return (
    <FormControl fullWidth>
      <FormLabel>Option</FormLabel>
      <Select
        error
        displayEmpty
        labelId="simple-selector"
        id="demo-simple-select"
        value={option}
        label="Options"
        IconComponent={KeyboardArrowDownIcon}
        renderValue={(value) => (value !== '' ? value : 'Please select')}
        onChange={handleChange}
      >
        <MenuItem value={10}>Option One</MenuItem>
        <MenuItem value={20}>Option Two</MenuItem>
        <MenuItem value={30}>Option Three</MenuItem>
      </Select>
      <FormErrorText>Error</FormErrorText>
    </FormControl>
  );
};

export const NativeSelectInput = () => {
  const [option, setOption] = useState('');

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setOption(event.target.value as string);
  };

  return (
    <FormControl fullWidth>
      <FormLabel>Label text</FormLabel>
      <FormHelperText id="helper-text">Helper text</FormHelperText>
      <NativeSelect
        input={<OutlinedInput />}
        id="demo-simple-select"
        value={option}
        IconComponent={KeyboardArrowDownIcon}
        onChange={handleChange}
      >
        <option value={10}>Option One</option>
        <option value={20}>Option Two</option>
        <option value={30}>Option Three</option>
      </NativeSelect>
    </FormControl>
  );
};
