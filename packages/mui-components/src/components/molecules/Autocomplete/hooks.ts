import { useState } from 'react';
import { useDebounce, useLatest } from 'react-use';

import type { AutocompleteApi } from './types';
import { AUTOCOMPLETE_CONSTANTS } from './constants';

export const useSearchResults = <DataType>(
  api: AutocompleteApi<DataType>,
  searchTerm = '',
  debounceTime = 1000,
  minLength = AUTOCOMPLETE_CONSTANTS.numberCharactersBeforeAPICall
): DataType[] => {
  const apiRef = useLatest(api);
  const [searchResults, setSearchResults] = useState<DataType[]>([]);

  useDebounce(
    async () => {
      if (minLength > 0) {
        if (searchTerm.length >= minLength) {
          const result = await apiRef.current.searchForSuggestions(searchTerm);
          setSearchResults([...result]);
        } else {
          setSearchResults([]);
        }
      } else {
        const result = await apiRef.current.searchForSuggestions(searchTerm);
        setSearchResults([...result]);
      }
    },
    debounceTime,
    [searchTerm]
  );

  return searchResults;
};
