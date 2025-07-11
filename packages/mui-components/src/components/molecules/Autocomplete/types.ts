export interface AutocompleteApi<DataType> {
  searchForSuggestions: (searchTerm: string) => Promise<DataType[]>;
}
