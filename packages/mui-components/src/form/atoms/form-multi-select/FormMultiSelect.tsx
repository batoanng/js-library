import { FormErrorText, IconModal } from '@/components';
import {
  InputWidthVariant,
  areOptionValuesEqualValue,
  getMaxWidth,
  getOptionFormValue,
  getOptionHelpMessageValue,
  getOptionKeyValue,
  getOptionLabelValue,
  isOptionDisabledValue,
} from '@/functions';
import { useFieldErrorMessage, useHtmlId } from '@/hooks';
import type { ArrayFieldPath, ArrayPathValue, FormOption, FormOptionsControlProps } from '@/types';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
  type SelectProps,
  Stack,
  styled,
} from '@mui/material';
import { type MouseEvent, type ReactNode, useMemo } from 'react';
import type { FieldValues, PathValue } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { useLatest } from 'react-use';

const MultiSelectMenuItem = styled(MenuItem)(() => ({}));

export type FormMultiSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends ArrayFieldPath<TFieldValues> = ArrayFieldPath<TFieldValues>,
  TOptionValue = ArrayPathValue<TFieldValues, TName>,
  TOption = FormOption<TOptionValue>
> = FormOptionsControlProps<TFieldValues, TName, ArrayPathValue<TFieldValues, TName>, TOptionValue, TOption> &
  Omit<SelectProps, 'onChange' | 'id' | 'name' | 'value' | 'input' | 'defaultValue'> & {
    onChange?: (option: TOption, selected: boolean) => void;
    emptyValueLabel?: string;
    defaultValue?: ArrayPathValue<TFieldValues, TName>[];
    renderSelectedOptions?: (selectedValues: TOption[], emptyValueLabel: string) => ReactNode;
    inputWidth?: InputWidthVariant;
  };

type FormMultiSelectMenuItem = {
  key: string;
  label: ReactNode;
  helpMessage: ReactNode;
  selected: boolean;
  disabled: boolean;
};

export const FormMultiSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends ArrayFieldPath<TFieldValues> = ArrayFieldPath<TFieldValues>,
  TOptionValue = ArrayPathValue<TFieldValues, TName>,
  TOption = FormOption<TOptionValue>
