import { FormErrorText } from '@/components';
import { useFieldErrorMessage, useHtmlId } from '@/hooks';
import { FormFieldProps } from '@/types';
import type { FormControlLabelProps } from '@mui/material';
import { Box, FormControlLabel, Switch } from '@mui/material';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

type FormSwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = FormFieldProps<TFieldValues, TName> &
  Omit<FormControlLabelProps, 'name' | 'control' | 'checked' | 'onChange' | 'onBlur' | 'value'>;

export const FormSwitch = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: FormSwitchProps<TFieldValues, TName>
) => {
  const {
    // Form field props
    id: suppliedId,
    name,
    rules,
    shouldUnregister,
    errorMode,

    // Everything else goes to the form control
    ...formControlProps
  } = props;

  const id = useHtmlId('form-switch', suppliedId, name);

  const {
    field: { ref, name: fieldName, value, ...fieldProps },
    fieldState,
  } = useController({
    name,
    rules,
    shouldUnregister,
  });

  const errorMessage = useFieldErrorMessage(fieldName, errorMode);
  const hasError = fieldState.error != null;

  return (
    <Box>
      <FormControlLabel
        {...formControlProps}
        {...fieldProps}
        id={id}
        name={fieldName}
        checked={value}
        control={<Switch ref={ref} />}
      />
      {hasError && <FormErrorText>{errorMessage}</FormErrorText>}
    </Box>
  );
};
