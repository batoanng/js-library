import type { TextareaAutosizeProps } from '@mui/material';
import { FormControl, FormHelperText, FormLabel, OutlinedInput, Typography } from '@mui/material';
import { forwardRef } from 'react';

import type { TextInputProps } from '@/components';
import { FormErrorText, IconModal } from '@/components';
import { useHtmlId } from '@/hooks';

export type TextAreaProps = Omit<TextInputProps & TextareaAutosizeProps, 'value' | 'maxLength'> & {
  value?: string;
  /**
   * The maximum number of characters allowed in the text field. Note that the text field will show a character counter
   * if this value is set to anything greater than 0. Defaults to 4,000.
   */
  maxLength?: number | null;
  /**
   * Set to `true` to disable showing the character counter below the component, even if a `maxLength` has been set.
   */
  hideCharacterCounter?: boolean;
};

export const TextArea = forwardRef<HTMLDivElement, TextAreaProps>((props, ref) => {
  const {
    id: suppliedId,
    name,
    label,
    helpMessage,
    errorMessage,
    infoTooltipProps,

    // We need these properties within this component, but they will also be forwarded to the `OutlinedInput`
    value,
    maxLength = 4000,
    hideCharacterCounter,

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
    inputProps = {},

    // Anything else gets forwarded to the OutlinedInput
    ...outlinedInputProps
  } = props;

  const id = useHtmlId('text-area', suppliedId, name);
  const hasError = errorMessage != null;
  const infoTooltip = infoTooltipProps && <IconModal {...infoTooltipProps} />;

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
      error={hasError}
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
        multiline
        id={id}
        name={name}
        type="text"
        value={value}
        inputProps={{
          maxLength,
          ...inputProps,
        }}
        {...outlinedInputProps}
      />

      {!hideCharacterCounter && (
        <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {maxLength === null ? `${value?.length ?? 0} characters` : `${value?.length ?? 0} / ${maxLength}`}
        </Typography>
      )}

      {errorMessage && <FormErrorText>{errorMessage}</FormErrorText>}
    </FormControl>
  );
});
