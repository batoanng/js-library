import { Autocomplete, Box, FormHelperText, FormLabel, TextField } from '@mui/material';
import axios from 'axios';
import React from 'react';

import { FormErrorText } from '@/components/atoms/FormErrorText/FormErrorText';

import { useSearchResults } from './hooks';

export default {
  title: 'Components/Molecules/Autocomplete',
  decorators: [],
};

export const Basic = () => {
  const SUGGESTIONS = ['Dogs', 'Cats', 'Rabbits', 'Ducks', 'Elephants'];

  const [value, setValue] = React.useState<string | null>(null);

  const [inputValue, setInputValue] = React.useState<string>('');

  return (
    <>
      <FormLabel id="autocomplete-label">Animal autocomplete</FormLabel>
      <FormHelperText id="autocomplete-helper-text">
        Suggestion will show after you have entered at least 1 character
      </FormHelperText>
      <Autocomplete
        freeSolo
        id="autocomplete"
        value={value}
        renderInput={(params) => <TextField {...params} />}
        options={inputValue.length > 0 ? SUGGESTIONS : []}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        onChange={(_, newInputValue) => setValue(newInputValue)}
      />

      <Box>Selected: {value ?? '--'}</Box>
    </>
  );
};

export const Errors = () => {
  const SUGGESTIONS = ['Dogs', 'Cats', 'Rabbits', 'Ducks', 'Elephants'];

  const [value, setValue] = React.useState<string | null>(null);

  const [inputValue, setInputValue] = React.useState<string>('');

  const [hasError, setHasError] = React.useState(true);

  const onChange = (_event: React.SyntheticEvent<Element, Event>, newInputValue: string | null) => {
    if (newInputValue === 'Dogs') {
      setHasError(false);
    } else {
      setHasError(true);
    }

    setValue(newInputValue);
  };

  return (
    <>
      <FormLabel id="autocomplete-label">Animal autocomplete</FormLabel>
      <FormHelperText id="autocomplete-helper-text">
        Suggestion will show after you have entered at least 1 character
      </FormHelperText>
      <Autocomplete
        freeSolo
        id="autocomplete"
        value={value}
        renderInput={(params) => <TextField {...params} error={hasError} />}
        options={inputValue.length > 0 ? SUGGESTIONS : []}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        onChange={onChange}
      />

      {hasError && <FormErrorText>You should always choose Dogs</FormErrorText>}
      <Box>Selected: {value ?? '--'}</Box>
    </>
  );
};

const defaultValue = {
  id: '',
  name: '',
  brewery_type: '',
};

type Brewery = {
  id: string;
  name: string;
  brewery_type: string;
};

export const ApiLookup = () => {
  const [value, setValue] = React.useState<Brewery | null>(defaultValue);

  const [inputValue, setInputValue] = React.useState<string>('');

  const onChange = (_event: React.SyntheticEvent<Element, Event>, newValue: string | Brewery | null) => {
    if (newValue === null) {
      setValue(defaultValue);
      return;
    }
    if (typeof newValue === 'string') {
      return;
    }

    setValue(newValue as Brewery);
  };

  const getOptionLabel = (option: string | Brewery) => {
    return (option as Brewery)?.name ?? '';
  };

  const api = {
    searchForSuggestions: async (value: string) => {
      const response = await axios.get<Brewery[]>(
        `https://api.openbrewerydb.org/breweries?by_name=${value}&per_page=5`
      );

      return response.data;
    },
  };

  return (
    <>
      <FormLabel id="autocomplete-label">Brewery autocomplete</FormLabel>
      <FormHelperText id="autocomplete-helper-text">
        Suggestion will show after you have entered at least 3 character
      </FormHelperText>
      <Autocomplete<Brewery, false, false, true>
        freeSolo
        id="autocomplete"
        value={value}
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
            }}
          />
        )}
        options={useSearchResults(api, inputValue) || []}
        inputValue={inputValue}
        getOptionLabel={getOptionLabel}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        onChange={onChange}
      />

      <Box>
        Selected: <pre>{value ? JSON.stringify(value, null, '  ') : '--'}</pre>
      </Box>
    </>
  );
};

export const PredictiveList = () => {
  const SUGGESTIONS = ['Dogs', 'Cats', 'Rabbits', 'Ducks', 'Elephants'];

  const [value, setValue] = React.useState<string | null>(null);

  const [inputValue, setInputValue] = React.useState<string>('');

  return (
    <>
      <FormLabel id="autocomplete-label">Animal autocomplete</FormLabel>
      <FormHelperText id="autocomplete-helper-text">
        Suggestion will show after you have entered at least 1 character
      </FormHelperText>
      <Autocomplete
        freeSolo
        id="autocomplete"
        value={value}
        renderInput={(params) => <TextField {...params} />}
        options={inputValue.length > 0 ? SUGGESTIONS : []}
        inputValue={inputValue}
        renderOption={(props, option) => (
          <Box component="li" sx={{ '& > a': { color: 'text.primary' } }} {...props}>
            <a href="/">{option}</a>
          </Box>
        )}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        onChange={(_, newInputValue) => setValue(newInputValue)}
      />

      <Box>Selected: {value ?? '--'}</Box>
    </>
  );
};
