import { FormErrorText, IconModal, IconModalProps } from '@/components';
import { useFieldErrorMessage, useHtmlId } from '@/hooks';
import { FormFieldProps } from '@/types';
import type { ButtonProps, OutlinedInputProps } from '@mui/material';
import { Button, FormControl, FormHelperText, FormLabel, OutlinedInput, Stack, styled } from '@mui/material';
import type { ReactNode } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

const StyledButton = styled(Button)(({ theme }) => ({
  'minWidth': '0',
  'width': '3rem',
  'marginLeft': theme.spacing(1.5),

  '&.numberButton': {
    'padding': theme.spacing(0, 2),
    'borderRadius': '4px',
    'fontSize': '1.5rem',
    'fontWeight': theme.typography.fontWeightRegular,

    '&.MuiButtonBase-root:hover': {
      borderRadius: '4px',
    },

    '&.decrementButton': {
      'backgroundColor': theme.palette.info.light,
      'color': theme.palette.secondary.main,
      'border': `2px solid ${theme.palette.secondary.main}`,

      '&.MuiButtonBase-root:hover': {
        backgroundColor: theme.palette.info.light,
        color: theme.palette.secondary.main,
        border: `2px solid ${theme.palette.secondary.main}`,
      },
    },

    '&.incrementButton': {
      'backgroundColor': theme.palette.secondary.main,
      'color': theme.palette.secondary.contrastText,
      'border': `2px solid ${theme.palette.secondary.main}`,

      '&.MuiButtonBase-root:hover': {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        border: `2px solid ${theme.palette.secondary.main}`,
      },
    },
  },
}));

const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  width: '37.5%',

  [theme.breakpoints.down('sm')]: {
    width: '50%',
  },
}));

const decrementProps = {
  sx: { color: 'secondary' },
  className: 'decrementButton numberButton',
} as Pick<ButtonProps, 'sx' | 'className'>;

const incrementProps = {
  sx: { color: 'secondary' },
  variant: 'outlined',
  className: 'incrementButton numberButton',
} as Pick<ButtonProps, 'sx' | 'variant' | 'className'>;

export type NumberInputProps = Omit<OutlinedInputProps, 'errorMessage' | 'id' | 'name' | 'onChange' | 'ref'> & {
  label: ReactNode;
  helpMessage?: ReactNode;
  errorMessage?: ReactNode;
  min?: number;
  max?: number;
  step?: number;
  optional?: boolean;
  infoTooltipProps?: IconModalProps;
};

export type FormNumberInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = FormFieldProps<TFieldValues, TName> & NumberInputProps;

export const FormNumberInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  errorMode,
  rules,
  shouldUnregister,
  min = 1,
  max = 20,
  step = 1,
  optional,
  infoTooltipProps,

  id: suppliedId,
  label,
  helpMessage,
  required,
  className,
  color,
  disabled,
  fullWidth,
  margin,
  size,
  sx,

  ...muiProps
}: FormNumberInputProps<TFieldValues, TName>) => {
  const id = useHtmlId('form-number-input', suppliedId, name);
  const getId = (component: string) => `${id}-${component}`;

  const {
    field: { name: fieldName, onChange, ref, value: fieldValue, ...fieldProps },
  } = useController<TFieldValues, TName>({
    name,
    rules,
    shouldUnregister,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberTargetValue = parseInt(e.target.value);

    if (isNaN(numberTargetValue)) {
      onChange(null);
    } else if (numberTargetValue <= max && numberTargetValue >= min) {
      onChange(numberTargetValue);
    } else if (numberTargetValue > max || numberTargetValue < min) {
      onChange(!fieldValue ? '' : fieldValue);
    }
  };

  const handleIncrement = () => {
    if (fieldValue == undefined || fieldValue === '') {
      onChange(min);
    } else if (parseInt(fieldValue) <= max - step) {
      const newValue = parseInt(fieldValue) + step;

      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    if (parseInt(fieldValue) >= min + step) {
      const newValue = parseInt(fieldValue) - step;

      onChange(newValue);
    }
  };

  const errorMessage = useFieldErrorMessage(fieldName, errorMode);
  const infoTooltip = infoTooltipProps && <IconModal {...infoTooltipProps} />;

  return (
    <FormControl
      ref={ref}
      className={className}
      color={color}
      disabled={disabled}
      fullWidth={fullWidth}
      margin={margin}
      required={required}
      size={size}
      error={!!errorMessage}
      variant="outlined"
      sx={sx}
    >
      <FormLabel htmlFor={id}>
        {optional ? label + ' (optional)' : label}
        {!helpMessage && infoTooltip}
      </FormLabel>
      {helpMessage && (
        <FormHelperText id={getId('helper-text')} component="span">
          {helpMessage}
          {infoTooltip}
        </FormHelperText>
      )}
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <StyledOutlinedInput
          {...muiProps}
          {...fieldProps}
          type="number"
          id={id}
          fullWidth={fullWidth}
          value={fieldValue}
          onChange={handleChange}
        />
        <StyledButton variant="outlined" color="secondary" {...decrementProps} onClick={handleDecrement}>
          -
        </StyledButton>
        <StyledButton variant="contained" color="secondary" {...incrementProps} onClick={handleIncrement}>
          +
        </StyledButton>
      </Stack>
      {errorMessage && <FormErrorText>{errorMessage}</FormErrorText>}
    </FormControl>
  );
};
