import {
  getOptionFormValue,
  getOptionHelpMessageValue,
  getOptionKeyValue,
  getOptionLabelValue,
  isOptionDisabledValue,
} from '@/functions';
import { type ArrayPathValue, FormOption } from '@/types';
import { Stack, type StackProps } from '@mui/material';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { CheckboxOption, getId } from './CheckboxOption';
import type { FormChecklistProps } from './FormChecklist';

export type SingleColumnCheckListProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOptionValue = ArrayPathValue<TFieldValues, TName>,
  TOption = FormOption<TOptionValue>
> = {
  isChecked: (optionValue: ArrayPathValue<TFieldValues, TName>) => boolean;
  onChange: (option: TOption, optionValue: ArrayPathValue<TFieldValues, TName>) => void;
} & Omit<FormChecklistProps<TFieldValues, TName, TOptionValue, TOption>, 'onChange' | 'name' | 'label'> &
  Omit<StackProps, 'onChange'>;

export const SingleColumnCheckList = <
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
  ...stackProps
}: SingleColumnCheckListProps<TFieldValues, TName, TOptionValue, TOption>) => {
  const handleChange = (option: TOption, optionValue: ArrayPathValue<TFieldValues, TName>) => {
    onChange?.(option, optionValue);
  };

  return (
    <Stack direction="column" {...stackProps}>
      {options.map((option: TOption) => {
        const key = getOptionKey(option);
        const value = getOptionValue(option);
        return (
          <CheckboxOption
            key={key}
            id={getId(id ?? 'sccl', getOptionKey(option))}
            disabled={disabled || isOptionDisabled(option)}
            helpMessage={getOptionHelpMessage(option)}
            label={getOptionLabel(option)}
            value={value}
            checked={isChecked(value)}
            onChange={() => handleChange(option, value)}
          />
        );
      })}
    </Stack>
  );
};
