import {
  getOptionFormValue,
  getOptionHelpMessageValue,
  getOptionKeyValue,
  getOptionLabelValue,
  isOptionDisabledValue,
} from '@/functions';
import { type ArrayPathValue, FormOption } from '@/types';
import { Stack } from '@mui/material';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { SingleColumnCheckList, type SingleColumnCheckListProps } from './SingleColumnCheckList';

export type MultiColumnCheckListProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOptionValue = ArrayPathValue<TFieldValues, TName>,
  TOption = FormOption<TOptionValue>
> = {
  numColumns: number;
} & SingleColumnCheckListProps<TFieldValues, TName, TOptionValue, TOption>;

export const MultiColumnCheckList = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOptionValue = ArrayPathValue<TFieldValues, TName>,
  TOption = FormOption<TOptionValue>
>({
  id,
  options,
  getOptionKey = getOptionKeyValue<TOption>,
  getOptionValue = getOptionFormValue<ArrayPathValue<TFieldValues, TName>, TOption>,
  getOptionLabel = getOptionLabelValue<TOption>,
  getOptionHelpMessage = getOptionHelpMessageValue<TOption>,
  isOptionDisabled = isOptionDisabledValue<TOption>,
  onChange,
  isChecked,
  disabled,
  numColumns,
}: MultiColumnCheckListProps<TFieldValues, TName, TOptionValue, TOption>) => {
  const itemsPerColumn = numColumns === 1 ? options.length : Math.floor(options.length / numColumns) + 1;

  const handleChange = (option: TOption, optionValue: ArrayPathValue<TFieldValues, TName>) => {
    onChange?.(option, optionValue);
  };

  return (
    <Stack direction="row" spacing={4}>
      {Array.from({ length: numColumns }).map((_, columnIndex) => (
        <SingleColumnCheckList
          key={`${id}-col-${columnIndex}`}
          id={id}
          options={options.slice(columnIndex * itemsPerColumn, (columnIndex + 1) * itemsPerColumn)}
          getOptionKey={getOptionKey}
          getOptionValue={getOptionValue}
          getOptionLabel={getOptionLabel}
          getOptionHelpMessage={getOptionHelpMessage}
          isOptionDisabled={isOptionDisabled}
          isChecked={isChecked}
          disabled={disabled}
          onChange={handleChange}
        />
      ))}
    </Stack>
  );
};
