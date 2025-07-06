import type { OutlinedInputProps } from '@mui/material';
import { FormControl, FormHelperText, FormLabel, OutlinedInput } from '@mui/material';
import { forwardRef, type ReactNode } from 'react';

import { FormErrorText, IconModal } from '@/components';
import { getMaxWidth, type InputWidthVariant } from '@/functions';
import { useHtmlId } from '@/hooks';

export type IconTooltipProps = {
  title: ReactNode;
  subtext?: ReactNode;
  helpText?: ReactNode;
  iconType?: 'info' | 'help';
};

export type TextInputProps = OutlinedInputProps & {
  label: ReactNode;
  helpMessage?: ReactNode;
  errorMessage?: ReactNode;
  inputWidth?: InputWidthVariant;
  infoTooltipProps?: IconTooltipProps;
};

export const TextInput = forwardRef<HTMLDivElement, TextInputProps>((props, ref) => {
  const {
    id: suppliedId,
    name,
    label,
    helpMessage,
    error,
    errorMessage,
    type = 'text',
    inputWidth,
    infoTooltipProps,

    // All these properties get promoted to the `FormControl` then inherited by the `Input`. We are mimicing what the
    // MUI TextField does; see: https://github.com/mui/material-ui/blob/master/packages/mui-material/src/TextField/TextField.js#L154
    className,
    color,
    disabled,
    fullWidth,
    margin,
    required,
    size,
    sx,

    // The rest go to the input component
    ...inputProps
  } = props;

  const infoTooltip = infoTooltipProps && <IconModal {...infoTooltipProps} />;
  const id = useHtmlId('text-input', suppliedId, name);

  return (
    <FormControl
      // Props from AllowedInputProps
      ref={ref}
      className={className}
      color={color}
      disabled={disabled}
      fullWidth={fullWidth}
      margin={margin}
      required={required}
      size={size}
      error={error}
      variant="outlined"
      // Explicit overrides
      sx={sx}
    >
      <FormLabel htmlFor={id}>
        {label} {!helpMessage && infoTooltip}
      </FormLabel>
      {helpMessage && (
        <FormHelperText id={`${id}-helper-text`} component="span">
          {helpMessage}
          {infoTooltip}
        </FormHelperText>
      )}
      <OutlinedInput
        id={id}
        name={name}
        fullWidth={fullWidth}
        type={type}
        style={inputWidth ? { maxWidth: getMaxWidth(inputWidth) } : {}}
        {...inputProps}
      />
      {errorMessage && <FormErrorText>{errorMessage}</FormErrorText>}
    </FormControl>
  );
});