>(
  props: FormMultiSelectProps<TFieldValues, TName, TOptionValue, TOption>
) => {
  const {
    id: suppliedId,
    name,
    options,
    onChange,
    IconComponent = KeyboardArrowDownRounded,
    label,
    rules,
    shouldUnregister,
    helpMessage,
    errorMode,
    emptyValueLabel = 'Please select',
    defaultValue,
    infoTooltipProps,
    inputWidth,
    getOptionKey = getOptionKeyValue<TOption>,
    getOptionValue = getOptionFormValue<ArrayPathValue<TFieldValues, TName>, TOption>,
    getOptionLabel = getOptionLabelValue<TOption>,
    getOptionHelpMessage = getOptionHelpMessageValue<TOption>,
    isOptionDisabled = isOptionDisabledValue<TOption>,
    areOptionValuesEqual = areOptionValuesEqualValue<ArrayPathValue<TFieldValues, TName>>,
    renderSelectedOptions = defaultRenderSelectedOptions<TOption>(getOptionLabel),
    ...selectProps
  } = props;

  const id = useHtmlId('form-multi-select', suppliedId, name);
  const getId = (...components: string[]) => [id, ...components].join('-');

  const {
    field: { ref, name: fieldName, value: selectedValues, onChange: onFieldChange, ...fieldProps },
    fieldState,
  } = useController({
    name,
    rules,
    shouldUnregister,
    defaultValue: defaultValue as PathValue<TFieldValues, TName>,
  });

  const optionProps = useLatest({
    getKey: getOptionKey,
    getValue: getOptionValue,
    getLabel: getOptionLabel,
    getHelpMessage: getOptionHelpMessage,
    isDisabled: isOptionDisabled,
    areEqual: areOptionValuesEqual,
  });

  const [menuItems, enabledKeys, selectedKeys, selectedOptions] = useMemo(() => {
    const { getKey, getValue, getLabel, getHelpMessage, isDisabled, areEqual } = optionProps.current;

    const selectedValuesArray = (Array.isArray(selectedValues) ? selectedValues : []) as [];

    const isValueSelected = (value: ArrayPathValue<TFieldValues, TName>) =>
      selectedValuesArray.some((selectedValue) => areEqual(selectedValue, value));

    const menuItems: FormMultiSelectMenuItem[] = [];
    const enabledKeys: string[] = [];
    const selectedKeys = new Set<string>();
    const selectedOptions: TOption[] = [];

    options.forEach((option) => {
      const key = getKey(option);
      const value = getValue(option);

      const disabled = isDisabled(option);
      if (!disabled) {
        enabledKeys.push(key);
      }

      const selected = isValueSelected(value);
      if (selected) {
        selectedKeys.add(key);
        selectedOptions.push(option);
      }

      menuItems.push({
        key,
        label: getLabel(option),
        helpMessage: getHelpMessage(option),
        selected,
        disabled,
      });
    });

    return [menuItems, enabledKeys, selectedKeys, selectedOptions];
  }, [options, selectedValues, optionProps]);

  const handleSelectedKeysChange = (nextSelectedKeysArray: string[]) => {
    const nextSelectedKeys = new Set(nextSelectedKeysArray);

    const nextSelectedValues = options.reduce((result, option) => {
      const key = getOptionKey(option);

      const isSelected = nextSelectedKeys.has(key);
      if (isSelected) {
        result.push(getOptionValue(option));
      }

      // Invoke the onChange handler if it exists, and if the selection state
      // has changed for this option since the component was rendered.
      if (onChange && isSelected !== selectedKeys.has(key)) {
        onChange(option, isSelected);
      }

      return result;
    }, [] as ArrayPathValue<TFieldValues, TName>[]);

    onFieldChange(nextSelectedValues);
  };

  const handleChange = (event: SelectChangeEvent<string[]>) => handleSelectedKeysChange(event.target.value as string[]);

  // We have to stop propagation here, otherwise the Select control will try and process the click as though
  // the user is trying to toggle a checkbox.
  const handleSelectAllChangeEvent = (nextKeys: string[]) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleSelectedKeysChange(nextKeys);
  };

  const handleClearAll = handleSelectAllChangeEvent([]);
  const handleSelectAll = handleSelectAllChangeEvent(enabledKeys);

  const errorMessage = useFieldErrorMessage(fieldName, errorMode);
  const hasError = fieldState?.error != null;
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
      <Select
        multiple
        inputRef={ref}
        input={<OutlinedInput sx={{ maxWidth: getMaxWidth(inputWidth) }} />}
        labelId={getId('label')}
        name={name}
        IconComponent={IconComponent}
        error={hasError}
        renderValue={() => renderSelectedOptions(selectedOptions, emptyValueLabel)}
        onChange={handleChange}
        {...fieldProps}
        {...(selectProps as Partial<SelectProps<string[]>>)}
        value={Array.from(selectedKeys.values())}
        MenuProps={{
          ...(selectProps.MenuProps ?? {}),
          sx: {
            ...(selectProps.MenuProps?.sx ?? {}),
            maxHeight: 300,
          },
        }}
      >
        <Stack component="li" sx={{ flexDirection: 'row', justifyContent: 'space-between', p: 2 }}>
          <Button onClick={handleSelectAll}>Select all ({enabledKeys.length})</Button>
          <Button onClick={handleClearAll}>Clear all</Button>
        </Stack>

        {menuItems.map(({ key, label, selected, disabled, helpMessage }) => (
          <MultiSelectMenuItem key={key} value={key} disabled={disabled}>
            <Checkbox checked={selected} />
            <ListItemText primary={label} />
            {helpMessage && (
              <FormHelperText id={getId(key, 'helper-text')} component="span">
                {helpMessage}
              </FormHelperText>
            )}
          </MultiSelectMenuItem>
        ))}
      </Select>
      {hasError && <FormErrorText>{errorMessage}</FormErrorText>}
    </FormControl>
  );
};

function defaultRenderSelectedOptions<TOption>(getOptionLabel: (option: TOption) => ReactNode) {
  return (selectedOptions: TOption[], emptyValueLabel: string) => {
    switch (selectedOptions.length) {
      case 0:
        return emptyValueLabel;
      case 1:
        return getOptionLabel(selectedOptions[0]);
      case 2:
        return selectedOptions.map(getOptionLabel).join(', ');
      default: {
        const [firstOption, ...rest] = selectedOptions;
        return `${getOptionLabel(firstOption)} (+${rest.length} more)`;
      }
    }
  };
}
