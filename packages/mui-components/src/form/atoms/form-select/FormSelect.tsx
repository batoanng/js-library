import {
  areOptionValuesEqualValue,
  getOptionFormValue,
  getOptionHelpMessageValue,
  getOptionKeyValue,
  getOptionLabelValue,
  isOptionDisabledValue,
} from '@/functions';
import { useFieldErrorMessage, useHtmlId, useScreenType } from '@/hooks';
import type { FormOption, FormOptionsControlProps } from '@/types';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import type {
  NativeSelectProps as MuiNativeSelectProps,
  SelectChangeEvent,
  SelectProps as MuiSelectProps,
} from '@mui/material';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  ListItemText,
  MenuItem,
  NativeSelect,
  OutlinedInput,
  Select,
} from '@mui/material';
import { FormErrorText, IconModal } from '@/components';
import type { ChangeEvent } from 'react';
import { useMemo } from 'react';
import type { FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { useLatest } from 'react-use';
import { InputWidthVariant, getMaxWidth } from '@/functions';

type SelectProps = Omit<MuiSelectProps<string>, 'onChange' | 'id' | 'name' | 'value' | 'input' | 'native'>;
type NativeSelectProps = Omit<MuiNativeSelectProps, 'onChange' | 'id' | 'name' | 'value' | 'input' | 'native'>;

type SharedFormSelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TOptionValue = PathValue<TFieldValues, TName>,
  TOption = FormOption<TOptionValue>
> = FormOptionsControlProps<TFieldValues, TName, PathValue<TFieldValues, TName>, TOptionValue, TOption> & {
  onChange?: (value: PathValue<TFieldValues, TName> | null) => void;
  emptyValueLabel?: string | null;
  alwaysShowEmptyValue?: boolean;
  defaultValue?: PathValue<TFieldValues, TName>;
  native?: boolean | 'mobile' | 'tablet';
  inputWidth?: InputWidthVariant;
};

export type FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOptionValue = PathValue<TFieldValues, TName>,
  TOption = FormOption<TOptionValue>
> = SharedFormSelectProps<TFieldValues, TName, TOptionValue, TOption> & SelectProps & NativeSelectProps;

export const FormSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOptionValue = PathValue<TFieldValues, TName>,
  TOption = FormOption<TOptionValue>
>({
  id: suppliedId,
  name,
  options,
  onChange,
  native = 'mobile',
  IconComponent = KeyboardArrowDownRounded,
  label,
  rules,
  shouldUnregister,
  helpMessage,
  errorMode,
  emptyValueLabel = 'Please select',
  defaultValue,
  alwaysShowEmptyValue,
  infoTooltipProps,
  inputWidth,
  sx = {},
  getOptionKey = getOptionKeyValue<TOption>,
  getOptionValue = getOptionFormValue<PathValue<TFieldValues, TName>, TOption>,
  getOptionLabel = getOptionLabelValue<TOption>,
  getOptionHelpMessage = getOptionHelpMessageValue<TOption>,
  isOptionDisabled = isOptionDisabledValue<TOption>,
  areOptionValuesEqual = areOptionValuesEqualValue<PathValue<TFieldValues, TName>>,
  ...selectProps
}: FormSelectProps<TFieldValues, TName, TOptionValue, TOption>) => {
  const id = useHtmlId('form-select', suppliedId, name);
  const getId = (...components: string[]) => [id, ...components].join('-');

  const {
    field: { ref, name: fieldName, value: selectedValue, onChange: onFieldChange, ...fieldProps },
    fieldState,
  } = useController({
    name,
    rules,
    shouldUnregister,
    defaultValue,
  });

  const optionProps = useLatest({
    getKey: getOptionKey,
    getValue: getOptionValue,
    getLabel: getOptionLabel,
    getHelpMessage: getOptionHelpMessage,
    isDisabled: isOptionDisabled,
    areEqual: areOptionValuesEqual,
  });

  const [menuItems, selectedKey] = useMemo(() => {
    const { getKey, getValue, getLabel, getHelpMessage, isDisabled, areEqual } = optionProps.current;

    let selectedKey = '';

    const menuItems = options.map((option: TOption) => {
      const key = getKey(option);
      const value = getValue(option);

      if (areEqual(value, selectedValue)) {
        selectedKey = key;
      }

      return {
        ...option,
        key,
        label: getLabel(option),
        disabled: isDisabled(option),
        helpMessage: getHelpMessage(option),
      };
    });

    return [menuItems, selectedKey];
  }, [options, selectedValue, optionProps]);

  const screenType = useScreenType();
  const showNative =
    native === true ||
    (native === 'mobile' && screenType.isMobile) ||
    (native === 'tablet' && screenType.isTablet) ||
    screenType.isMobile;

  const handleChange = (event: SelectChangeEvent<string> | ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = options.find((option: TOption) => getOptionKey(option) === event.target.value);

    // TODO previously empty value would have been emitting '', should this still be the case, or something more along the lines of undefined?
    let value: PathValue<TFieldValues, TName> | null = null;
    if (selectedOption) {
      value = getOptionValue(selectedOption);
    } else if (!alwaysShowEmptyValue) {
      throw new Error('selected option not found with key ' + event.target.value);
    }

    onFieldChange(value, event);
    // will emit undefined when the allow empty select has been enabled
    onChange?.(value);
  };

  const errorMessage = useFieldErrorMessage(fieldName, errorMode);
  const hasError = fieldState?.error != null;
  const infoTooltip = infoTooltipProps && <IconModal {...infoTooltipProps} />;

  const hasSelectedValue = selectedValue != null && selectedValue !== '';

  // The non-native Select has the ability to show an empty value even if it isn't in the list,
  // where-as the native select will always default to the first value in the list.
  const showEmptyOptionNative = alwaysShowEmptyValue || !hasSelectedValue;
  const showEmptyOption = Boolean(emptyValueLabel) && showEmptyOptionNative;

  const selectSx = { maxWidth: getMaxWidth(inputWidth), ...sx };

  return (
    <FormControl error={hasError}>
      <FormLabel id={getId('label')} htmlFor={id}>
        {label}
        {!helpMessage && infoTooltip}
      </FormLabel>
      {helpMessage && (
        <FormHelperText id={getId('helper-text')} component="span">
          {helpMessage}
          {infoTooltip}
        </FormHelperText>
      )}
      {showNative ? (
        <NativeSelect
          id={id}
          inputRef={ref}
          input={<OutlinedInput />}
          name={name}
          IconComponent={IconComponent}
          value={selectedKey}
          error={hasError}
          sx={selectSx}
          onChange={handleChange}
          {...fieldProps}
          {...(selectProps as Partial<NativeSelectProps>)}
        >
          {showEmptyOptionNative && <option value="">{emptyValueLabel ?? 'Please select'}</option>}
          {menuItems.map(({ key, label, disabled }) => (
            <option key={key} value={key} disabled={disabled}>
              {label}
            </option>
          ))}
        </NativeSelect>
      ) : (
        <Select
          displayEmpty
          inputRef={ref}
          input={<OutlinedInput />}
          labelId={getId('label')}
          name={name}
          IconComponent={IconComponent}
          value={selectedKey}
          error={hasError}
          sx={selectSx}
          onChange={handleChange}
          {...fieldProps}
          {...(selectProps as Partial<MuiSelectProps<string>>)}
        >
          {showEmptyOption && (
            <MenuItem value="" disabled={!alwaysShowEmptyValue}>
              {emptyValueLabel}
            </MenuItem>
          )}
          {menuItems.map(({ key, label, disabled, helpMessage }) => (
            <MenuItem key={key} value={key} disabled={disabled}>
              <ListItemText primary={label} />
              {helpMessage && (
                <FormHelperText id={getId(key, 'helper-text')} component="span">
                  {helpMessage}
                </FormHelperText>
              )}
            </MenuItem>
          ))}
        </Select>
      )}
      {hasError && <FormErrorText>{errorMessage}</FormErrorText>}
    </FormControl>
  );
};

export type FormNativeSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOptionValue = PathValue<TFieldValues, TName>,
  TOption = FormOption<TOptionValue>
> = Omit<SharedFormSelectProps<TFieldValues, TName, TOptionValue, TOption>, 'native'> & NativeSelectProps;

export const FormNativeSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOptionValue = PathValue<TFieldValues, TName>,
  TOption = FormOption<TOptionValue>
>(
  props: FormNativeSelectProps<TFieldValues, TName, TOptionValue, TOption>
) => <FormSelect {...(props as FormSelectProps<TFieldValues, TName, TOptionValue, TOption>)} native />;
