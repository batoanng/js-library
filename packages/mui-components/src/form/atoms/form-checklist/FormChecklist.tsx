import {
  areOptionValuesEqualValue,
  getOptionFormValue,
  getOptionHelpMessageValue,
  getOptionKeyValue,
  getOptionLabelValue,
  isOptionDisabledValue,
} from '@/functions';
import { useFieldErrorMessage, useHtmlId, useScreenType } from '@/hooks';
import type { ArrayPathValue, FormOption, FormOptionsControlProps } from '@/types';
import { FormControl, FormGroup, FormHelperText, FormLabel } from '@mui/material';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { getId } from './CheckboxOption';
import { MultiColumnCheckList } from './MultiColumnCheckList';
import { SingleColumnCheckList } from './SingleColumnCheckList';
import { FormErrorText, IconModal } from '@/components';

export type FormChecklistProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOptionValue = ArrayPathValue<TFieldValues, TName>,
  TOption = FormOption<TOptionValue>
> = {
  onChange?: (option: TOption, checked: boolean) => void;
  numColumns?: number;
} & FormOptionsControlProps<TFieldValues, TName, ArrayPathValue<TFieldValues, TName>, TOptionValue, TOption>;

export const FormChecklist = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOptionValue = ArrayPathValue<TFieldValues, TName>,
  TOption = FormOption<TOptionValue>
>({
  id: suppliedId,
  name,
  rules,
  shouldUnregister,
  label,
  options,
  getOptionKey = getOptionKeyValue<TOption>,
  getOptionValue = getOptionFormValue<ArrayPathValue<TFieldValues, TName>, TOption>,
  getOptionLabel = getOptionLabelValue<TOption>,
  getOptionHelpMessage = getOptionHelpMessageValue<TOption>,
  isOptionDisabled = isOptionDisabledValue<TOption>,
  areOptionValuesEqual = areOptionValuesEqualValue<ArrayPathValue<TFieldValues, TName>>,
  onChange,
  disabled = false,
  helpMessage,
  errorMode,
  infoTooltipProps,
  numColumns = 1,
}: FormChecklistProps<TFieldValues, TName, TOptionValue, TOption>) => {
  const {
    field: { ref, name: fieldName, onChange: onFormValueChange, value: formValue, ...fieldProps },
    fieldState,
  } = useController({
    name,
    rules,
    shouldUnregister,
  });

  const id = useHtmlId('form-checklist', suppliedId, name);
  const errorMessage = useFieldErrorMessage(fieldName, errorMode);
  const { isMobile } = useScreenType();
  const infoTooltip = infoTooltipProps && <IconModal {...infoTooltipProps} />;
  const selectedValues: ArrayPathValue<TFieldValues, TName>[] = formValue ?? [];

  const isChecked = (optionValue: ArrayPathValue<TFieldValues, TName>) => {
    return selectedValues.some((x) => areOptionValuesEqual(x, optionValue));
  };

  const handleChange = (option: TOption, optionValue: ArrayPathValue<TFieldValues, TName>) => {
    const isObjectType = typeof optionValue === 'object';
    const next = selectedValues.filter((val) =>
      isObjectType ? !areOptionValuesEqual(val, optionValue) : val !== optionValue
    );

    if (next.length === selectedValues.length) {
      next.push(optionValue);
    }

    onFormValueChange(next);
    onChange?.(option, next.length > selectedValues.length);
  };

  return (
    <FormControl {...fieldProps} ref={ref} error={fieldState.error != null}>
      <FormLabel id={getId(id, 'label')} disabled={disabled} component="span">
        {label}
        {!helpMessage && infoTooltip}
      </FormLabel>
      {helpMessage && (
        <FormHelperText id={getId(id, 'helper-text')}>
          {helpMessage}
          {infoTooltip}
        </FormHelperText>
      )}
      <FormGroup>
        {numColumns === 1 || isMobile ? (
          <SingleColumnCheckList
            id={id}
            options={options}
            getOptionKey={getOptionKey}
            getOptionValue={getOptionValue}
            getOptionLabel={getOptionLabel}
            getOptionHelpMessage={getOptionHelpMessage}
            isOptionDisabled={isOptionDisabled}
            isChecked={isChecked}
            disabled={disabled}
            onChange={handleChange}
          />
        ) : (
          <MultiColumnCheckList
            id={id}
            options={options}
            getOptionKey={getOptionKey}
            getOptionValue={getOptionValue}
            getOptionLabel={getOptionLabel}
            getOptionHelpMessage={getOptionHelpMessage}
            isOptionDisabled={isOptionDisabled}
            isChecked={isChecked}
            disabled={disabled}
            numColumns={numColumns}
            onChange={handleChange}
          />
        )}
      </FormGroup>
      {Boolean(!disabled && errorMessage) && <FormErrorText>{errorMessage}</FormErrorText>}
    </FormControl>
  );
};
