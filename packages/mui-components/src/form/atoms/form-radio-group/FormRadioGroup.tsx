import {
  areOptionValuesEqualValue,
  getOptionFormValue,
  getOptionHelpMessageValue,
  getOptionKeyValue,
  getOptionLabelValue,
  isOptionDisabledValue,
} from '@/functions';
import type { RadioGroupProps } from '@mui/material';
import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material';
import { FormErrorText, IconModal } from '@/components';
import type { ChangeEvent, ReactNode } from 'react';
import type { FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { useFieldErrorMessage, useHtmlId } from '@/hooks';
import { FormOption, FormOptionsControlProps } from '@/types';

export type FormRadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOptionValue = PathValue<TFieldValues, TName>,
  TOption = FormOption<TOptionValue>
> = Omit<RadioGroupProps, 'id' | 'name' | 'onBlur' | 'value' | 'defaultValue' | 'defaultChecked' | 'children'> &
  FormOptionsControlProps<TFieldValues, TName, PathValue<TFieldValues, TName>, TOptionValue, TOption>;

export const FormRadioGroup = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOptionValue = PathValue<TFieldValues, TName>,
  TOption = FormOption<TOptionValue>
>({
  id: suppliedId,
  name,
  rules,
  shouldUnregister,
  label,
  helpMessage,
  row = false,
  errorMode,
  disabled,
  options,
  onChange,
  getOptionKey = getOptionKeyValue<TOption>,
  getOptionValue = getOptionFormValue<PathValue<TFieldValues, TName>, TOption>,
  getOptionLabel = getOptionLabelValue<TOption>,
  getOptionHelpMessage = getOptionHelpMessageValue<TOption>,
  isOptionDisabled = isOptionDisabledValue<TOption>,
  areOptionValuesEqual = areOptionValuesEqualValue<PathValue<TFieldValues, TName>>,
  infoTooltipProps,
  ...radioSelectProps
}: FormRadioGroupProps<TFieldValues, TName, TOptionValue, TOption>) => {
  const id = useHtmlId('form-radio-group', suppliedId, name);
  const getId = (component: string) => `${id}-${component}`;

  const {
    field: { name: fieldName, value: formValue, onChange: onFieldChange, ...fieldProps },
    fieldState,
  } = useController({
    name,
    rules,
    shouldUnregister,
  });

  const isChecked = (option: TOption) => {
    const optionValue = getOptionValue!(option);
    return typeof formValue === 'object' ? areOptionValuesEqual(formValue, optionValue) : formValue === optionValue;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedOption = options.find((option: TOption) => getOptionKey(option) === event.target.value);

    if (selectedOption) {
      onFieldChange(getOptionValue(selectedOption));
      if (onChange) {
        onChange(event, event.target.value);
      }
    }
  };

  const errorMessage = useFieldErrorMessage(fieldName, errorMode);
  const hasError = fieldState.error != null;
  const infoTooltip = infoTooltipProps && <IconModal {...infoTooltipProps} />;

  return (
    <FormControl error={hasError}>
      <FormLabel id={getId('label')}>
        {label}
        {!helpMessage && infoTooltip}
      </FormLabel>
      {helpMessage && (
        <FormHelperText id={getId('helper-text')} component="span">
          {helpMessage}
          {infoTooltip}
        </FormHelperText>
      )}
      <RadioGroup
        {...radioSelectProps}
        {...fieldProps}
        id={id}
        aria-labelledby={getId('label')}
        name={name}
        value={formValue || ''}
        row={row}
        onChange={handleChange}
      >
        {options.map((option: TOption) => (
          <RadioOption
            key={getOptionKey(option)}
            id={getId(getOptionKey!(option))}
            disabled={disabled || isOptionDisabled(option)}
            checked={isChecked(option)}
            label={getOptionLabel(option)}
            // Use option key for the value because event.target.value returns string representation of the value
            value={getOptionKey(option)}
            helpMessage={getOptionHelpMessage(option)}
          />
        ))}
      </RadioGroup>
      {hasError && <FormErrorText sx={{ mt: 2 }}>{errorMessage}</FormErrorText>}
    </FormControl>
  );
};

export interface RadioOptionProps<TValue> {
  id: string;
  checked: boolean;
  disabled: boolean;
  helpMessage?: ReactNode;
  label: ReactNode;
  value: TValue;
}

const RadioOption = <TValue,>({ id, label, value, checked, disabled, helpMessage }: RadioOptionProps<TValue>) => {
  return (
    <FormControlLabel
      id={id}
      label={
        <>
          {label}
          {helpMessage && (
            <FormHelperText id={`helper-text-${id}`} component={'span'} sx={{ pt: 0.5 }}>
              {helpMessage}
            </FormHelperText>
          )}
        </>
      }
      sx={{ '& .MuiFormControlLabel-label': { pt: 0.5, pb: helpMessage ? 0 : 0.5 } }}
      value={value}
      checked={checked}
      control={<Radio disabled={disabled} />}
    />
  );
};
