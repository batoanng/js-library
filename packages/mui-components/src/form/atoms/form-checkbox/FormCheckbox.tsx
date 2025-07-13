import { FormErrorText } from '@/components';
import { useFieldErrorMessage, useHtmlId } from '@/hooks';
import { FormFieldProps } from '@/types';
import { CheckRounded } from '@mui/icons-material';
import type { FormControlLabelProps } from '@mui/material';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText } from '@mui/material';
import type { ReactNode } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

export type FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = FormFieldProps<TFieldValues, TName> &
  Omit<FormControlLabelProps, 'name' | 'control' | 'checked' | 'onChange' | 'onBlur' | 'value'> & {
    label: ReactNode;
    helpMessage?: ReactNode;

    /** An inverse checkbox will send the value 'false' when checked */
    inverse?: boolean;
  };

export const FormCheckbox = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  id: suppliedId,
  name,
  inverse,
  rules,
  errorMode,
  shouldUnregister,
  label,
  helpMessage,
  ...formControlProps
}: FormCheckboxProps<TFieldValues, TName>) => {
  const id = useHtmlId('form-checkbox', suppliedId, name);

  const {
    field: { ref, name: fieldName, onChange, value: formValue, ...fieldProps },
    fieldState,
  } = useController({
    name,
    rules,
    shouldUnregister,
  });

  const errorMessage = useFieldErrorMessage(fieldName, errorMode);
  const hasError = fieldState.error != null;

  const valueWhenChecked = !inverse;
  const isChecked = formValue === valueWhenChecked;

  const handleChange = () => {
    const nextChecked = !isChecked;
    const nextValue = nextChecked ? valueWhenChecked : !valueWhenChecked;

    onChange(nextValue);
  };

  return (
    <FormControl error={hasError}>
      <FormGroup>
        <FormControlLabel
          {...formControlProps}
          {...fieldProps}
          name={fieldName}
          control={<Checkbox ref={ref} id={id} checkedIcon={<CheckRounded />} checked={isChecked} />}
          label={
            <>
              {label}
              {helpMessage && <FormHelperText component="span">{helpMessage}</FormHelperText>}
            </>
          }
          value={formValue}
          onChange={handleChange}
        />
      </FormGroup>
      {hasError && <FormErrorText>{errorMessage}</FormErrorText>}
    </FormControl>
  );
};
