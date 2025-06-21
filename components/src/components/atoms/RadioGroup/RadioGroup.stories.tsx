import { Button, FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react';

import { FormErrorText } from '../FormErrorText/FormErrorText';

export default {
  title: 'Components/Atoms/Radio Group',
  decorators: [],
};

export const Default = () => {
  return (
    <>
      <FormLabel id="demo-radio-buttons-group-label">Radio Group</FormLabel>
      <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="option1" name="radio-buttons-group">
        <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
        <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
        <FormControlLabel value="option3" control={<Radio />} label="Option 3" />
      </RadioGroup>
    </>
  );
};

export const HelperMessage = () => {
  return (
    <>
      <FormLabel id="demo-radio-buttons-group-label">Radio Group</FormLabel>
      <FormHelperText id="helper-text">Helper text</FormHelperText>
      <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="option1" name="radio-buttons-group">
        <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
        <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
        <FormControlLabel value="option3" control={<Radio />} label="Option 3" />
      </RadioGroup>
    </>
  );
};

export const Disabled = () => {
  return (
    <>
      <FormLabel id="demo-radio-buttons-group-label">Radio Group</FormLabel>
      <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="option3" name="radio-buttons-group">
        <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
        <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
        <FormControlLabel disabled value="option3" control={<Radio />} label="Option 3" />
      </RadioGroup>
    </>
  );
};

export const ErrorMessage = () => {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(true);
  const [helperText, setHelperText] = React.useState('Please select an option.');

  const handleRadioChange = (event: React.ChangeEvent) => {
    setValue((event.target as HTMLInputElement).value);
    setHelperText(' ');
    setError(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (value === 'best') {
      setHelperText('You got it!');
      setError(false);
    } else if (value === 'worst') {
      setHelperText('Sorry, wrong answer!');
      setError(true);
    } else {
      setHelperText('Please select an option.');
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl variant="standard" error={error}>
        <FormLabel id="demo-radio-buttons-group-label">Radio Group</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
          value={value}
          onChange={handleRadioChange}
        >
          <FormControlLabel value="best" control={<Radio />} label="The best!" />
          <FormControlLabel value="worst" control={<Radio color={error ? 'error' : 'primary'} />} label="The worst." />
        </RadioGroup>
        {helperText && error && <FormErrorText>{helperText}</FormErrorText>}
      </FormControl>
      <Button style={{ marginTop: '2em' }} type="submit">
        Check Answer
      </Button>
    </form>
  );
};

export const ClarifyingMessage = () => {
  return (
    <>
      <FormLabel id="demo-radio-buttons-group-label">Radio Group</FormLabel>
      <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="option1" name="radio-buttons-group">
        <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
        <FormHelperText className="clarifying-text">This is clarifying text</FormHelperText>

        <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
        <FormHelperText className="clarifying-text">This is clarifying text</FormHelperText>
        <FormControlLabel value="option3" control={<Radio />} label="Option 3" />
        <FormHelperText className="clarifying-text">This is clarifying text</FormHelperText>
      </RadioGroup>
    </>
  );
};

export const Horizontal = () => {
  return (
    <>
      <FormLabel id="demo-radio-buttons-group-label">Radio Group Horizontal</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="option1"
        name="radio-buttons-group"
      >
        <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
        <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
        <FormControlLabel value="option3" control={<Radio />} label="Option 3" />
      </RadioGroup>
    </>
  );
};
