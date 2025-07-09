import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel } from '@mui/material';
import React from 'react';

import { FormErrorText } from '@/components';

export default {
  title: 'Components/Atoms/Checkbox List',
  decorators: [],
};

export const Default = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <>
      <FormLabel id="demo-checkbox-list-label">Checkbox List Label</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checkedIcon={<CheckRoundedIcon />} />}
          label="Label"
          value={checked}
          onChange={() => setChecked(!checked)}
        />

        <FormControlLabel
          control={<Checkbox checkedIcon={<CheckRoundedIcon />} />}
          label="Label Two"
          value={checked}
          onChange={() => setChecked(!checked)}
        />
      </FormGroup>
      <Box sx={{ mt: 2 }}>{checked ? 'checked' : 'not checked'}</Box>
    </>
  );
};

export const HelperMessage = () => {
  const [checked, setChecked] = React.useState(false);
  return (
    <>
      <FormLabel id="demo-checkbox-list-label">Checkbox List Label</FormLabel>
      <FormHelperText id="helper-text">Helper text</FormHelperText>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checkedIcon={<CheckRoundedIcon />} />}
          label="Label"
          value={checked}
          onChange={() => setChecked(!checked)}
        />

        <FormControlLabel
          control={<Checkbox checkedIcon={<CheckRoundedIcon />} />}
          label="Label Two"
          value={checked}
          onChange={() => setChecked(!checked)}
        />
      </FormGroup>
      <Box sx={{ mt: 2 }}>{checked ? 'checked' : 'not checked'}</Box>
    </>
  );
};

export const Disabled = () => {
  return (
    <>
      <FormLabel id="demo-checkbox-list-label">Checkbox List Label</FormLabel>
      <FormGroup>
        <FormControlLabel control={<Checkbox checkedIcon={<CheckRoundedIcon />} />} label="Not Disabled" />
        <FormControlLabel disabled control={<Checkbox checkedIcon={<CheckRoundedIcon />} />} label="Disabled" />
        <FormControlLabel
          checked
          disabled
          control={<Checkbox checkedIcon={<CheckRoundedIcon />} />}
          label="Disabled Checked"
        />
      </FormGroup>
    </>
  );
};

export const ErrorMessage = () => {
  const [state, setState] = React.useState({
    gilad: true,
    jason: false,
    antoine: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { gilad, jason, antoine } = state;
  const error = [gilad, jason, antoine].filter((v) => v).length !== 2;

  return (
    <>
      <FormControl required error={error} component="fieldset" variant="standard">
        <FormLabel>Pick two</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={gilad} name="gilad" checkedIcon={<CheckRoundedIcon />} onChange={handleChange} />
            }
            label="Gilad Gray"
          />
          <FormControlLabel
            control={
              <Checkbox checked={jason} name="jason" checkedIcon={<CheckRoundedIcon />} onChange={handleChange} />
            }
            label="Jason Killian"
          />
          <FormControlLabel
            control={
              <Checkbox checked={antoine} name="antoine" checkedIcon={<CheckRoundedIcon />} onChange={handleChange} />
            }
            label="Antoine Llorca"
          />
        </FormGroup>
        {error && <FormErrorText>You can display an error</FormErrorText>}
      </FormControl>
    </>
  );
};

export const ClarifyingMessage = () => {
  const [checked, setChecked] = React.useState(false);
  return (
    <>
      <FormLabel id="demo-checkbox-list-label">Checkbox List Label</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checkedIcon={<CheckRoundedIcon />} />}
          label="Label"
          value={checked}
          onChange={() => setChecked(!checked)}
        />
        <FormHelperText className="clarifying-text">This is clarifying text</FormHelperText>

        <FormControlLabel
          control={<Checkbox checkedIcon={<CheckRoundedIcon />} />}
          label="Label Two"
          value={checked}
          onChange={() => setChecked(!checked)}
        />
        <FormHelperText className="clarifying-text">This is clarifying text</FormHelperText>
      </FormGroup>
      <Box sx={{ mt: 2 }}>{checked ? 'checked' : 'not checked'}</Box>
    </>
  );
};
